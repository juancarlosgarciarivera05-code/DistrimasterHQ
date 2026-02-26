/**
 * DISTRIMASTER HQ - SENTINEL LIFECYCLE RUNNER
 * Este archivo está diseñado para ser desplegado como una Supabase Edge Function.
 * Comando: supabase functions deploy sentinel-expiration-runner
 */

// Fix: Declare Deno global variable to resolve compiler errors in non-Deno-aware environments.
declare const Deno: any;

// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const APP_URL = (Deno.env.get('APP_URL') || 'http://localhost:3000').replace(/\/$/, '');

Deno.serve(async (req: any) => {
  try {
    // 1. Inicializar cliente con Service Role (Power Admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[SENTINEL-SERVER] Iniciando escaneo diario...');

    // 2. Obtener empresas activas
    const { data: companies, error: cError } = await supabaseAdmin
      .from('companies')
      .select('*, profiles(email, full_name)')
      .neq('status', 'SUSPENDED');

    if (cError) throw cError;

    const results = { total: companies?.length || 0, suspended: 0, notified: 0 };

    for (const company of (companies || [])) {
      // Buscar admin (usando join o consulta directa si falla el join)
      let admin = company.profiles?.[0];
      if (!admin) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('email, full_name')
          .eq('company_id', company.id)
          .in('role', ['ADMIN', 'SUPERVISOR'])
          .limit(1)
          .single();
        admin = profile;
      }

      if (!admin) continue;

      const now = new Date();

      // --- LÓGICA ESPECIAL: ENTERPRISE FOUNDER PROGRAM ---
      if (company.plan === 'ENTERPRISE' && company.enterprise_program_stage && company.enterprise_program_stage !== 'none') {
        const entExpDate = new Date(company.enterprise_next_billing_at || company.plan_expires_at);
        const entDiffDays = Math.ceil((entExpDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

        // 1. Recordatorio (T-7)
        if (entDiffDays === 7) {
          await sendRichEmail(admin.email, 'ENTERPRISE_CYCLE_REMINDER', {
            userName: admin.full_name,
            companyName: company.name,
            nextBillingDate: entExpDate.toLocaleDateString('es-CO')
          });
          results.notified++;
          continue; 
        }

        // 2. Fin de Ciclo (Día 0 o vencido)
        if (entDiffDays <= 0) {
          const currentCycle = company.enterprise_cycle_number || 1;
          
          if (currentCycle < 3) {
            // Auto-renovación de ciclo (1 -> 2, 2 -> 3)
            const nextCycle = currentCycle + 1;
            const nextBilling = new Date(entExpDate);
            nextBilling.setDate(nextBilling.getDate() + 90);

            await supabaseAdmin
              .from('companies')
              .update({ 
                enterprise_cycle_number: nextCycle,
                enterprise_next_billing_at: nextBilling.toISOString(),
                enterprise_program_stage: `founder_cycle_${nextCycle}`,
                enterprise_cycle_completed_at: now.toISOString()
              })
              .eq('id', company.id);

            await sendRichEmail(admin.email, 'ENTERPRISE_CYCLE_START', {
              userName: admin.full_name,
              companyName: company.name,
              cycleNumber: nextCycle,
              nextBillingDate: nextBilling.toLocaleDateString('es-CO')
            });
            results.notified++;
          } else if (company.enterprise_program_stage !== 'plan_selection') {
            // Fin de ciclo 3 -> plan_selection
            await supabaseAdmin
              .from('companies')
              .update({ 
                enterprise_program_stage: 'plan_selection',
                enterprise_cycle_completed_at: now.toISOString()
              })
              .eq('id', company.id);

            await sendRichEmail(admin.email, 'ENTERPRISE_PLAN_SELECTION', {
              userName: admin.full_name,
              companyName: company.name
            });
            results.notified++;
          }
          continue; 
        }

        // Si está en plan_selection, no aplicamos suspensión automática
        if (company.enterprise_program_stage === 'plan_selection') {
          continue; 
        }
      }

      const expirationDateStr = company.plan_expires_at || company.trial_ends_at;
      if (!expirationDateStr) continue;

      const expDate = new Date(expirationDateStr);
      const diffInDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

      // ACCIÓN: SUSPENSIÓN (Día 0 o vencido)
      if (diffInDays <= 0) {
        await supabaseAdmin
          .from('companies')
          .update({ status: 'SUSPENDED' })
          .eq('id', company.id);
        
        await sendRichEmail(admin.email, 'EXPIRED', {
          userName: admin.full_name,
          companyName: company.name
        });
        results.suspended++;
      } 
      // ACCIÓN: ALERTA CRÍTICA (T-3)
      else if (diffInDays === 3) {
        await sendRichEmail(admin.email, 'EXPIRATION_3D', {
          userName: admin.full_name,
          companyName: company.name
        });
        results.notified++;
      }
      // ACCIÓN: AVISO PREVENTIVO (T-7)
      else if (diffInDays === 7) {
        await sendRichEmail(admin.email, 'EXPIRATION_7D', {
          userName: admin.full_name,
          companyName: company.name,
          expirationDate: expDate.toLocaleDateString('es-CO')
        });
        results.notified++;
      }
    }

    return new Response(JSON.stringify({ success: true, ...results }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

async function sendRichEmail(to: string, templateId: string, data: Record<string, any>) {
  try {
    const response = await fetch(`${APP_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        templateId,
        data
      })
    });
    return response.ok;
  } catch (err) {
    console.error(`[SENTINEL] Error enviando email ${templateId} a ${to}:`, err);
    return false;
  }
}
