import fs from 'fs';
import path from 'path';

const SETTINGS_DIR = path.join(process.cwd(), 'content', 'settings');
const EMAIL_TEMPLATES_PATH = path.join(
  SETTINGS_DIR,
  'emailTemplates.json',
);

export type EmailTemplateId =
  | 'application_received'
  | 'payment_received'
  | 'appointment_scheduled'
  | 'admin_login_code';

export type EmailTemplate = {
  id: EmailTemplateId;
  name: string;
  subject: string;
  body: string;
};

export type EmailTemplatesConfig = {
  templates: EmailTemplate[];
};

const DEFAULT_CONFIG: EmailTemplatesConfig = {
  templates: [
    {
      id: 'application_received',
      name: 'BaŸvuru Alnd',
      subject: 'BaŸvurunuz alnd - Almanya Vize Rehberi',
      body: '',
    },
    {
      id: 'payment_received',
      name: '™deme Alnd',
      subject: '™demeniz i‡in teŸekkr ederiz',
      body: '',
    },
    {
      id: 'appointment_scheduled',
      name: 'Randevu OluŸturuldu',
      subject: 'G”rŸme randevunuz oluŸturuldu',
      body: '',
    },
    {
      id: 'admin_login_code',
      name: 'Admin GiriŸ Kodu',
      subject: 'Admin giriŸ kodunuz - Almanya Vize Rehberi',
      body: '',
    },
  ],
};

export function getEmailTemplates(): EmailTemplatesConfig {
  try {
    const raw = fs.readFileSync(EMAIL_TEMPLATES_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<EmailTemplatesConfig>;

    if (!parsed.templates || !Array.isArray(parsed.templates)) {
      return DEFAULT_CONFIG;
    }

    return {
      templates: parsed.templates.map((t) => ({
        id: t.id as EmailTemplateId,
        name: t.name || '',
        subject: t.subject || '',
        body: t.body || '',
      })),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveEmailTemplates(config: EmailTemplatesConfig) {
  const normalised: EmailTemplatesConfig = {
    templates: config.templates.map((t) => ({
      id: t.id,
      name: t.name || '',
      subject: t.subject || '',
      body: t.body || '',
    })),
  };

  if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
  }

  fs.writeFileSync(
    EMAIL_TEMPLATES_PATH,
    JSON.stringify(normalised, null, 2),
    'utf8',
  );
}

