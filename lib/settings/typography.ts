import fs from 'fs';
import path from 'path';

const SETTINGS_DIR = path.join(process.cwd(), 'content', 'settings');
const TYPOGRAPHY_SETTINGS_PATH = path.join(
  SETTINGS_DIR,
  'typography.json',
);

export type TypographyScale = 'small' | 'normal' | 'large';

export type TypographySettings = {
  scale: TypographyScale;
};

const DEFAULT_SETTINGS: TypographySettings = {
  scale: 'normal',
};

export function getTypographySettings(): TypographySettings {
  try {
    const raw = fs.readFileSync(TYPOGRAPHY_SETTINGS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<TypographySettings>;

    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_SETTINGS;
    }

    if (
      parsed.scale !== 'small' &&
      parsed.scale !== 'normal' &&
      parsed.scale !== 'large'
    ) {
      return DEFAULT_SETTINGS;
    }

    return {
      scale: parsed.scale,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveTypographySettings(next: TypographySettings) {
  if (
    next.scale !== 'small' &&
    next.scale !== 'normal' &&
    next.scale !== 'large'
  ) {
    throw new Error('Geçersiz tipografi ölçeği');
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

