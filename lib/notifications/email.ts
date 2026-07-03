import nodemailer from 'nodemailer';

import {
  getEmailTemplates,
  type EmailTemplateId,
} from '@/lib/settings/emailTemplates';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT
  ? Number(process.env.SMTP_PORT)
  : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || '';

// Diğer bölümlerin (örneğin admin girişi için OTP)
// SMTP yapılandırmasının hazır olup olmadığını kontrol edebilmesi için.
export function hasSmtpConfig() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

type TemplateVariables = Record<string, string | number | boolean>;

function renderTemplate(
  template: string,
  variables: TemplateVariables,
): string {
  return template.replace(/{{\s*([\w]+)\s*}}/g, (match, key) => {
    const value = variables[key];
    return typeof value === 'undefined' || value === null
      ? match
      : String(value);
  });
}

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendPlainEmail(params: {
  to: string;
  bcc?: string | string[];
  subject: string;
  text: string;
}) {
  if (!hasSmtpConfig()) {
    console.warn(
      '[email] SMTP yapılandırması eksik. E-posta gönderilmeyecek.',
    );
    return {
      ok: false,
      skipped: true,
      subject: params.subject,
      messageId: null,
    };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: SMTP_FROM,
    to: params.to,
    bcc: params.bcc,
    subject: params.subject,
    text: params.text,
  });

  return {
    ok: true,
    skipped: false,
    subject: params.subject,
    messageId: info.messageId || null,
  };
}

export async function sendTemplatedEmail(params: {
  templateId: EmailTemplateId;
  to: string;
  bcc?: string | string[];
  variables: TemplateVariables;
}) {
  if (!hasSmtpConfig()) {
    console.warn(
      '[email] SMTP yapılandırması eksik. E-posta gönderilmeyecek.',
    );
    return {
      ok: false,
      skipped: true,
      subject: '',
      messageId: null,
    };
  }

  const templates = getEmailTemplates();
  const template = templates.templates.find(
    (t) => t.id === params.templateId,
  );

  if (!template) {
    console.warn(
      `[email] Şablon bulunamadı: ${params.templateId}. E-posta gönderilmeyecek.`,
    );
    return {
      ok: false,
      skipped: true,
      subject: '',
      messageId: null,
    };
  }

  const subject = renderTemplate(
    template.subject,
    params.variables,
  );
  const body = renderTemplate(template.body, params.variables);

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: SMTP_FROM,
    to: params.to,
    bcc: params.bcc,
    subject,
    text: body,
  });

  return {
    ok: true,
    skipped: false,
    subject,
    messageId: info.messageId || null,
  };
}
