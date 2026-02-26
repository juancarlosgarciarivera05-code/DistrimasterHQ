import { supabase } from './supabaseClient';
import { emailService } from './emailService';
import { Company, User } from '../types';

/**
 * Sentinel Lifecycle Service
 * Motor de automatización encargado de monitorear la salud de las suscripciones
 * y ejecutar acciones preventivas o correctivas basadas en el tiempo.
 */
export const subscriptionLifecycleService = {
  /**
   * Ejecuta un barrido general de todas las empresas para procesar alertas y expiraciones.
   * Diseñado para ser invocado por un Cron Job o manualmente por el SuperAdmin.
   */
  async checkAllExpirations() {
    console.log('[SENTINEL] Iniciando barrido de ciclo de vida...');
    
    try {
      // 1. Obtener todas las empresas que no estén ya suspendidas
      const { data: companies, error: cError } = await supabase
        .from('companies')
        .select('*')
        .neq('status', 'SUSPENDED');

      if (cError) throw cError;
      if (!companies) return { processed: 0, messages: "No hay empresas para procesar." };

      let results = {
        alerts7d: 0,
        alerts3d: 0,
        expired: 0,
        errors: 0
      };

      for (const company of companies) {
        const processResult = await this.processCompanyExpiration(company);
        if (processResult === '7D') results.alerts7d++;
        if (processResult === '3D') results.alerts3d++;
        if (processResult === 'EXPIRED') results.expired++;
        if (processResult === 'ERROR') results.errors++;
      }

      console.log('[SENTINEL] Barrido finalizado:', results);
      return results;
    } catch (error) {
      console.error('[SENTINEL] Error crítico en barrido:', error);
      return null;
    }
  },

  /**
   * Evalúa y procesa la situación de una empresa individual.
   */
  async processCompanyExpiration(company: any): Promise<'7D' | '3D' | 'EXPIRED' | 'OK' | 'ERROR'> {
    const expirationDateStr = company.plan_expires_at || company.trial_ends_at;
    if (!expirationDateStr) return 'OK';

    const now = new Date();
    const expDate = new Date(expirationDateStr);
    
    // Calcular diferencia en días (redondeando hacia arriba)
    const diffInTime = expDate.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    // Obtener contacto administrativo para el envío
    const contact = await this.getAdminContact(company.id);
    if (!contact) {
      console.warn(`[SENTINEL] No se encontró administrador para empresa ${company.name} (${company.id})`);
      return 'ERROR';
    }

    const emailData = {
      userName: contact.full_name,
      companyName: company.name,
      expirationDate: expDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    try {
      // LÓGICA DE TRIGGERS
      
      // Caso 1: Expiración HOY o ya pasada
      if (diffInDays <= 0) {
        console.log(`[SENTINEL] Suspendiendo nodo ${company.name}...`);
        
        // Actualizar base de datos
        await supabase
          .from('companies')
          .update({ status: 'SUSPENDED' })
          .eq('id', company.id);
          
        // Enviar notificación de desconexión
        await emailService.sendEmail(contact.email, 'EXPIRED', emailData);
        return 'EXPIRED';
      }

      // Caso 2: Alerta Crítica (3 días)
      if (diffInDays === 3) {
        await emailService.sendEmail(contact.email, 'EXPIRATION_3D', emailData);
        return '3D';
      }

      // Caso 3: Aviso Preventivo (7 días)
      if (diffInDays === 7) {
        await emailService.sendEmail(contact.email, 'EXPIRATION_7D', emailData);
        return '7D';
      }

      return 'OK';
    } catch (err) {
      console.error(`[SENTINEL] Error procesando ${company.name}:`, err);
      return 'ERROR';
    }
  },

  /**
   * Busca al primer usuario con rol ADMIN o SUPERVISOR para notificar.
   */
  async getAdminContact(companyId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('company_id', companyId)
      .in('role', ['ADMIN', 'SUPERVISOR'])
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    return profile;
  }
};