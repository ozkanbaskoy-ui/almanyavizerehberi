import {
  SITE_URL,
  buildInternalPath,
  buildTopicProfile,
  type MarketingTopic,
} from '@/lib/marketing/socialAutomation';

export type SeoIntent = 'informational' | 'commercial' | 'transactional';

export type SeoPageBrief = {
  id: string;
  title: string;
  path: string;
  focusKeyword: string;
  intent: SeoIntent;
  priority: number;
  outline: string[];
  supportingPaths: string[];
};

export type SeoLinkSuggestion = {
  fromPath: string;
  fromLabel: string;
  toPath: string;
  toLabel: string;
  anchorText: string;
  reason: string;
};

export type SeoAutomationSnapshot = {
  generatedAt: string;
  primaryPillars: SeoPageBrief[];
  topicBriefs: SeoPageBrief[];
  linkSuggestions: SeoLinkSuggestion[];
  notes: string[];
};

export type SeoAutomationSnapshotOptions = {
  topicCount?: number;
};

const CORE_PILLARS: SeoPageBrief[] = [
  {
    id: 'home',
    title: 'Almanya Vize Rehberi Ana Sayfa',
    path: '/',
    focusKeyword: 'almanya vizesi',
    intent: 'commercial',
    priority: 100,
    outline: [
      'Almanya vizesi ve iş rotası için ana giriş noktası',
      'Almanya iş, göç ve başvuru ön değerlendirme bağlantıları',
      'Çalışma vizesi, Mavi Kart ve Fırsat Kartı için hızlı yönlendirme',
      'Kanal ve iletişim alanları ile dönüşüm çağrısı',
    ],
    supportingPaths: [
      '/almanya-is',
      '/almanya-goc',
      '/almanya-vizesi',
      '/uygunluk-testi',
    ],
  },
  {
    id: 'almanya-is',
    title: 'Almanya İş Başvurusu Rehberi',
    path: '/almanya-is',
    focusKeyword: 'almanya iş başvurusu',
    intent: 'commercial',
    priority: 99,
    outline: [
      'Almanya iş başvurusu için iş teklifi, CV ve denklik akışı',
      'Çalışma vizesi, Mavi Kart ve Fırsat Kartı karşılaştırması',
      'Başvuruya giden yol ve uygunluk testi',
      'Sık yapılan hatalar ve doğru rota seçimi',
    ],
    supportingPaths: [
      '/hizmetler/calisma-vizesi',
      '/hizmetler/mavi-kart-vizesi',
      '/hizmetler/firsat-karti',
      '/uygunluk-testi',
    ],
  },
  {
    id: 'almanya-goc',
    title: 'Almanya Göç Rehberi',
    path: '/almanya-goc',
    focusKeyword: 'almanya göç',
    intent: 'informational',
    priority: 98,
    outline: [
      'Göç öncesi ve sonrası resmi adımların tek haritası',
      'Çalışma vizesi, Mavi Kart ve Fırsat Kartı için köprü içerik',
      'Göç sonrası oturum ve kurum işlemleri',
      'Blog ve kaynak bağlantıları ile geniş bilgi katmanı',
    ],
    supportingPaths: ['/hizmetler', '/servisler', '/blog'],
  },
  {
    id: 'almanya-vizesi',
    title: 'Almanya Vizesi Rehberi',
    path: '/almanya-vizesi',
    focusKeyword: 'almanya vizesi',
    intent: 'informational',
    priority: 97,
    outline: [
      'Vize rotalarını tek sayfada toparlayan rehber alanı',
      'Çalışma, Mavi Kart ve Fırsat Kartı bağlantıları',
      'Başvuru öncesi karar verme akışı',
      'Ön değerlendirme ve resmi kaynaklar',
    ],
    supportingPaths: ['/hizmetler', '/uygunluk-testi', '/blog'],
  },
  {
    id: 'hizmetler',
    title: 'Almanya Vize Hizmetleri',
    path: '/hizmetler',
    focusKeyword: 'almanya çalışma vizesi',
    intent: 'transactional',
    priority: 95,
    outline: [
      'Çalışma vizesi, Mavi Kart ve Fırsat Kartı hizmetleri',
      'Başvuruya dönük ana hizmetlerin listesi',
      'İş başvurusu rotasına doğrudan köprü',
      'Dönüşüm çağrısı ve ön değerlendirme',
    ],
    supportingPaths: [
      '/hizmetler/calisma-vizesi',
      '/hizmetler/mavi-kart-vizesi',
      '/hizmetler/firsat-karti',
      '/almanya-is',
    ],
  },
  {
    id: 'servisler',
    title: 'Göç Sonrası Hizmetler',
    path: '/servisler',
    focusKeyword: 'oturum izni',
    intent: 'transactional',
    priority: 92,
    outline: [
      'Oturum, yabancılar dairesi ve resmi işlem başlıkları',
      'Göç sonrası sık ihtiyaç duyulan servisler',
      'Kurum takibi ve düzenli süreç yönetimi',
      'Ana rehbere geri dönüş bağlantıları',
    ],
    supportingPaths: [
      '/servisler/oturum-izni-basvurusu-ve-yenilenmesi',
      '/servisler/yabancilar-dairesi-islemleri',
      '/almanya-goc',
    ],
  },
];

