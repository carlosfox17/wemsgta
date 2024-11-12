import { SmtpSettings } from '../types';

interface SmtpTestResult {
  success: boolean;
  error?: string;
}

export async function testSmtpConnection(smtpSettings: SmtpSettings): Promise<SmtpTestResult> {
  try {
    if (!smtpSettings) {
      throw new Error('Configurações SMTP não fornecidas');
    }

    const response = await fetch('/api/smtp/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        smtp: {
          host: smtpSettings.host,
          port: smtpSettings.port,
          secure: smtpSettings.secure,
          auth: {
            user: smtpSettings.username,
            pass: smtpSettings.password,
          },
          from: `${smtpSettings.fromName} <${smtpSettings.fromEmail}>`,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      error: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao testar conexão SMTP',
    };
  }
}

export async function sendEmail(
  smtpSettings: SmtpSettings,
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    if (!smtpSettings) {
      throw new Error('Configurações SMTP não fornecidas');
    }

    const response = await fetch('/api/smtp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        smtp: {
          host: smtpSettings.host,
          port: smtpSettings.port,
          secure: smtpSettings.secure,
          auth: {
            user: smtpSettings.username,
            pass: smtpSettings.password,
          },
          from: `${smtpSettings.fromName} <${smtpSettings.fromEmail}>`,
        },
        email: {
          to,
          subject,
          html,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Falha ao enviar email');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

export async function sendProjectNotification(
  smtpSettings: SmtpSettings,
  clientEmail: string,
  clientName: string,
  projectName: string,
  projectDescription: string
): Promise<boolean> {
  const html = `
    <h2>Olá ${clientName},</h2>
    <p>Um novo projeto foi criado para você:</p>
    <h3>${projectName}</h3>
    <p><strong>Descrição:</strong></p>
    <p>${projectDescription}</p>
    <br>
    <p>Entraremos em contato em breve com mais detalhes.</p>
    <br>
    <p>Atenciosamente,<br>${smtpSettings.fromName}</p>
  `;

  return sendEmail(
    smtpSettings,
    clientEmail,
    `Novo Projeto Criado: ${projectName}`,
    html
  );
}