import fs from 'fs';
import path from 'path';

const SETTINGS_DIR = path.join(process.cwd(), 'content', 'settings');
const HOME_SETTINGS_PATH = path.join(SETTINGS_DIR, 'home.json');

export type HomeSettings = {
  hero: {
    kicker: string;
    title: string;
    body: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  videos: {
    title: string;
    body: string;
  };
  services: {
    kicker: string;
    title: string;
    body: string;
  };
};

const DEFAULT_HOME_SETTINGS: HomeSettings = {
  hero: {
    kicker: 'Almanya Vize Rehberi',
    title: "Almanya'daki Hayalinize Giden Yol",
    body:
      "Almanya'ya göç etmek, kariyer yapmak ve eğitim almak isteyenler için modern, şeffaf ve hızlı vize danışmanlığı sunuyoruz.",
    primaryCtaText: 'Başvuru Yap',
    secondaryCtaText: 'Hizmetlerimizi İncele',
  },
  videos: {
    title: 'Almanya Vize Süreçleri için Video Anlatımlar',
    body:
      'Sık sorulan konuları adım adım anlattığımız videoları izleyerek, başvuru sürecinizi daha net ve güvenle yönetebilirsiniz.',
  },
  services: {
    kicker: 'HİZMETLERİMİZ',
    title: "Almanya'ya Açılan Kapınız",
    body:
      "Almanya'da yeni bir hayat kurmak isteyenler için sunduğumuz vize türleriyle, kariyer ve yaşam hedeflerinize güvenli bir yol haritası çiziyoruz.",
  },
};

export function getHomeSettings(): HomeSettings {
  try {
    const raw = fs.readFileSync(HOME_SETTINGS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<HomeSettings>;

    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_HOME_SETTINGS;
    }

    return {
      hero: {
        kicker: parsed.hero?.kicker ?? DEFAULT_HOME_SETTINGS.hero.kicker,
        title: parsed.hero?.title ?? DEFAULT_HOME_SETTINGS.hero.title,
        body: parsed.hero?.body ?? DEFAULT_HOME_SETTINGS.hero.body,
        primaryCtaText:
          parsed.hero?.primaryCtaText ??
          DEFAULT_HOME_SETTINGS.hero.primaryCtaText,
        secondaryCtaText:
          parsed.hero?.secondaryCtaText ??
          DEFAULT_HOME_SETTINGS.hero.secondaryCtaText,
      },
      videos: {
        title: parsed.videos?.title ?? DEFAULT_HOME_SETTINGS.videos.title,
        body: parsed.videos?.body ?? DEFAULT_HOME_SETTINGS.videos.body,
      },
      services: {
        kicker:
          parsed.services?.kicker ?? DEFAULT_HOME_SETTINGS.services.kicker,
        title:
          parsed.services?.title ?? DEFAULT_HOME_SETTINGS.services.title,
        body: parsed.services?.body ?? DEFAULT_HOME_SETTINGS.services.body,
      },
    };
  } catch {
    return DEFAULT_HOME_SETTINGS;
  }
}

export function saveHomeSettings(nextSettings: HomeSettings) {
  if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
  }

  fs.writeFileSync(
    HOME_SETTINGS_PATH,
    JSON.stringify(nextSettings, null, 2),
    'utf8',
  );
}

