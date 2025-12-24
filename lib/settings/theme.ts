import fs from 'fs';
import path from 'path';

import {
  DEFAULT_THEME_KEY,
  THEME_PRESET_MAP,
  type ThemeCustomColors,
  type ThemeKey,
} from './theme-presets';

export type ThemeSettings = {
  activeTheme: ThemeKey;
  customColors: ThemeCustomColors;
};

const SETTINGS_DIR = path.join(process.cwd(), 'content', 'settings');
const THEME_SETTINGS_PATH = path.join(SETTINGS_DIR, 'theme.json');

const ALLOWED_THEME_KEYS: ThemeKey[] = ['default', 'soft', 'midnight'];

export function getThemeSettings(): ThemeSettings {
  try {
    const raw = fs.readFileSync(THEME_SETTINGS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ThemeSettings> & {
      customColors?: Partial<ThemeCustomColors>;
    };

    const activeTheme: ThemeKey = ALLOWED_THEME_KEYS.includes(
      parsed.activeTheme as ThemeKey,
    )
      ? (parsed.activeTheme as ThemeKey)
      : DEFAULT_THEME_KEY;

    const presetColors =
      THEME_PRESET_MAP[activeTheme]?.colors ??
      THEME_PRESET_MAP[DEFAULT_THEME_KEY].colors;

    const customColors: ThemeCustomColors = {
      heroFrom: parsed.customColors?.heroFrom ?? presetColors.heroFrom,
      heroTo: parsed.customColors?.heroTo ?? presetColors.heroTo,
      videoBg: parsed.customColors?.videoBg ?? presetColors.videoBg,
      videoBorder:
        parsed.customColors?.videoBorder ?? presetColors.videoBorder,
    };

    return {
      activeTheme,
      customColors,
    };
  } catch {
    const presetColors = THEME_PRESET_MAP[DEFAULT_THEME_KEY].colors;
    return {
      activeTheme: DEFAULT_THEME_KEY,
      customColors: presetColors,
    };
  }
}

export function saveThemeSettings(nextSettings: ThemeSettings) {
  if (
    !nextSettings.activeTheme ||
    !ALLOWED_THEME_KEYS.includes(nextSettings.activeTheme)
  ) {
    throw new Error('Geçersiz tema anahtarı');
  }

  const presetColors =
    THEME_PRESET_MAP[nextSettings.activeTheme]?.colors ??
    THEME_PRESET_MAP[DEFAULT_THEME_KEY].colors;

  const toSave: ThemeSettings = {
    activeTheme: nextSettings.activeTheme,
    customColors: {
      heroFrom: nextSettings.customColors.heroFrom || presetColors.heroFrom,
      heroTo: nextSettings.customColors.heroTo || presetColors.heroTo,
      videoBg: nextSettings.customColors.videoBg || presetColors.videoBg,
      videoBorder:
        nextSettings.customColors.videoBorder || presetColors.videoBorder,
    },
  };

  if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
  }

  fs.writeFileSync(
    THEME_SETTINGS_PATH,
    JSON.stringify(toSave, null, 2),
    'utf8',
  );
}

