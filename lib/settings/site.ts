import fs from 'fs';
import path from 'path';

const SETTINGS_DIR = path.join(process.cwd(), 'content', 'settings');
const SITE_SETTINGS_PATH = path.join(SETTINGS_DIR, 'site.json');

export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  instagramUrl: string;
  youtubeUrl: string;
  youtubeChannelId: string;
  calendlyUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Almanya Vize Rehberi',
  tagline:
    'Almanya vize ve göç süreçlerinde profesyonel rehberiniz',
  contactEmail: 'info@almanyavizerehberi.com',
  contactPhone: '+49 178 382 1542',
  whatsappNumber: '+49 178 382 1542',
  instagramUrl: 'https://www.instagram.com/almanyavizerehberi',
  youtubeUrl:
    'https://www.youtube.com/channel/UCYNClRqdbdinZphYGiSGg9Q',
  youtubeChannelId: 'UCYNClRqdbdinZphYGiSGg9Q',
  calendlyUrl:
    'https://calendly.com/almanyavizerehberi/almanya-vize-rehberi',
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
        parsed.contactEmail || DEFAULT_SETTINGS.contactEmail,
      contactPhone:
        parsed.contactPhone || DEFAULT_SETTINGS.contactPhone,
      whatsappNumber:
        parsed.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
      instagramUrl:
        parsed.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
      youtubeUrl: parsed.youtubeUrl || DEFAULT_SETTINGS.youtubeUrl,
      youtubeChannelId:
        parsed.youtubeChannelId ||
        DEFAULT_SETTINGS.youtubeChannelId,
      calendlyUrl:
        parsed.calendlyUrl || DEFAULT_SETTINGS.calendlyUrl,
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
      next.contactEmail || DEFAULT_SETTINGS.contactEmail,
    contactPhone:
      next.contactPhone || DEFAULT_SETTINGS.contactPhone,
    whatsappNumber:
      next.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
    instagramUrl:
      next.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
    youtubeUrl: next.youtubeUrl || DEFAULT_SETTINGS.youtubeUrl,
    youtubeChannelId:
      next.youtubeChannelId || DEFAULT_SETTINGS.youtubeChannelId,
    calendlyUrl:
      next.calendlyUrl || DEFAULT_SETTINGS.calendlyUrl,
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

