import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

declare const Deno: any;

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APP_URL = (Deno.env.get('APP_URL') || 'http://localhost:3000').replace(/\/$/, '');

// Helper para calcular diferencia de días
const getDaysSince = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

Deno.serve(async (req: any) => {
  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    console.log('[NURTURING-SERVER] Iniciando escaneo de leads...');

    // 1. Obtener empresas que están en proceso de nurturing
    const { data: companies, error } = await supabaseAdmin
      .from('companies')
      .select('*')
      .neq('nurturing_stage', 'COMPLETED');

    if (error) throw error;

    const results = [];

    for (const company of companies) {
      let emailToSend = null;
      let nextStage = company.nurturing_stage;
      const daysSinceLast = company.last_nurturing_sent_at 
        ? getDaysSince(company.last_nurturing_sent_at) 
        : 999;

      // Evitar enviar más de un correo por día
      if (daysSinceLast < 1) continue;

      // --- Lógica de Flujo Sandbox ---
      if (company.plan === 'SANDBOX' && company.sandbox_started_at) {
        const days = getDaysSince(company.sandbox_started_at);
        
        if (days >= 2 && (!company.nurturing_stage || company.nurturing_stage === 'WELCOME_SENT')) {
          emailToSend = 'SANDBOX_VALUE';
          nextStage = 'SANDBOX_DAY_2_SENT';
        } else if (days >= 4 && company.nurturing_stage === 'SANDBOX_DAY_2_SENT') {
          emailToSend = 'SANDBOX_INVITE_TRIAL';
          nextStage = 'SANDBOX_DAY_4_SENT';
        } else if (days >= 6 && company.nurturing_stage === 'SANDBOX_DAY_4_SENT') {
          emailToSend = 'SANDBOX_EXPIRING';
          nextStage = 'SANDBOX_DAY_6_SENT';
        } else if (days >= 7) {
          nextStage = 'COMPLETED';
        }
      }

      // --- Lógica de Flujo Trial 7 Días ---
      else if (company.plan === 'TRIAL' && company.trial_started_at) {
        const days = getDaysSince(company.trial_started_at);

        if (days >= 1 && (!company.nurturing_stage || company.nurturing_stage === 'WELCOME_SENT')) {
          emailToSend = 'TRIAL_ONBOARDING';
          nextStage = 'TRIAL_DAY_1_SENT';
        } else if (days >= 3 && company.nurturing_stage === 'TRIAL_DAY_1_SENT') {
          emailToSend = 'TRIAL_VALUE';
          nextStage = 'TRIAL_DAY_3_SENT';
        } else if (days >= 6 && company.nurturing_stage === 'TRIAL_DAY_3_SENT') {
          emailToSend = 'TRIAL_OFFER';
          nextStage = 'TRIAL_DAY_6_SENT';
        } else if (days >= 8) {
          nextStage = 'COMPLETED';
        }
      }

      // --- Lógica de Flujo Enterprise ---
      else if (company.plan === 'ENTERPRISE') {
        const days = getDaysSince(company.created_at);

        if (days >= 2 && (!company.nurturing_stage || company.nurturing_stage === 'WELCOME_SENT')) {
          emailToSend = 'ENTERPRISE_AUTHORITY';
          nextStage = 'ENTERPRISE_DAY_2_SENT';
        } else if (days >= 5 && company.nurturing_stage === 'ENTERPRISE_DAY_2_SENT') {
          emailToSend = 'ENTERPRISE_VALUE';
          nextStage = 'ENTERPRISE_DAY_5_SENT';
        } else if (days >= 10 && company.nurturing_stage === 'ENTERPRISE_DAY_5_SENT') {
          emailToSend = 'ENTERPRISE_FOLLOWUP';
          nextStage = 'ENTERPRISE_DAY_10_SENT';
        } else if (days >= 11) {
          nextStage = 'COMPLETED';
        }
      }

      // 2. Enviar el correo si corresponde
      if (emailToSend) {
        console.log(`[NURTURING] Enviando ${emailToSend} a ${company.email}`);
        
        try {
          const response = await fetch(`${APP_URL}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: company.email,
              subject: `Nurturing: ${emailToSend}`,
              templateId: emailToSend,
              data: {
                userName: company.owner_name,
                companyName: company.name,
                dashboardLink: `${APP_URL}/dashboard`,
                upgradeLink: `${APP_URL}/onboarding`,
                expirationDate: company.sandbox_expires_at || 'N/A'
              }
            })
          });

          if (response.ok) {
            await supabaseAdmin
              .from('companies')
              .update({
                nurturing_stage: nextStage,
                last_nurturing_sent_at: new Date().toISOString()
              })
              .eq('id', company.id);
            
            results.push({ company: company.name, sent: emailToSend });
          }
        } catch (err) {
          console.error(`[NURTURING] Error enviando a ${company.name}:`, err);
        }
      } else if (nextStage !== company.nurturing_stage) {
        await supabaseAdmin
          .from('companies')
          .update({ nurturing_stage: nextStage })
          .eq('id', company.id);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