const PATH_LABELS = new Map<string, string>([
  ['/', 'Ana Sayfa'],
  ['/almanya-is', 'Almanya İş Başvurusu'],
  ['/almanya-goc', 'Almanya Göç Rehberi'],
  ['/almanya-vizesi', 'Almanya Vizesi Rehberi'],
  ['/hizmetler', 'Almanya Vize Hizmetleri'],
  ['/servisler', 'Göç Sonrası Hizmetler'],
  ['/uygunluk-testi', 'Ön Değerlendirme'],
  ['/blog', 'Blog'],
  ['/hizmetler/calisma-vizesi', 'Çalışma Vizesi'],
  ['/hizmetler/mavi-kart-vizesi', 'Mavi Kart'],
  ['/hizmetler/firsat-karti', 'Fırsat Kartı'],
  ['/servisler/oturum-izni-basvurusu-ve-yenilenmesi', 'Oturum İzni'],
  ['/servisler/yabancilar-dairesi-islemleri', 'Yabancılar Dairesi İşlemleri'],
]);

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cleanOutline(values: string[]) {
  return uniqueStrings(
    values.map((value) => value.trim()).filter(Boolean),
  ).slice(0, 4);
}

function getPathLabel(path: string) {
  return PATH_LABELS.get(path) || path.replace(/^\//, '') || 'Ana Sayfa';
}

function buildPageBrief(base: SeoPageBrief): SeoPageBrief {
  return {
    ...base,
    outline: cleanOutline(base.outline),
    supportingPaths: uniqueStrings(base.supportingPaths),
  };
}

function buildTopicBrief(topic: MarketingTopic): SeoPageBrief {
  const profile = buildTopicProfile(topic);
  const path = buildInternalPath(topic);
  const supportingPaths =
    topic.kind === 'visa'
      ? ['/almanya-is', '/hizmetler', '/uygunluk-testi']
      : ['/almanya-goc', '/servisler', '/uygunluk-testi'];

  return buildPageBrief({
    id: topic.id,
    title: topic.title,
    path,
    focusKeyword: profile.focusKeyword,
    intent: topic.kind === 'visa' ? 'commercial' : 'transactional',
    priority: profile.priority,
    outline: [
      profile.hook,
      profile.bullets[0] || profile.hook,
      profile.bullets[1] || profile.cta,
      profile.cta,
    ],
    supportingPaths,
  });
}

function buildLinkSuggestions(
  primaryPillars: SeoPageBrief[],
  topicBriefs: SeoPageBrief[],
) {
  const suggestions: SeoLinkSuggestion[] = [
    {
      fromPath: '/',
      fromLabel: getPathLabel('/'),
      toPath: '/almanya-is',
      toLabel: getPathLabel('/almanya-is'),
      anchorText: 'Almanya iş başvurusu',
      reason: 'Ana sayfa, iş niyetini en güçlü hub sayfaya taşır.',
    },
    {
      fromPath: '/',
      fromLabel: getPathLabel('/'),
      toPath: '/almanya-goc',
      toLabel: getPathLabel('/almanya-goc'),
      anchorText: 'Almanya göç rehberi',
      reason: 'Genel göç niyetini merkez rehbere aktarır.',
    },
    {
      fromPath: '/',
      fromLabel: getPathLabel('/'),
      toPath: '/almanya-vizesi',
      toLabel: getPathLabel('/almanya-vizesi'),
      anchorText: 'Almanya vizesi',
      reason: 'Vize aramalarının geniş kümeye yayılmasını sağlar.',
    },
    {
      fromPath: '/almanya-is',
      fromLabel: getPathLabel('/almanya-is'),
      toPath: '/hizmetler/calisma-vizesi',
      toLabel: getPathLabel('/hizmetler/calisma-vizesi'),
      anchorText: 'Almanya çalışma vizesi',
      reason: 'İş başvurusu niyetini doğrudan dönüşüm sayfasına bağlar.',
    },
    {
      fromPath: '/almanya-is',
      fromLabel: getPathLabel('/almanya-is'),
      toPath: '/hizmetler/mavi-kart-vizesi',
      toLabel: getPathLabel('/hizmetler/mavi-kart-vizesi'),
      anchorText: 'Mavi Kart',
      reason: 'Nitelikli adayları uygun vize rotasına yönlendirir.',
    },
    {
      fromPath: '/almanya-is',
      fromLabel: getPathLabel('/almanya-is'),
      toPath: '/hizmetler/firsat-karti',
      toLabel: getPathLabel('/hizmetler/firsat-karti'),
      anchorText: 'Fırsat Kartı',
      reason: 'İş arama aşamasındaki kullanıcıyı ilgili rotaya taşır.',
    },
    {
      fromPath: '/almanya-goc',
      fromLabel: getPathLabel('/almanya-goc'),
      toPath: '/servisler/oturum-izni-basvurusu-ve-yenilenmesi',
      toLabel: getPathLabel('/servisler/oturum-izni-basvurusu-ve-yenilenmesi'),
      anchorText: 'Oturum izni',
      reason: 'Göç sonrası aramalarda işlem sayfasını güçlendirir.',
    },
    {
      fromPath: '/almanya-goc',
      fromLabel: getPathLabel('/almanya-goc'),
      toPath: '/servisler/yabancilar-dairesi-islemleri',
      toLabel: getPathLabel('/servisler/yabancilar-dairesi-islemleri'),
      anchorText: 'Yabancılar Dairesi işlemleri',
      reason: 'Resmi süreçlerdeki aramaları servis sayfasına taşır.',
    },
    {
      fromPath: '/almanya-vizesi',
      fromLabel: getPathLabel('/almanya-vizesi'),
      toPath: '/uygunluk-testi',
      toLabel: getPathLabel('/uygunluk-testi'),
      anchorText: 'ön değerlendirme',
      reason: 'Bilgi arayan kullanıcıyı lead akışına taşır.',
    },
    {
      fromPath: '/blog',
      fromLabel: getPathLabel('/blog'),
      toPath: '/almanya-goc',
      toLabel: getPathLabel('/almanya-goc'),
      anchorText: 'Almanya göç rehberi',
      reason: 'Blog trafiğini ana hub sayfaya geri bağlar.',
    },
  ];

  for (const pillar of primaryPillars) {
    for (const supportPath of pillar.supportingPaths) {
      if (supportPath === pillar.path) continue;

      suggestions.push({
        fromPath: pillar.path,
        fromLabel: pillar.title,
        toPath: supportPath,
        toLabel: getPathLabel(supportPath),
        anchorText: getPathLabel(supportPath),
        reason: `${pillar.title} sayfası ile destek içerik arasındaki tarama yolunu güçlendirir.`,
      });
    }
  }

  for (const topic of topicBriefs) {
    suggestions.push({
      fromPath: topic.path,
      fromLabel: topic.title,
      toPath: '/uygunluk-testi',
      toLabel: getPathLabel('/uygunluk-testi'),
      anchorText: 'ön değerlendirme',
      reason: `${topic.title} sayfasından lead akışına tek tık bağlantı sağlar.`,
    });
  }

  return uniqueLinkSuggestions(suggestions);
}

function uniqueLinkSuggestions(items: SeoLinkSuggestion[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = [item.fromPath, item.toPath, item.anchorText].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildSeoAutomationSnapshot(
  topics: MarketingTopic[],
  options: SeoAutomationSnapshotOptions = {},
): SeoAutomationSnapshot {
  const selectedTopics = topics.slice(0, options.topicCount || 6);
  const primaryPillars = CORE_PILLARS.map(buildPageBrief);
  const topicBriefs = selectedTopics.map(buildTopicBrief);
  const linkSuggestions = buildLinkSuggestions(primaryPillars, topicBriefs);

  const notes = uniqueStrings([
    "Günlük cron ana hub sayfalar, topic brief'leri ve iç link önerilerini yeniler.",
    'Hedef odak: Almanya iş, Almanya iş başvurusu, Almanya göç, Almanya vizesi ve çalışma vizesi.',
    'Yapı, mass page spam yerine hub-link-brief döngüsüyle çalışır.',
    `Konu sayısı: ${selectedTopics.length}`,
    `Pillar sayısı: ${primaryPillars.length}`,
    `Link önerisi: ${linkSuggestions.length}`,
    `Site kökü: ${SITE_URL}`,
  ]);

  return {
    generatedAt: new Date().toISOString(),
    primaryPillars,
    topicBriefs,
    linkSuggestions,
    notes,
  };
}
