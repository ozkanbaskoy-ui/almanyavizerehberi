export type ThemeKey = 'default' | 'soft' | 'midnight';

export type ThemeCustomColors = {
  heroFrom: string;
  heroTo: string;
  videoBg: string;
  videoBorder: string;
};

export type ThemePreset = {
  key: ThemeKey;
  label: string;
  description: string;
  colors: ThemeCustomColors;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    key: 'default',
    label: 'Klasik Kurumsal (Lacivert / Mavi)',
    description:
      'Mevcut sitedeki lacivert-mavi kurumsal renk paleti ve beyaz zemin kullanılır.',
    colors: {
      heroFrom: '#1E3A8A',
      heroTo: '#0F172A',
      videoBg: '#F8FAFC',
      videoBorder: '#E2E8F0',
    },
  },
  {
    key: 'soft',
    label: 'Soft Mavi (Daha Açık ve Ferah)',
    description:
      'Hero ve vurgu alanlarında daha yumuşak maviler ve açık arkaplanlar kullanılır.',
    colors: {
      heroFrom: '#3B82F6',
      heroTo: '#1D4ED8',
      videoBg: '#EFF6FF',
      videoBorder: '#DBEAFE',
    },
  },
  {
    key: 'midnight',
    label: 'Gece Modu (Koyu Arkaplan)',
    description:
      'Hero ve video bloklarında daha koyu bir zemin ile daha kontrastlı bir görünüm sunar.',
    colors: {
      heroFrom: '#020617',
      heroTo: '#0F172A',
      videoBg: '#020617',
      videoBorder: '#1F2937',
    },
  },
];

export const DEFAULT_THEME_KEY: ThemeKey = 'default';

export const THEME_PRESET_MAP: Record<ThemeKey, ThemePreset> =
  THEME_PRESETS.reduce((acc, preset) => {
    acc[preset.key] = preset;
    return acc;
  }, {} as Record<ThemeKey, ThemePreset>);

