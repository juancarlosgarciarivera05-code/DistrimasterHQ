import { EMAIL_TEMPLATES } from './emailTemplates';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || 're_JJd37YJs_4zvjxt5qAkXJJRcV57pWDvDH';
const FALLBACK_DOMAIN = window.location.origin;
const INTERNAL_TEAM_EMAIL = 'distrimasterenterprisehq@gmail.com';

/**
 * Procesa una plantilla HTML reemplazando las variables {{variable}} 
 * por los valores reales del objeto de datos.
 */
function processTemplate(html: string, data: Record<string, any>): string {
  let result = html;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value || ''));
  });
  return result;
}

export const emailService = {
  /**
   * Envía un correo electrónico utilizando la infraestructura de Resend
   * y las plantillas predefinidas del sistema.
   */
  async sendEmail(to: string, templateId: string, data: Record<string, any>) {
    try {
      const template = EMAIL_TEMPLATES[templateId];
      if (!template) {
        console.error(`[EMAIL] Plantilla ID ${templateId} no encontrada.`);
        return false;
      }

      // Preparar metadatos base
      const processedData = {
        dashboardLink: `${FALLBACK_DOMAIN}/#/login`,
        upgradeLink: `${FALLBACK_DOMAIN}/#/checkout`,
        planSelectionLink: `${FALLBACK_DOMAIN}/#/app/billing/plans`,
        date: new Date().toLocaleString('es-CO'),
        ...data
      };

      const finalHtml = processTemplate(template.html, processedData);
      const finalSubject = processTemplate(template.subject, processedData);

      // Call our backend proxy to avoid CORS and protect API Key
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [to],
          subject: finalSubject,
          html: finalHtml,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("[EMAIL] Proxy Error:", errData);
      }

      return response.ok;
    } catch (error) {
      console.error("[EMAIL] Error de red:", error);
      return false;
    }
  },

  /**
   * Notifica internamente al equipo sobre un nuevo registro.
   */
  async notifyInternalTeam(flowType: string, userName: string, userEmail: string, companyName: string) {
    return this.sendEmail(INTERNAL_TEAM_EMAIL, 'INTERNAL_NEW_USER_NOTIF', {
      flowType,
      userName,
      userEmail,
      companyName
    });
  },

  /**
   * Envía correo de bienvenida para exploración (Sandbox).
   */
  async sendExploreWelcome(email: string, userName: string) {
    const success = await this.sendEmail(email, 'EXPLORE_WELCOME', { userName });
    if (success) {
      await this.notifyInternalTeam('EXPLORACIÓN (SANDBOX)', userName, email, 'N/A (Sandbox)');
    }
    return success;
  },

  /**
   * Envía correo de activación para Demo de 7 días.
   */
  async send7DayTrialWelcome(email: string, userName: string, companyName: string) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    
    const success = await this.sendEmail(email, 'TRIAL_7D_WELCOME', { 
      userName, 
      companyName,
      expirationDate: expirationDate.toLocaleDateString('es-CO')
    });

    if (success) {
      await this.notifyInternalTeam('DEMO 7 DÍAS', userName, email, companyName);
    }
    return success;
  },

  /**
   * Envía confirmación de solicitud Enterprise.
   */
  async sendEnterpriseConfirmation(email: string, userName: string, companyName: string) {
    const success = await this.sendEmail(email, 'ENTERPRISE_CONFIRMATION', { userName, companyName });
    if (success) {
      await this.notifyInternalTeam('PLAN ENTERPRISE (SOLICITUD)', userName, email, companyName);
    }
    return success;
  },

  /**
   * Envía confirmación de suscripción activada tras pago.
   */
  async sendSubscriptionActivated(email: string, userName: string, companyName: string) {
    const success = await this.sendEmail(email, 'SUBSCRIPTION_ACTIVATED', { userName, companyName });
    if (success) {
      await this.notifyInternalTeam('SUSCRIPCIÓN ACTIVADA (PAGO)', userName, email, companyName);
    }
    return success;
  },

  /**
   * Alias de conveniencia para invitar a nuevos prospectos al periodo Trial.
   */
  async sendTrialInvitation(email: string, userName: string, companyName: string, activationCode: string) {
    const success = await this.sendEmail(email, 'TRIAL_WELCOME', {
      userName,
      companyName,
      activationCode
    });

    return { 
      success, 
      emailSent: success, 
      message: success ? "Invitación procesada." : "Error al enviar el correo." 
    };
  }
};
