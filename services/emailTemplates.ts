export interface EmailTemplate {
  subject: string;
  html: string;
}

/**
 * Assets Oficiales DistriMaster HQ
 */
const ASSETS = {
  BANNER: 'https://htmllisto.com/sentinel_email_banner.png',
  LOGO: 'https://htmllisto.com/dm_logo_email.png'
};

/**
 * Botón Premium compatible con la mayoría de clientes de correo
 */
export const primaryButton = (text: string, url: string) => `
  <div style="text-align: center; padding: 25px 0;">
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:50px;v-text-anchor:middle;width:240px;" arcsize="20%" stroke="f" fillcolor="#137fec">
      <w:anchorlock/>
      <center>
    <![endif]-->
    <a href="${url}" style="
      background: linear-gradient(90deg, #137fec, #3b82f6);
      background-color: #137fec;
      color: #ffffff;
      display: inline-block;
      font-family: 'Helvetica', Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      line-height: 50px;
      text-align: center;
      text-decoration: none;
      width: 240px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 5px 20px rgba(19, 127, 236, 0.4);
    ">${text}</a>
    <!--[if mso]>
      </center>
    </v:roundrect>
    <![endif]-->
  </div>
`;

/**
 * Template Base: Estructura Dark Mode Enterprise
 */
export const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DistriMaster HQ Notification</title>
</head>
<body style="margin:0; padding:0; background-color:#020617; color:#e2e8f0; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#020617; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#05070a; border: 1px solid #1e293b; border-radius: 32px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.6);">
          
          <!-- HEADER BANNER -->
          <tr>
            <td style="padding:0;">
              <img src="${ASSETS.BANNER}" width="600" alt="DistriMaster Banner" style="display:block; width:100%; height:auto; border-bottom: 2px solid #137fec;">
            </td>
          </tr>

          <!-- LOGO AREA -->
          <tr>
            <td align="center" style="padding: 30px 40px 10px 40px;">
              <img src="${ASSETS.LOGO}" width="120" alt="Logo DM" style="display:block;">
              <div style="margin-top: 15px; font-size: 10px; color: #137fec; letter-spacing: 5px; font-weight: 800; text-transform: uppercase;">
                Logística Inteligente
              </div>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 40px 50px; line-height: 1.6; font-size: 16px;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 40px 50px; background-color: #020617; border-top: 1px solid #1e293b; text-align: center;">
              <div style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">
                Infraestructura SaaS Enterprise
              </div>
              <div style="color: #475569; font-size: 11px;">
                © ${new Date().getFullYear()} DistriMaster HQ • Anycast Network<br/>
                <a href="https://distrimasterhq.site" style="color:#137fec; text-decoration:none;">www.distrimasterhq.site</a>
              </div>
              <div style="margin-top: 20px; font-size: 10px; color: #334155;">
                Recibes este correo porque eres un nodo activo en nuestra red de distribución inteligente.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  TRIAL_WELCOME: {
    subject: '🚀 ¡Enlace Establecido! Su Nodo Enterprise está Activo',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 28px; font-weight: 900; margin-bottom: 20px; text-align: center;">¡Hola, {{userName}}!</h2>
      <p style="text-align: center;">Bienvenido a la vanguardia logística. Hemos provisionado el <strong>Plan Piloto Enterprise</strong> para <strong>{{companyName}}</strong>.</p>
      
      <div style="background: rgba(19,127,236,0.05); padding: 30px; border: 1px dashed #137fec; border-radius: 20px; margin: 30px 0; text-align: center;">
        <p style="font-size: 11px; color: #3b82f6; font-weight: 800; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 2px;">Llave de Activación Única</p>
        <div style="font-size: 36px; font-family: 'Courier New', Courier, monospace; font-weight: 900; color: #ffffff; letter-spacing: 10px;">{{activationCode}}</div>
      </div>

      <p>Su organización ahora cuenta con 90 días de acceso total a nuestra <strong>IA Predictiva</strong> y terminales de <strong>Venta SFA</strong>.</p>
      
      ${primaryButton('Acceder a HQ Cockpit', '{{dashboardLink}}')}
      
      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 20px;">* Válido para implementación en Colombia y Latam.</p>
    `)
  },

  EXPLORE_WELCOME: {
    subject: '¿Te gustó lo que viste? Esto apenas comienza 🚀',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola {{userName}},</h2>
      <p>¿Te gustó lo que viste dentro de <strong>DistriMaster HQ</strong>?</p>
      <p>Acabas de entrar en una plataforma diseñada para algo más que operar… Está construida para <strong>escalar distribuidoras</strong>.</p>
      <p>Lo que exploraste es una simulación del sistema real con datos de ejemplo, pero la infraestructura que viste es exactamente la misma que utilizan operaciones en crecimiento para controlar ventas, rutas, inventario y equipos desde un solo núcleo inteligente.</p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <p style="font-size: 14px; font-weight: bold; color: #137fec; margin-bottom: 10px;">Dentro de la plataforma encontrarás seis motores operativos:</p>
        <ul style="font-size: 13px; color: #94a3b8; padding-left: 20px; line-height: 1.8;">
          <li>📦 Gestión inteligente de inventario</li>
          <li>🧭 Optimización de rutas y logística</li>
          <li>💰 Control de ventas y cobranzas</li>
          <li>📊 Inteligencia comercial en tiempo real</li>
          <li>👥 Gestión de fuerza de ventas</li>
          <li>⚙️ Automatización operativa con IA</li>
        </ul>
      </div>

      <p>Esto no es una demo tradicional. Es una vista previa de cómo funciona una distribuidora cuando la tecnología trabaja a favor del negocio.</p>

      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;">

      <h3 style="color: #ffffff; font-size: 18px; font-weight: 800; margin-bottom: 15px;">El siguiente paso es simple</h3>
      <p>Pasar de explorar a operar con tus propios datos. Con la <strong>Demo de 7 días</strong> puedes:</p>
      <ul style="font-size: 14px; color: #94a3b8; padding-left: 20px; margin-bottom: 20px;">
        <li>✅ Cargar tus productos reales</li>
        <li>✅ Configurar tus vendedores</li>
        <li>✅ Simular rutas operativas</li>
        <li>✅ Medir resultados desde el primer día</li>
      </ul>
      <p>Sin riesgo. Sin compromiso técnico.</p>

      ${primaryButton('Quiero DistriMaster para mi empresa', '{{upgradeLink}}')}

      <p style="font-size: 14px; color: #64748b; margin-top: 30px;">Si tienes preguntas, nuestro equipo puede orientarte en minutos. Estás viendo el comienzo de una nueva forma de distribuir.</p>
      <p style="font-weight: bold; color: #ffffff; margin-top: 20px;">Bienvenido al siguiente nivel.</p>
      <p style="font-size: 12px; color: #475569;">Equipo DistriMaster HQ<br/>Infraestructura SaaS para distribución inteligente</p>
    `)
  },

  TRIAL_7D_WELCOME: {
    subject: 'Tu entorno ya está listo. Ahora empieza lo interesante 🚀',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola {{userName}},</h2>
      <p>Tu entorno de <strong>DistriMaster HQ</strong> ya está activo.</p>
      <p>A partir de este momento puedes comenzar a construir una versión digital de tu operación real dentro del sistema.</p>
      <p>El objetivo de estos 7 días es simple: <strong>Que veas cómo funcionaría tu empresa con control total.</strong></p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <p style="font-size: 14px; font-weight: bold; color: #137fec; margin-bottom: 10px;">Puedes empezar por aquí:</p>
        <ul style="font-size: 13px; color: #94a3b8; padding-left: 20px; line-height: 2;">
          <li>✅ Cargar tus productos principales</li>
          <li>✅ Registrar algunos clientes</li>
          <li>✅ Crear tu primer pedido</li>
          <li>✅ Explorar los reportes en tiempo real</li>
        </ul>
      </div>

      <p>No necesitas hacerlo todo hoy. Solo dar el primer paso.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Entrar a mi plataforma', '{{dashboardLink}}')}
        <p style="font-size: 20px; margin-top: 20px;">👇</p>
      </div>

      <p style="text-align: center; font-weight: bold; color: #ffffff;">Nuestro equipo está disponible si necesitas orientación durante la prueba.</p>
      <p style="text-align: center; color: #137fec; font-weight: 800; margin-top: 10px;">Estás a punto de descubrir una forma diferente de gestionar tu distribución.</p>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ
      </p>
    `)
  },

  ENTERPRISE_CONFIRMATION: {
    subject: 'Hemos recibido tu solicitud — iniciamos el proceso',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola,</h2>
      <p>Hemos recibido tu solicitud para conocer <strong>DistriMaster HQ</strong> en un entorno más completo.</p>
      <p>El siguiente paso es ayudarte a evaluar cómo la plataforma puede adaptarse a tu operación real.</p>
      <p>Muchas empresas que llegan a esta etapa buscan algo más que un software… Buscan una infraestructura que les permita organizar, controlar y escalar su distribución con mayor claridad.</p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <p style="font-size: 14px; font-weight: bold; color: #137fec; margin-bottom: 10px;">Por eso existe el Plan Enterprise — Implementación Extendida (90 días):</p>
        <p style="font-size: 13px; color: #94a3b8; margin: 0;">Un periodo diseñado para implementar el sistema con tiempo suficiente, acceso completo y acompañamiento durante el proceso.</p>
      </div>

      <p>En breve nuestro equipo revisará tu información para orientarte en los siguientes pasos.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Explorar opciones disponibles', '{{dashboardLink}}')}
      </div>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ
      </p>
    `)
  },

  INTERNAL_NEW_USER_NOTIF: {
    subject: '🔔 NUEVO REGISTRO: {{flowType}} - {{companyName}}',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 20px; font-weight: 900; margin-bottom: 20px;">Nuevo Lead Detectado</h2>
      <div style="background: #1e293b; padding: 25px; border-radius: 20px; font-size: 14px;">
        <p><strong>Tipo de Flujo:</strong> {{flowType}}</p>
        <p><strong>Nombre:</strong> {{userName}}</p>
        <p><strong>Email:</strong> {{userEmail}}</p>
        <p><strong>Empresa:</strong> {{companyName}}</p>
        <p><strong>Fecha:</strong> {{date}}</p>
      </div>
      <p style="margin-top: 20px;">Favor realizar seguimiento según el protocolo de ventas.</p>
    `)
  },

  INV: {
    subject: '🧾 Documento Digital: {{invoiceId}} - DistriMaster HQ',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola, {{customerName}}</h2>
      <p>Adjuntamos el soporte digital de tu operación comercial. Este documento ha sido generado y transmitido exitosamente.</p>
      
      <div style="background: #1e293b; padding: 30px; border-radius: 24px; margin: 30px 0; text-align: center; border: 1px solid #334155;">
        <p style="font-size: 10px; color: #137fec; font-weight: 800; text-transform: uppercase; margin-bottom: 15px;">Referencia de Documento</p>
        <div style="font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 20px;">{{invoiceId}}</div>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{invoiceId}}" width="120" style="border-radius: 12px; border: 4px solid #ffffff;">
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center;">Este es un documento oficial emitido a través de la infraestructura de DistriMaster HQ.</p>
    `)
  },

  SUBSCRIPTION_ACTIVATED: {
    subject: '💎 Nodo Enterprise Activado: Bienvenido a la Red',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">¡Pago Confirmado!</h2>
      <p>Hola <strong>{{userName}}</strong>, el nodo de <strong>{{companyName}}</strong> ha sido activado permanentemente.</p>
      <p>Tu infraestructura SaaS Enterprise está ahora en modo <strong>OPERATIONAL</strong>. Todas las restricciones han sido removidas.</p>
      
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 20px; padding: 25px; margin: 25px 0; text-align: center;">
        <p style="color: #10b981; font-weight: 900; margin: 0;">SISTEMA EN LÍNEA • ACCESO TOTAL</p>
      </div>

      ${primaryButton('Entrar al Cockpit', '{{dashboardLink}}')}
    `)
  },

  EXPIRATION_7D: {
    subject: '⚠️ Aviso Preventivo: 7 días para renovación de Nodo',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Suscripción Próxima a Vencer</h2>
      <p>Estimado <strong>{{userName}}</strong>,</p>
      <p>Este es un aviso automático del sistema Sentinel. La suscripción de <strong>{{companyName}}</strong> entrará en fase de desconexión en <strong>7 días calendarios</strong> ({{expirationDate}}).</p>
      <p>Para garantizar que su fuerza de ventas no pierda la sincronización en campo, recomendamos procesar la renovación hoy mismo.</p>
      
      ${primaryButton('Renovar Suscripción', '{{upgradeLink}}')}
      
      <p style="font-size: 13px; color: #64748b; font-style: italic;">"La continuidad operativa es la clave de una distribución eficiente."</p>
    `)
  },

  EXPIRATION_3D: {
    subject: '🔴 CRÍTICO: 3 días para suspensión automática',
    html: baseTemplate(`
      <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 16px; padding: 20px; margin-bottom: 30px; text-align: center;">
        <h2 style="color: #f59e0b; font-size: 22px; font-weight: 900; margin: 0;">ALERTA DE PRIORIDAD ALTA</h2>
      </div>
      <p>Hola <strong>{{userName}}</strong>,</p>
      <p>Detectamos un retraso en la renovación del nodo <strong>{{companyName}}</strong>. El sistema Sentinel tiene programada una <strong>suspensión total</strong> en 72 horas.</p>
      <p style="color: #fca5a5;"><strong>Consecuencias de suspensión:</strong> Bloqueo de toma de pedidos, cese de telemetría GPS y desconexión del catálogo digital.</p>
      
      ${primaryButton('Evitar Suspensión', '{{upgradeLink}}')}
    `)
  },

  EXPIRED: {
    subject: '🚫 NODO DESCONECTADO: Suspensión por falta de pago',
    html: baseTemplate(`
      <div style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 16px; padding: 30px; margin-bottom: 30px; text-align: center;">
        <h2 style="color: #ef4444; font-size: 24px; font-weight: 900; margin: 0;">CONEXIÓN INTERRUMPIDA</h2>
        <p style="color: #fca5a5; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 10px;">Status: SUSPENDED</p>
      </div>
      <p>La cuenta de <strong>{{companyName}}</strong> ha sido suspendida automáticamente.</p>
      <p>Los datos permanecen seguros en nuestra bóveda cifrada, pero el acceso a la plataforma administrativa y aplicaciones móviles ha sido revocado.</p>
      
      ${primaryButton('Reactivar Nodo Ahora', '{{upgradeLink}}')}
      
      <p style="font-size: 11px; color: #475569; text-align: center;">Si ya realizó el pago, la reconexión puede tardar hasta 15 minutos en propagarse por la red Anycast.</p>
    `)
  },

  REACTIVATED: {
    subject: '✅ Nodo Restaurado: Bienvenido de nuevo a HQ',
    html: baseTemplate(`
      <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 16px; padding: 30px; margin-bottom: 30px; text-align: center;">
        <h2 style="color: #10b981; font-size: 24px; font-weight: 900; margin: 0;">SISTEMA EN LÍNEA</h2>
        <p style="color: #6ee7b7; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 10px;">Status: OPERATIONAL</p>
      </div>
      <p>¡Buenas noticias! Hemos confirmado la renovación de <strong>{{companyName}}</strong>.</p>
      <p>Todos los servicios han sido habilitados y su tropa en calle puede iniciar sincronización inmediata.</p>
      
      ${primaryButton('Entrar al Dashboard', '{{dashboardLink}}')}
    `)
  },

  // --- FLUIDO SANDBOX (NURTURING) ---
  SANDBOX_VALUE: {
    subject: 'Lo que viste fue solo la superficie… mira esto 👇',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola {{userName}},</h2>
      <p>Muchos creen que <strong>DistriMaster HQ</strong> es solo un software de ventas…</p>
      <p>Pero en realidad es un <strong>motor operativo completo</strong> diseñado para escalar distribuidoras.</p>
      <p>Lo que exploraste fue únicamente una simulación inicial. Detrás existe una arquitectura con 6 motores inteligentes trabajando en conjunto:</p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <div style="margin-bottom: 15px;">
          <p style="font-size: 14px; font-weight: bold; color: #137fec; margin: 0;">⚙️ Motor Comercial</p>
          <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">Gestión de clientes, pedidos y fuerza de ventas en tiempo real.</p>
        </div>
        <div style="margin-bottom: 15px;">
          <p style="font-size: 14px; font-weight: bold; color: #137fec; margin: 0;">📦 Motor de Inventario Inteligente</p>
          <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">Control preciso de stock, rotación y movimientos operativos.</p>
        </div>
        <div style="margin-bottom: 15px;">
          <p style="font-size: 14px; font-weight: bold; color: #137fec; margin: 0;">🚚 Motor Logístico y Rutas</p>
          <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">Optimización de recorridos, entregas y cobertura territorial.</p>
        </div>
        <div style="margin-bottom: 15px;">
          <p style="font-size: 14px; font-weight: bold; color: #137fec; margin: 0;">📊 Motor Financiero</p>
          <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">Trazabilidad completa de ingresos, cartera y rentabilidad.</p>
        </div>
        <div style="margin-bottom: 15px;">
          <p style="font-size: 14px; font-weight: bold; color: #137fec; margin: 0;">🧠 Motor de Inteligencia Artificial</p>
          <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">Análisis predictivo y recomendaciones automáticas.</p>
        </div>
        <div>
          <p style="font-size: 14px; font-weight: bold; color: #137fec; margin: 0;">🌐 Motor de Telemetría Operativa</p>
          <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">Visibilidad total de lo que ocurre en campo, minuto a minuto.</p>
        </div>
      </div>

      <p>Esto no es teoría. Es la infraestructura que permite que una operación deje de ser caótica y pase a ser predecible, escalable y controlada.</p>
      <p>La mayoría de empresas descubre el verdadero valor cuando activan su entorno completo.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Activar mi Demo Completa de 7 Días', '{{upgradeLink}}')}
        <p style="font-size: 20px; margin-top: 20px;">👇</p>
      </div>

      <p style="text-align: center; font-weight: bold; color: #ffffff;">En menos de una hora podrías estar viendo tu propia operación funcionando dentro del sistema.</p>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ<br/>
        Infraestructura SaaS para distribución moderna
      </p>
    `)
  },

  SANDBOX_INVITE_TRIAL: {
    subject: 'Ahora imagina esto funcionando en tu empresa…',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola {{userName}},</h2>
      <p>Explorar la plataforma te permite entender el concepto…</p>
      <p>Pero el verdadero impacto aparece cuando ves <strong>tu propia operación</strong> dentro del sistema.</p>
      <p>Con la Demo de 7 días puedes transformar la experiencia en algo real:</p>
      
      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <ul style="font-size: 14px; color: #94a3b8; padding-left: 20px; line-height: 2;">
          <li>✔ Tus productos cargados</li>
          <li>✔ Tus clientes registrados</li>
          <li>✔ Tus vendedores operando</li>
          <li>✔ Tus rutas organizadas</li>
          <li>✔ Tus indicadores visibles en tiempo real</li>
        </ul>
      </div>

      <p>En pocas horas tendrás una visión completamente diferente de cómo puede funcionar tu empresa.</p>
      <p>Sin instalaciones. Sin procesos complejos. Sin riesgo.</p>
      <p>Solo necesitas activar tu entorno.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Activar mi Demo de 7 Días', '{{upgradeLink}}')}
        <p style="font-size: 20px; margin-top: 20px;">👇</p>
      </div>

      <p style="text-align: center; font-weight: bold; color: #ffffff;">La mayoría de empresas toma la decisión después de ver sus propios datos funcionando.</p>
      <p style="text-align: center; color: #137fec; font-weight: 800; margin-top: 10px;">Ese es el momento donde todo cambia.</p>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ<br/>
        Tecnología para distribuidoras que quieren crecer
      </p>
    `)
  },

  SANDBOX_EXPIRING: {
    subject: 'Tu acceso de exploración está por finalizar…',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola {{userName}},</h2>
      <p>Tu acceso al entorno de exploración de <strong>DistriMaster HQ</strong> estará disponible por poco tiempo más.</p>
      <p>Hasta ahora pudiste ver cómo funciona la plataforma… pero el verdadero valor aparece cuando trabajas con <strong>tu propia operación</strong> dentro del sistema.</p>
      
      <p>Muchas empresas en este punto descubren algo importante: No se trata solo de tecnología. Se trata de tener <strong>control</strong>.</p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <ul style="font-size: 14px; color: #94a3b8; padding-left: 20px; line-height: 2;">
          <li>✅ Control sobre ventas.</li>
          <li>✅ Control sobre inventario.</li>
          <li>✅ Control sobre rutas.</li>
          <li>✅ Control sobre decisiones.</li>
        </ul>
      </div>

      <p>La Demo de 7 días te permite comprobarlo en un entorno real con tus datos.</p>
      <p>Sin compromiso. Sin riesgo técnico. Sin instalaciones.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Quiero probarlo en mi empresa', '{{upgradeLink}}')}
        <p style="font-size: 20px; margin-top: 20px;">👇</p>
      </div>

      <p style="text-align: center; font-weight: bold; color: #ffffff;">Activarlo toma unos minutos y puede cambiar completamente la forma en que gestionas tu distribución.</p>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ<br/>
        Infraestructura SaaS para operaciones que quieren crecer
      </p>
    `)
  },

  // --- FLUIDO TRIAL 7 DÍAS (NURTURING) ---
  TRIAL_ONBOARDING: {
    subject: 'Empieza por esto y verás el potencial rápidamente',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola,</h2>
      <p>La forma más rápida de entender el poder de <strong>DistriMaster HQ</strong> es trabajar con información real.</p>
      <p>Hoy te recomendamos hacer algo muy simple: <strong>Cargar entre 5 y 10 productos principales de tu empresa.</strong></p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <p style="font-size: 14px; font-weight: bold; color: #137fec; margin-bottom: 10px;">Con solo eso podrás:</p>
        <ul style="font-size: 13px; color: #94a3b8; padding-left: 20px; line-height: 2;">
          <li>📊 Ver movimientos de inventario</li>
          <li>💰 Simular ventas</li>
          <li>📦 Crear pedidos</li>
          <li>📈 Explorar indicadores</li>
        </ul>
      </div>

      <p>La mayoría de usuarios tiene su primer “momento de claridad” en menos de una hora.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Continuar configurando mi empresa', '{{dashboardLink}}')}
      </div>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ
      </p>
    `)
  },

  TRIAL_VALUE: {
    subject: 'Aquí es donde las empresas empiezan a notar la diferencia',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola {{userName}},</h2>
      <p>Después de unos días usando <strong>DistriMaster HQ</strong>, normalmente ocurre algo interesante…</p>
      <p>Empiezas a ver información que antes no era visible.</p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <ul style="font-size: 14px; color: #94a3b8; padding-left: 20px; line-height: 2;">
          <li>✅ Ventas organizadas.</li>
          <li>✅ Inventario claro.</li>
          <li>✅ Procesos conectados.</li>
          <li>✅ Indicadores reales.</li>
        </ul>
      </div>

      <p>Eso es lo que permite tomar mejores decisiones.</p>
      <p>La tecnología no cambia un negocio por sí sola. Pero sí permite controlarlo.</p>
      <p>Además, no estás solo durante este proceso. Dentro de la plataforma tienes acceso a herramientas de comunicación y asistencia directa que pueden ayudarte a resolver dudas rápidamente mientras configuras tu operación.</p>
      <p>Nuestro objetivo no es solo que pruebes el sistema… sino que realmente entiendas su potencial.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Seguir explorando mi operación', '{{dashboardLink}}')}
      </div>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ
      </p>
    `)
  },

  TRIAL_OFFER: {
    subject: 'Tu prueba está por terminar. Esto es lo que sigue.',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola {{userName}},</h2>
      <p>Tu periodo de prueba está llegando a su etapa final.</p>
      <p>Hasta ahora pudiste comprobar cómo funciona <strong>DistriMaster HQ</strong> en tu operación.</p>
      <p>El siguiente paso es decidir si quieres mantener el sistema activo y seguir construyendo sobre lo que ya creaste.</p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <p style="font-size: 14px; font-weight: bold; color: #137fec; margin-bottom: 10px;">Al continuar tendrás:</p>
        <ul style="font-size: 13px; color: #94a3b8; padding-left: 20px; line-height: 2;">
          <li>✅ Acceso completo sin interrupciones</li>
          <li>✅ Soporte y acompañamiento dentro de la plataforma</li>
          <li>✅ Herramientas de comunicación interna para tu equipo</li>
          <li>✅ Actualizaciones continuas</li>
          <li>✅ Infraestructura estable</li>
        </ul>
      </div>

      <p>Uno de los factores que más valoran las empresas es poder implementar el sistema con apoyo disponible cuando lo necesitan.</p>
      <p>La mayoría de organizaciones que llega a este punto decide continuar porque ya visualiza el impacto en su operación.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Ver planes disponibles', '{{upgradeLink}}')}
      </div>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ
      </p>
    `)
  },

  TRIAL_EXPIRATION_DAY_7: {
    subject: 'Últimas horas de tu acceso — puedes continuar sin perder lo que construiste',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Hola {{userName}},</h2>
      <p>Hoy finaliza tu acceso de prueba a <strong>DistriMaster HQ</strong>.</p>
      <p>Durante estos días pudiste explorar cómo funciona la plataforma dentro de una operación real.</p>
      <p>Si deseas conservar tu información y seguir utilizando el sistema sin interrupciones, puedes activar un plan en cualquier momento.</p>

      <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <p style="font-size: 14px; font-weight: bold; color: #137fec; margin-bottom: 10px;">Muchas empresas en este punto eligen continuar con el Plan Enterprise de Validación:</p>
        <ul style="font-size: 13px; color: #94a3b8; padding-left: 20px; line-height: 2;">
          <li>✅ Acceso completo a todas las funcionalidades</li>
          <li>✅ Tiempo suficiente para adaptar el sistema a tu operación</li>
          <li>✅ Acompañamiento y soporte durante la implementación</li>
          <li>✅ Un costo mensual más conveniente frente a periodos cortos</li>
        </ul>
      </div>

      <p>Es la forma más segura de validar completamente el impacto de <strong>DistriMaster HQ</strong> en tu empresa antes de tomar decisiones a largo plazo.</p>
      <p>Por supuesto, también puedes elegir el plan que mejor se adapte a tu operación y ritmo de crecimiento.</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 20px; margin-bottom: 20px;">👇</p>
        ${primaryButton('Ver planes y continuar con mi implementación', '{{upgradeLink}}')}
        <p style="font-size: 20px; margin-top: 20px;">👇</p>
      </div>

      <p style="text-align: center; font-weight: bold; color: #ffffff;">Muchas organizaciones comienzan con una prueba… y terminan transformando completamente su forma de trabajar.</p>
      <p style="text-align: center; color: #137fec; font-weight: 800; margin-top: 10px;">La decisión ahora está en tus manos.</p>

      <p style="font-size: 12px; color: #475569; margin-top: 40px;">
        Equipo DistriMaster HQ<br/>
        Infraestructura SaaS para distribuidoras que quieren crecer
      </p>
    `)
  },

  // --- FLUIDO ENTERPRISE (NURTURING) ---
  ENTERPRISE_AUTHORITY: {
    subject: '🏢 Caso de Éxito: Escala Masiva con el Programa Enterprise Founder',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Infraestructura para Líderes</h2>
      <p>Hola {{userName}}, mientras preparamos tu diagnóstico para <strong>{{companyName}}</strong>, queremos compartirte cómo otras grandes distribuidoras están dominando el mercado a través de nuestro <strong>Programa Enterprise Founder</strong>.</p>
      <p>Este programa de implementación extendida (90 días) permite que empresas con más de 100 rutas activas utilicen nuestra <strong>IA Predictiva</strong> para anticipar la demanda y optimizar el inventario sin la presión de una suscripción mensual inmediata.</p>
      
      <div style="border-left: 4px solid #10b981; padding-left: 20px; margin: 30px 0;">
        <p style="font-style: italic; color: #e2e8f0;">"El Programa Founder nos dio el tiempo necesario para integrar DistriMaster HQ en nuestra operación real sin fricciones, duplicando nuestra capacidad de entrega."</p>
        <p style="font-size: 12px; color: #64748b;">— Director de Operaciones, Logística Global S.A.</p>
      </div>

      ${primaryButton('Ver Capacidades del Programa', '{{dashboardLink}}')}
    `)
  },

  ENTERPRISE_VALUE: {
    subject: '🎯 Valor Estratégico: Tu Ventaja Competitiva como Founder',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Más que Software, una Alianza de 90 Días</h2>
      <p>Hola {{userName}}, el <strong>Programa Enterprise Founder</strong> no es solo una licencia; es el despliegue de una infraestructura dedicada para <strong>{{companyName}}</strong> durante un ciclo de implementación extendida.</p>
      <p>Durante estos 90 días, obtendrás soporte VIP 24/7, integraciones personalizadas con tu ERP actual y un panel de BI diseñado para que valides el sistema en condiciones reales antes de elegir tu plan definitivo.</p>
      
      <div style="background: rgba(16, 185, 129, 0.05); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #10b98130;">
        <p style="font-size: 14px; font-weight: bold; color: #10b981; margin-bottom: 10px;">Beneficios del Programa Founder:</p>
        <ul style="font-size: 13px; color: #94a3b8; padding-left: 20px;">
          <li>Ciclo de 90 días para implementación profunda.</li>
          <li>Módulo de IA para predicción de demanda activado.</li>
          <li>Acompañamiento estratégico por consultores senior.</li>
        </ul>
      </div>

      ${primaryButton('Hablar con un Estratega', '{{dashboardLink}}')}
    `)
  },

  ENTERPRISE_FOLLOWUP: {
    subject: '👋 Seguimiento: ¿Listo para el siguiente paso?',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Seguimos aquí para apoyarte</h2>
      <p>Hola {{userName}}, ha pasado unos días desde tu solicitud para <strong>{{companyName}}</strong>.</p>
      <p>Entendemos que una decisión de este nivel requiere análisis. Si tienes preguntas adicionales sobre la implementación técnica o el modelo de costos, estamos listos para resolverlas.</p>
      
      <p style="text-align: center; margin: 30px 0;">¿Te gustaría agendar una breve llamada técnica?</p>

      ${primaryButton('Agendar Llamada', '{{dashboardLink}}')}
    `)
  },

  ENTERPRISE_CYCLE_START: {
    subject: 'Inicio de Ciclo {{cycleNumber}}: Programa Enterprise Founder',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">¡Bienvenido al Ciclo {{cycleNumber}}!</h2>
      <p>Hola {{userName}}, has iniciado oficialmente un nuevo trimestre de implementación dentro del <strong>Programa Enterprise Founder</strong>.</p>
      <p>Este periodo de 90 días está diseñado para que sigas profundizando en la integración de <strong>DistriMaster HQ</strong> con tu operación real.</p>
      
      <div style="background: rgba(19, 127, 236, 0.05); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #137fec30;">
        <p style="font-size: 14px; font-weight: bold; color: #137fec; margin-bottom: 10px;">Objetivos sugeridos para este ciclo:</p>
        <ul style="font-size: 13px; color: #94a3b8; padding-left: 20px; line-height: 2;">
          <li>Refinar la optimización de rutas y logística.</li>
          <li>Expandir el uso de la IA Predictiva en tu inventario.</li>
          <li>Consolidar la trazabilidad financiera de tu operación.</li>
        </ul>
      </div>

      <p>Tu próximo hito de revisión será el: <strong>{{nextBillingDate}}</strong>.</p>
      <p>Recuerda que cuentas con soporte prioritario durante todo este proceso.</p>

      ${primaryButton('Ir al Dashboard', '{{dashboardLink}}')}
    `)
  },

  ENTERPRISE_CYCLE_REMINDER: {
    subject: 'Recordatorio de Ciclo: DistriMaster HQ',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Aviso de Próximo Ciclo</h2>
      <p>Hola {{userName}}, tu ciclo actual de implementación dentro del <strong>Programa Enterprise Founder</strong> finalizará en 7 días.</p>
      <p>Es un buen momento para revisar los avances logrados y preparar los objetivos para el siguiente trimestre.</p>
      
      <div style="background: rgba(255, 255, 255, 0.03); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #1e293b;">
        <p style="font-size: 14px; color: #e2e8f0; margin: 0;">El sistema renovará automáticamente tu acceso al siguiente ciclo de 90 días el: <strong>{{nextBillingDate}}</strong>.</p>
      </div>

      <p>Si tienes dudas sobre el proceso o necesitas asistencia técnica adicional, nuestro equipo está listo para apoyarte.</p>

      ${primaryButton('Revisar mi Operación', '{{dashboardLink}}')}
    `)
  },
  
  ENTERPRISE_PLAN_SELECTION: {
    subject: 'Tu Programa Fundador ha concluido — Selecciona tu Plan Definitivo',
    html: baseTemplate(`
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 20px;">¡Felicidades por completar la implementación!</h2>
      <p>Hola {{userName}}, has completado con éxito los 3 ciclos del <strong>Programa Enterprise Founder</strong>.</p>
      <p>Tu operación ya está madura y lista para escalar. Para mantener tu infraestructura activa y seguir disfrutando de todas las funcionalidades avanzadas, es momento de seleccionar tu plan definitivo.</p>
      
      <div style="background: rgba(19, 127, 236, 0.1); padding: 25px; border-radius: 20px; margin: 25px 0; border: 1px solid #137fec;">
        <p style="font-size: 14px; font-weight: bold; color: #ffffff; margin-bottom: 10px;">¿Qué sigue ahora?</p>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
          Al seleccionar un plan definitivo, conservarás toda tu información, configuraciones, rutas e historial de ventas sin interrupciones.
        </p>
      </div>

      <p>Hemos habilitado un panel especial para que elijas la opción que mejor se adapte al tamaño actual de tu flota.</p>

      ${primaryButton('Seleccionar mi Plan', '{{planSelectionLink}}')}
      
      <p style="font-size: 12px; color: #64748b; margin-top: 30px;">Si necesitas asesoría personalizada para elegir tu plan, responde a este correo y un consultor senior se pondrá en contacto contigo.</p>
    `)
  }
};
