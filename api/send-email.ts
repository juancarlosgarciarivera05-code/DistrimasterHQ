import { Resend } from 'resend';
import { EMAIL_TEMPLATES } from '../services/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let { to, subject, html, templateId, data: templateData } = req.body;

    // Si se provee un templateId, usar el template correspondiente
    if (templateId && EMAIL_TEMPLATES[templateId]) {
      const template = EMAIL_TEMPLATES[templateId];
      subject = template.subject;
      html = template.html;

      // Reemplazar variables en el subject y html
      if (templateData) {
        Object.keys(templateData).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          subject = subject.replace(regex, templateData[key]);
          html = html.replace(regex, templateData[key]);
        });
      }
    }

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing fields (to, subject, html or templateId)' });
    }

    const data = await resend.emails.send({
      from: 'DistriMaster HQ <notificaciones@distrimasterhq.site>',
      to,
      subject,
      html,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Email send failed' });
  }
}
