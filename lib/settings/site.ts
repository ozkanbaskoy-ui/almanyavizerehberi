import fs from 'fs';
import path from 'path';

const SETTINGS_DIR = path.join(process.cwd(), 'content', 'settings');
const SITE_SETTINGS_PATH = path.join(SETTINGS_DIR, 'site.json');

function getDefaultContactEmail() {
  return (
    process.env.SITE_CONTACT_EMAIL ||
    process.env.SMTP_USER ||
    process.env.SMTP_FROM ||
    ''
  );
}

function getRuntimeContactEmail() {
  return (process.env.SITE_CONTACT_EMAIL || '').trim();
}

function getDefaultWhatsAppGroupUrl() {
  return (process.env.SITE_WHATSAPP_GROUP_URL || '').trim();
}

function getRuntimeWhatsAppGroupUrl() {
  return (process.env.SITE_WHATSAPP_GROUP_URL || '').trim();
}

function getDefaultWhatsAppChannelUrl() {
  return (process.env.SITE_WHATSAPP_CHANNEL_URL || '').trim();
}

function getRuntimeWhatsAppChannelUrl() {
  return (process.env.SITE_WHATSAPP_CHANNEL_URL || '').trim();
}

export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  whatsappGroupUrl: string;
  whatsappChannelUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  youtubeChannelId: string;
  calendlyUrl: string;
  // Stripe ödeme sayfası için basit 2 adet ödeme linki konfigürasyonu
  payment1Label: string;
  payment1Amount: string;
  payment1Url: string;
  payment2Label: string;
  payment2Amount: string;
  payment2Url: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Almanya Vize Rehberi',
  tagline:
    'Almanya vize ve göç süreçlerinde profesyonel rehberiniz',
  contactEmail: getDefaultContactEmail(),
  contactPhone: '+49 178 382 1542',
  whatsappNumber: '+49 178 382 1542',
  whatsappGroupUrl: getDefaultWhatsAppGroupUrl(),
  whatsappChannelUrl: getDefaultWhatsAppChannelUrl(),
  instagramUrl: 'https://www.instagram.com/almanyavizerehberi',
  youtubeUrl: 'https://www.youtube.com/@AlmanyaVizeRehberi',
  youtubeChannelId: 'UCYNClRqdbdinZphYGiSGg9Q',
  // Basvuru sayfasindaki randevu takvimi icin URL.
  // Artik Calendly degil, Google Takvim randevu planlama linki kullaniliyor.
  calendlyUrl:
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3gacJKI5nfMIm072rGVFxaHRSOFIRECySFmJMdgUZFHFCf5jHn4UrSytZeP8ErAI8H3PVqBaM1?gv=true',
  payment1Label: '1. Ödeme',
  payment1Amount: '',
  payment1Url: '',
  payment2Label: '2. Ödeme',
  payment2Amount: '',
  payment2Url: '',
  maintenanceMode: false,
  maintenanceMessage:
    'Web sitemizde şu anda bakım çalışması yapıyoruz. Kısa süre içinde tekrar hizmetinizde olacağız.',
};

export function getSiteSettings(): SiteSettings {
  try {
    const raw = fs.readFileSync(SITE_SETTINGS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;

    return {
      siteName: parsed.siteName || DEFAULT_SETTINGS.siteName,
      tagline: parsed.tagline || DEFAULT_SETTINGS.tagline,
      contactEmail:
        getRuntimeContactEmail() ||
        parsed.contactEmail ||
        DEFAULT_SETTINGS.contactEmail,
      contactPhone:
        parsed.contactPhone || DEFAULT_SETTINGS.contactPhone,
      whatsappNumber:
        parsed.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
      whatsappGroupUrl:
        getRuntimeWhatsAppGroupUrl() ||
        parsed.whatsappGroupUrl ||
        DEFAULT_SETTINGS.whatsappGroupUrl,
      whatsappChannelUrl:
        getRuntimeWhatsAppChannelUrl() ||
        parsed.whatsappChannelUrl ||
        DEFAULT_SETTINGS.whatsappChannelUrl,
      instagramUrl:
        parsed.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
      youtubeUrl: parsed.youtubeUrl || DEFAULT_SETTINGS.youtubeUrl,
      youtubeChannelId:
        parsed.youtubeChannelId ||
        DEFAULT_SETTINGS.youtubeChannelId,
      calendlyUrl:
        parsed.calendlyUrl || DEFAULT_SETTINGS.calendlyUrl,
      payment1Label:
        parsed.payment1Label || DEFAULT_SETTINGS.payment1Label,
      payment1Amount:
        parsed.payment1Amount || DEFAULT_SETTINGS.payment1Amount,
      payment1Url:
        parsed.payment1Url || DEFAULT_SETTINGS.payment1Url,
      payment2Label:
        parsed.payment2Label || DEFAULT_SETTINGS.payment2Label,
      payment2Amount:
        parsed.payment2Amount || DEFAULT_SETTINGS.payment2Amount,
      payment2Url:
        parsed.payment2Url || DEFAULT_SETTINGS.payment2Url,
      maintenanceMode:
        typeof parsed.maintenanceMode === 'boolean'
          ? parsed.maintenanceMode
          : DEFAULT_SETTINGS.maintenanceMode,
      maintenanceMessage:
        parsed.maintenanceMessage ||
        DEFAULT_SETTINGS.maintenanceMessage,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSiteSettings(next: SiteSettings) {
  const toSave: SiteSettings = {
    siteName: next.siteName || DEFAULT_SETTINGS.siteName,
    tagline: next.tagline || DEFAULT_SETTINGS.tagline,
    contactEmail:
      getRuntimeContactEmail() ||
      next.contactEmail ||
      DEFAULT_SETTINGS.contactEmail,
    contactPhone:
      next.contactPhone || DEFAULT_SETTINGS.contactPhone,
    whatsappNumber:
      next.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
    whatsappGroupUrl:
      getRuntimeWhatsAppGroupUrl() ||
      next.whatsappGroupUrl ||
      DEFAULT_SETTINGS.whatsappGroupUrl,
    whatsappChannelUrl:
      getRuntimeWhatsAppChannelUrl() ||
      next.whatsappChannelUrl ||
      DEFAULT_SETTINGS.whatsappChannelUrl,
    instagramUrl:
      next.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
    youtubeUrl: next.youtubeUrl || DEFAULT_SETTINGS.youtubeUrl,
    youtubeChannelId:
      next.youtubeChannelId || DEFAULT_SETTINGS.youtubeChannelId,
    calendlyUrl:
      next.calendlyUrl || DEFAULT_SETTINGS.calendlyUrl,
    payment1Label:
      next.payment1Label || DEFAULT_SETTINGS.payment1Label,
    payment1Amount:
      next.payment1Amount || DEFAULT_SETTINGS.payment1Amount,
    payment1Url: next.payment1Url || DEFAULT_SETTINGS.payment1Url,
    payment2Label:
      next.payment2Label || DEFAULT_SETTINGS.payment2Label,
    payment2Amount:
      next.payment2Amount || DEFAULT_SETTINGS.payment2Amount,
    payment2Url: next.payment2Url || DEFAULT_SETTINGS.payment2Url,
    maintenanceMode:
      typeof next.maintenanceMode === 'boolean'
        ? next.maintenanceMode
        : DEFAULT_SETTINGS.maintenanceMode,
    maintenanceMessage:
      next.maintenanceMessage ||
      DEFAULT_SETTINGS.maintenanceMessage,
  };

  if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
  }

  fs.writeFileSync(
    SITE_SETTINGS_PATH,
    JSON.stringify(toSave, null, 2),
    'utf8',
  );
}
