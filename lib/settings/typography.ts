import fs from 'fs';
import path from 'path';

const SETTINGS_DIR = path.join(process.cwd(), 'content', 'settings');
const TYPOGRAPHY_SETTINGS_PATH = path.join(
  SETTINGS_DIR,
  'typography.json',
);

export type TypographyScale = 'small' | 'normal' | 'large';
export type TypographyFont = 'plus-jakarta' | 'inter' | 'roboto';

export type TypographySettings = {
  scale: TypographyScale;
  font: TypographyFont;
};

const DEFAULT_SETTINGS: TypographySettings = {
  scale: 'normal',
  font: 'plus-jakarta',
};

export function getTypographySettings(): TypographySettings {
  try {
    const raw = fs.readFileSync(TYPOGRAPHY_SETTINGS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<TypographySettings>;

    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_SETTINGS;
    }

    const scale: TypographyScale =
      parsed.scale === 'small' ||
      parsed.scale === 'normal' ||
      parsed.scale === 'large'
        ? parsed.scale
        : DEFAULT_SETTINGS.scale;

    const font: TypographyFont =
      parsed.font === 'inter' ||
      parsed.font === 'roboto' ||
      parsed.font === 'plus-jakarta'
        ? parsed.font
        : DEFAULT_SETTINGS.font;

    return { scale, font };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveTypographySettings(next: TypographySettings) {
  const validScale =
    next.scale === 'small' ||
    next.scale === 'normal' ||
    next.scale === 'large';

  const validFont =
    next.font === 'plus-jakarta' ||
    next.font === 'inter' ||
    next.font === 'roboto';

  if (!validScale) {
    throw new Error('Geçersiz tipografi ölçeği');
  }

  if (!validFont) {
    throw new Error('Geçersiz yazı tipi seçimi');
  }

  if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
  }

  fs.writeFileSync(
    TYPOGRAPHY_SETTINGS_PATH,
    JSON.stringify(next, null, 2),
    'utf8',
  );
}

