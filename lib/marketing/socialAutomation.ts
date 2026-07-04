const DEFAULT_SITE_URL = 'https://www.almanyavizerehberi.com';

export const SITE_URL = DEFAULT_SITE_URL;

export type MarketingTopicType = 'visa' | 'service';

export type SocialChannel =
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'linkedin'
  | 'telegram'
  | 'whatsapp_status'
  | 'tiktok'
  | 'youtube_shorts';

export type SocialTone = 'kurumsal' | 'samimi' | 'donusum';

export type MarketingTopic = {
  id: string;
  kind: MarketingTopicType;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  source: string;
  sitePath: string;
  fullUrl: string;
  focusKeyword: string;
  audience: string;
  priority: number;
};

export type TopicProfile = {
  focusKeyword: string;
  audience: string;
  hook: string;
  bullets: string[];
  hashtags: string[];
  reelHook: string;
  carouselSlides: string[];
  weeklyAngles: string[];
  cta: string;
  priority: number;
};

export type SocialChannelCopy = {
  id: SocialChannel;
  label: string;
  characterLimit: number;
  copy: string;
};

export type RotationPlanItem = {
  week: number;
  day: string;
  time: string;
  channel: SocialChannel;
  topic: MarketingTopic;
  angle: string;
  copy: string;
};

export type AutomationQueueItem = {
  slot: number;
  week: number;
  day: string;
  time: string;
  channel: SocialChannel;
  topic: Pick<MarketingTopic, 'id' | 'kind' | 'slug' | 'title'>;
  angle: string;
  topicUrl: string;
  leadUrl: string;
  copy: string;
};

export type SeoIdeaItem = {
  order: number;
  topic: Pick<MarketingTopic, 'id' | 'kind' | 'slug' | 'title'>;
  focusKeyword: string;
  title: string;
  angle: string;
  outline: string[];
};

export type SocialAutomationSnapshot = {
  generatedAt: string;
  tone: SocialTone;
  leadPath: string;
  channels: SocialChannel[];
  campaigns: SocialCampaign[];
  rotationPlan: RotationPlanItem[];
  distributionQueue: AutomationQueueItem[];
  seoQueue: SeoIdeaItem[];
  notes: string[];
};

export type SocialAutomationSnapshotOptions = {
  tone?: SocialTone;
  channels?: SocialChannel[];
  leadPath?: string;
  campaignCount?: number;
  rotationCount?: number;
  distributionCount?: number;
  seoCount?: number;
};

export type SocialCampaign = {
  topic: MarketingTopic;
  topicUrl: string;
  leadUrl: string;
  focusKeyword: string;
  audience: string;
  hashtags: string[];
  carouselSlides: string[];
  reelScript: string[];
  platformCopies: SocialChannelCopy[];
  notes: string[];
};

export type SocialCampaignOptions = {
  tone?: SocialTone;
  channels?: SocialChannel[];
  leadPath?: string;
};

export type RotationPlanOptions = {
  tone?: SocialTone;
  channels?: SocialChannel[];
  count?: number;
  topicCount?: number;
};

export const SOCIAL_CHANNEL_OPTIONS: Array<{
  id: SocialChannel;
  label: string;
  description: string;
  characterLimit: number;
  defaultSelected: boolean;
}> = [
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Karusel ve Reels metni için ana format.',
    characterLimit: 2200,
    defaultSelected: true,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Uzun açıklama ve topluluk paylaşımı.',
    characterLimit: 5000,
    defaultSelected: true,
  },
  {
    id: 'x',
    label: 'X',
    description: 'Kısa, hızlı ve keskin sosyal metin.',
    characterLimit: 280,
    defaultSelected: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Kurumsal otorite ve uzmanlık tonu.',
    characterLimit: 3000,
    defaultSelected: true,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    description: 'Kanal duyurusu ve kısa bilgilendirme.',
    characterLimit: 2000,
    defaultSelected: true,
  },
  {
    id: 'whatsapp_status',
    label: 'WhatsApp Durum',
    description: 'Kısa, dikkat çekici durum metni.',
    characterLimit: 500,
    defaultSelected: true,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    description: 'Kısa video caption ve hook metni.',
    characterLimit: 2200,
    defaultSelected: true,
  },
  {
    id: 'youtube_shorts',
    label: 'YouTube Shorts',
    description: 'Shorts başlığı ve açıklama metni.',
    characterLimit: 5000,
    defaultSelected: true,
  },
];

export const SOCIAL_TONE_OPTIONS: Array<{
  id: SocialTone;
  label: string;
  description: string;
}> = [
  {
    id: 'kurumsal',
    label: 'Kurumsal',
    description: 'Daha resmi ve güven veren ifade.',
  },
  {
    id: 'samimi',
    label: 'Samimi',
    description: 'Daha sıcak ve günlük dil.',
  },
  {
    id: 'donusum',
    label: 'Dönüşüm',
    description: 'Daha doğrudan lead odaklı ifade.',
  },
];

const DEFAULT_ROTATION_DAYS = [
  'Pazartesi',
  'Cuma',
  'Salı',
  'Perşembe',
  'Çarşamba',
  'Cumartesi',
];

const DEFAULT_ROTATION_TIMES = [
  '19:30',
  '12:30',
  '09:00',
  '18:00',
  '20:00',
  '10:00',
];

const DEFAULT_HASHTAGS = [
  '#almanyavize',
  '#almanyagog',
  '#almanyavizerehberi',
  '#vizedanismanligi',
];

const TOPIC_PROFILES: Record<
  string,
  Partial<TopicProfile>
> = {
  'calisma-vizesi': {
    focusKeyword: 'almanya çalışma vizesi',
    audience: "Almanya'da iş teklifi alan adaylar",
    hook: 'Almanya çalışma vizesi için başvuru yapmadan önce bu 3 noktayı netleştirin.',
    bullets: [
      'İş teklifi ve sözleşme dosyası hazır mı?',
      'Diploma ve mesleki uygunluk doğru eşleşti mi?',
      'Randevu ve evrak sırası önceden planlandı mı?',
    ],
    hashtags: [
      '#almanyacalismavizesi',
      '#almanyagoc',
      '#isbulma',
      '#almanyavize',
      '#vize',
    ],
    reelHook: 'Almanya çalışma vizesinde en sık yapılan 3 hata',
    carouselSlides: [
      'Almanya çalışma vizesi',
      'Kimler başvurabilir?',
      'Gerekli belgeler',
      'Süreçte en sık hata',
      'Ön değerlendirme çağrısı',
    ],
    weeklyAngles: [
      'Kimler için uygun?',
      'Belgeler ve hazırlık',
      'Süreçte kritik hata',
      'Ön değerlendirme çağrısı',
    ],
    cta: 'Ön değerlendirme formunu doldurun.',
    priority: 100,
  },
  'mavi-kart-vizesi': {
    focusKeyword: 'almanya mavi kart',
    audience: 'Yüksek nitelikli uzmanlar ve profesyoneller',
    hook: 'Mavi Kart, doğru aday için Almanya yolunu hızlandırır. Önce kriterleri doğru okuyun.',
    bullets: [
      'Maaş ve pozisyon eşleşmesi kontrol edilir.',
      'Tanınan diploma ve iş teklifi birlikte değerlendirilir.',
      'Uzun dönem oturum avantajları planlanır.',
    ],
    hashtags: [
      '#mavikart',
      '#blaukarte',
      '#almanyacalismavizesi',
      '#almanyagog',
      '#uzman',
    ],
    reelHook: 'Mavi Kart mı, çalışma vizesi mi? Farkı kısa kısa',
    carouselSlides: [
      'Mavi Kart nedir?',
      'Kimler için güçlü seçenek?',
      'Maaş ve diploma kriteri',
      'Uzun dönem avantajı',
      'Ön değerlendirme çağrısı',
    ],
    weeklyAngles: [
      'Kimler için uygun?',
      'Maaş kriteri',
      'Diploma uygunluğu',
      'Başvuru çağrısı',
    ],
    cta: 'Uygunluk kontrolünü şimdi yapın.',
    priority: 98,
  },
  'firsat-karti': {
    focusKeyword: 'almanya fırsat kartı',
    audience: 'Almanya’da iş aramak isteyen adaylar',
    hook: 'Fırsat Kartı ile iş arama sürecini planlı ve kontrollü yürütün.',
    bullets: [
      'Puan sistemi ve dil seviyesi birlikte okunur.',
      'Geçim planı başvuru öncesi netleştirilir.',
      'İş arama sürecine uygun strateji hazırlanır.',
    ],
    hashtags: [
      '#firsatkarti',
      '#chancenkarte',
      '#almanyaisarama',
      '#almanyagoc',
      '#almanyavize',
    ],
    reelHook: "Fırsat Kartı ile Almanya'da iş arama nasıl olur?",
    carouselSlides: [
      'Fırsat Kartı nedir?',
      'Kimler için uygun?',
      'Puan ve dil kriteri',
      'İş arama stratejisi',
      'Ön değerlendirme çağrısı',
    ],
    weeklyAngles: [
      'Kimler için uygun?',
      'Puan sistemi',
      'Dil ve geçim planı',
      'Başvuru çağrısı',
    ],
    cta: 'Başvuru öncesi uygunluk kontrolü yapın.',
    priority: 96,
  },
  'oturum-izni-basvurusu-ve-yenilenmesi': {
    focusKeyword: 'almanya oturum izni',
    audience:
      "Almanya'ya yerleşmiş ve oturumunu güncellemek isteyen kişiler",
    hook: 'Oturum izni başvurusu ve yenilemesinde gecikme, tüm planı etkiler.',
    bullets: [
      'Süre bitimi önceden takip edilir.',
      'Belgeler eksiksiz hazırlanır.',
      'Başvuru sonrası takip düzenli tutulur.',
    ],
    hashtags: [
      '#oturumizni',
      '#almanyagoc',
      '#almanyadahayat',
      '#vizedanismanligi',
    ],
    reelHook: 'Oturum yenilemede en çok unutulan 3 adım',
    carouselSlides: [
      'Oturum izni yenileme',
      'Ne zaman başvurulur?',
      'Hangi belgeler gerekir?',
      'Sık yapılan hata',
      'Destek için iletişim',
    ],
    weeklyAngles: [
      'Takvim kontrolü',
      'Belge listesi',
      'Takip ve randevu',
      'Destek çağrısı',
    ],
    cta: 'Süre bitmeden süreci planlayın.',
    priority: 88,
  },
  'yabancilar-dairesi-islemleri': {
    focusKeyword: 'yabancılar dairesi işlemleri',
    audience: "Almanya'da resmi işlemlerle uğraşan kişiler",
    hook: 'Yabancılar Dairesi sürecinde küçük bir eksik büyük gecikme yaratabilir.',
    bullets: [
      'Randevu ve evrak takibi sistemli yapılır.',
      'Eksik belge riski önceden azaltılır.',
      'Güncel prosedür değişiklikleri izlenir.',
    ],
    hashtags: [
      '#yabancilardairesi',
      '#almanyagoc',
      '#almanyadahukuk',
      '#almanyavize',
    ],
    reelHook: 'Yabancılar Dairesi randevusunda dikkat edilecekler',
    carouselSlides: [
      'Yabancılar Dairesi',
      'Randevu öncesi hazırlık',
      'Evrak kontrolü',
      'Gecikme nasıl önlenir?',
      'Destek için iletişim',
    ],
    weeklyAngles: [
      'Randevu öncesi',
      'Belge eksikleri',
      'İşlem takibi',
      'Destek çağrısı',
    ],
    cta: 'Randevu öncesi kontrol listesi alın.',
    priority: 84,
  },
};

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL
  );
}

function normalizeText(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

function stripTrailingPeriod(value: string) {
  return value.replace(/[.。]+$/, '');
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function truncateToWordBoundary(value: string, limit: number) {
  if (value.length <= limit) return value;
  const clipped = value.slice(0, Math.max(0, limit - 1));
  const lastSpace = clipped.lastIndexOf(' ');
  if (lastSpace <= 0) return `${clipped.trim()}…`;
  return `${clipped.slice(0, lastSpace).trim()}…`;
}

function buildAbsoluteUrl(path: string, params?: Record<string, string>) {
  const url = new URL(path, getSiteUrl());
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

function buildTopicBaseProfile(
  topic: Pick<MarketingTopic, 'kind' | 'slug' | 'title' | 'seoDescription'>,
): TopicProfile {
  const title = normalizeText(topic.title);
  const summary = stripTrailingPeriod(normalizeText(topic.seoDescription));
  const slug = topic.slug;

  const profile = TOPIC_PROFILES[slug] || {};
  const focusKeyword =
    profile.focusKeyword || title.toLowerCase();
  const audience =
    profile.audience ||
    (topic.kind === 'visa'
      ? 'Almanya hedefi olan adaylar'
      : "Almanya'da sürecini yöneten kişiler");
  const hook =
    profile.hook ||
    `${title} için kısa kontrol listesi: ${summary}`;
  const bullets =
    profile.bullets || [
      summary,
      'Belgeleri doğru sırayla hazırlayın.',
      'Süreçteki kritik adımları önceden planlayın.',
    ];
  const hashtags =
    profile.hashtags || DEFAULT_HASHTAGS;
  const reelHook =
    profile.reelHook || `${title} için 30 saniyelik kontrol listesi`;
  const carouselSlides =
    profile.carouselSlides || [
      title,
      'Kimler için uygun?',
      'Gerekli belgeler',
      'Süreçte kritik adımlar',
      'Başvuru çağrısı',
    ];
  const weeklyAngles =
    profile.weeklyAngles || [
      'Kimler için uygun?',
      'Belgeler ve hazırlık',
      'Süreçte kritik hata',
      'Başvuru çağrısı',
    ];
  const cta =
    profile.cta || 'Ön değerlendirme formunu doldurun.';
  const priority =
    profile.priority ?? (topic.kind === 'visa' ? 70 : 60);

  return {
    focusKeyword,
    audience,
    hook,
    bullets: uniqueStrings(bullets.map(normalizeText)),
    hashtags: uniqueStrings(hashtags),
    reelHook: normalizeText(reelHook),
    carouselSlides: uniqueStrings(
      carouselSlides.map(normalizeText),
    ),
    weeklyAngles: uniqueStrings(weeklyAngles),
    cta: normalizeText(cta),
    priority,
  };
}

export function buildInternalPath(
  topic: Pick<MarketingTopic, 'kind' | 'slug'>,
) {
  if (topic.kind === 'visa') {
    return `/hizmetler/${topic.slug}`;
  }

  return `/servisler/${topic.slug}`;
}

export function buildTopicProfile(
  topic: Pick<MarketingTopic, 'kind' | 'slug' | 'title' | 'seoDescription'>,
) {
  return buildTopicBaseProfile(topic);
}

export function buildTopicUrl(topic: MarketingTopic) {
  return buildAbsoluteUrl(topic.sitePath);
}

export function buildLeadUrl(
  topic: MarketingTopic,
  channel: SocialChannel = 'instagram',
  leadPath = '/uygunluk-testi',
) {
  return buildAbsoluteUrl(leadPath, {
    utm_source: channel,
    utm_medium: 'social',
    utm_campaign: topic.slug,
    utm_content: 'lead-form',
  });
}

function toneLeadIn(
  topic: MarketingTopic,
  profile: TopicProfile,
  tone: SocialTone,
) {
  if (tone === 'kurumsal') {
    return `${topic.title} için net yol haritası`;
  }

  if (tone === 'samimi') {
    return `Bunu netleştirelim: ${topic.title}`;
  }

  return `${topic.title} için başvuru öncesi kritik notlar`;
}

function buildInstagramCopy(
  topic: MarketingTopic,
  profile: TopicProfile,
  topicUrl: string,
  tone: SocialTone,
) {
  const lead = toneLeadIn(topic, profile, tone);
  return normalizeText(`
    ${lead}

    ${profile.hook}

    ${profile.bullets.map((item) => `• ${item}`).join('\n')}

    ${profile.cta}
    ${topicUrl}
    ${profile.hashtags.join(' ')}
  `);
}

function buildFacebookCopy(
  topic: MarketingTopic,
  profile: TopicProfile,
  topicUrl: string,
  tone: SocialTone,
) {
  const lead = toneLeadIn(topic, profile, tone);
  return normalizeText(`
    ${lead}

    ${profile.hook}

    ${profile.bullets.map((item) => `- ${item}`).join('\n')}

    ${profile.cta}
    ${topicUrl}
    ${profile.hashtags.slice(0, 5).join(' ')}
  `);
}

function buildLinkedInCopy(
  topic: MarketingTopic,
  profile: TopicProfile,
  topicUrl: string,
  tone: SocialTone,
) {
  const intro =
    tone === 'kurumsal'
      ? `Almanya Vize Rehberi olarak ${topic.title} için özet yol haritası paylaşıyoruz.`
      : `${topic.title} konusunda kısa ama net bir rehber hazırladık.`;

  return normalizeText(`
    ${intro}

    ${profile.hook}

    ${profile.bullets.map((item) => `- ${item}`).join('\n')}

    ${profile.cta}
    ${topicUrl}
    ${profile.hashtags.slice(0, 4).join(' ')}
  `);
}

function buildXCopy(
  topic: MarketingTopic,
  profile: TopicProfile,
  topicUrl: string,
  tone: SocialTone,
) {
  const intro =
    tone === 'samimi'
      ? `${topic.title}:`
      : `${topic.title} için:`;

  const raw = normalizeText(
    `${intro} ${profile.hook} ${profile.bullets[0]} ${topicUrl} ${profile.hashtags
      .slice(0, 3)
      .join(' ')}`,
  );

  return truncateToWordBoundary(raw, 280);
}

function buildTelegramCopy(
  topic: MarketingTopic,
  profile: TopicProfile,
  topicUrl: string,
  leadUrl?: string,
) {
  return normalizeText(`
    ${topic.title}

    ${profile.hook}
    ${profile.bullets.map((item) => `- ${item}`).join('\n')}

    ${profile.cta}
    ${topicUrl}
    ${leadUrl || ''}
  `);
}

function buildWhatsAppStatusCopy(
  topic: MarketingTopic,
  profile: TopicProfile,
  tone: SocialTone,
) {
  const intro =
    tone === 'samimi'
      ? `${topic.title}\n${profile.reelHook}`
      : `${topic.title}\n${profile.hook}`;

  return normalizeText(`
    ${intro}
    ${profile.cta}
  `);
}

function buildTikTokCopy(
  topic: MarketingTopic,
  profile: TopicProfile,
  topicUrl: string,
  tone: SocialTone,
) {
  const intro =
    tone === 'samimi'
      ? `${topic.title} için kısa kontrol listesi`
      : `${topic.title} için net özet`;

  return normalizeText(`
    ${intro}

    ${profile.reelHook}
    ${profile.bullets.slice(0, 3).map((item) => `• ${item}`).join('\n')}

    ${profile.cta}
    ${topicUrl}
    ${profile.hashtags.slice(0, 6).join(' ')}
  `);
}

function buildYouTubeShortsCopy(
  topic: MarketingTopic,
  profile: TopicProfile,
  topicUrl: string,
  tone: SocialTone,
) {
  const intro =
    tone === 'kurumsal'
      ? `${topic.title} | Kısa rehber`
      : `${topic.title} | Hızlı özet`;

  return normalizeText(`
    ${intro}

    ${profile.reelHook}
    ${profile.bullets.map((item) => `- ${item}`).slice(0, 3).join('\n')}

    ${profile.cta}
    ${topicUrl}
    ${profile.hashtags.slice(0, 5).join(' ')}
  `);
}

export function buildSocialCampaign(
  topic: MarketingTopic,
  options: SocialCampaignOptions = {},
): SocialCampaign {
  const tone = options.tone || 'donusum';
  const channels =
    options.channels && options.channels.length > 0
      ? options.channels
      : SOCIAL_CHANNEL_OPTIONS.filter((option) => option.defaultSelected).map(
          (option) => option.id,
        );
  const profile = buildTopicBaseProfile(topic);
  const topicUrl = buildTopicUrl(topic);
  const leadUrl = buildLeadUrl(topic, channels[0], options.leadPath);
  const selectedHashtags = uniqueStrings([
    ...profile.hashtags,
    '#almanyagoc',
    '#almanyavizerehberi',
  ]);
  const leadLine = `${profile.cta} ${leadUrl}`;

  const platformCopies: SocialChannelCopy[] = channels.map((channel) => {
    const meta = SOCIAL_CHANNEL_OPTIONS.find((item) => item.id === channel);
    const label = meta?.label || channel;
    const characterLimit = meta?.characterLimit || 2000;

    let copy = '';
    switch (channel) {
      case 'instagram':
        copy = buildInstagramCopy(topic, profile, topicUrl, tone);
        break;
      case 'facebook':
        copy = buildFacebookCopy(topic, profile, topicUrl, tone);
        break;
      case 'linkedin':
        copy = buildLinkedInCopy(topic, profile, topicUrl, tone);
        break;
      case 'telegram':
        copy = buildTelegramCopy(topic, profile, topicUrl, leadUrl);
        break;
      case 'whatsapp_status':
        copy = buildWhatsAppStatusCopy(topic, profile, tone);
        break;
      case 'tiktok':
        copy = buildTikTokCopy(topic, profile, topicUrl, tone);
        break;
      case 'youtube_shorts':
        copy = buildYouTubeShortsCopy(topic, profile, topicUrl, tone);
        break;
      case 'x':
      default:
        copy = buildXCopy(topic, profile, topicUrl, tone);
        break;
    }

    if (copy.length > characterLimit) {
      copy = truncateToWordBoundary(copy, characterLimit);
    }

    return {
      id: channel,
      label,
      characterLimit,
      copy,
    };
  });

  const carouselSlides = profile.carouselSlides.map((slide, index) =>
    `${index + 1}. ${slide}`,
  );

  const reelScript = [
    profile.reelHook,
    `1. ${profile.bullets[0]}`,
    `2. ${profile.bullets[1] || profile.bullets[0]}`,
    `3. ${profile.bullets[2] || profile.cta}`,
    `CTA: ${leadLine}`,
  ];

  const notes = [
    `Odak anahtar kelime: ${profile.focusKeyword}`,
    `Hedef kitle: ${profile.audience}`,
    `Landing URL: ${topicUrl}`,
    `Lead URL: ${leadUrl}`,
    `Hashtag seti: ${selectedHashtags.slice(0, 6).join(' ')}`,
  ];

  return {
    topic,
    topicUrl,
    leadUrl,
    focusKeyword: profile.focusKeyword,
    audience: profile.audience,
    hashtags: selectedHashtags,
    carouselSlides,
    reelScript,
    platformCopies,
    notes,
  };
}

export function buildRotationPlan(
  topics: MarketingTopic[],
  options: RotationPlanOptions = {},
) {
  if (topics.length === 0) {
    return [];
  }

  const tone = options.tone || 'donusum';
  const selectedTopics = topics.slice(0, options.topicCount || 4);
  const channels =
    options.channels && options.channels.length > 0
      ? options.channels
      : (SOCIAL_CHANNEL_OPTIONS.filter((option) => option.defaultSelected).map(
          (option) => option.id,
        ) as SocialChannel[]);
  const count = options.count || 6;
  const postsPerWeek = 2;

  const items: RotationPlanItem[] = [];
  for (let index = 0; index < count; index += 1) {
    const topic = selectedTopics[index % selectedTopics.length];
    const channel = channels[index % channels.length];
    const profile = buildTopicBaseProfile(topic);
    const copy = buildSocialCampaign(topic, {
      tone,
      channels: [channel],
    }).platformCopies[0]?.copy || '';

    items.push({
      week: Math.floor(index / postsPerWeek) + 1,
      day: DEFAULT_ROTATION_DAYS[index % DEFAULT_ROTATION_DAYS.length],
      time: DEFAULT_ROTATION_TIMES[index % DEFAULT_ROTATION_TIMES.length],
      channel,
      topic,
      angle:
        profile.weeklyAngles[index % profile.weeklyAngles.length] ||
        profile.hook,
      copy,
    });
  }

  return items;
}

export function formatCampaignMarkdown(campaign: SocialCampaign) {
  const blocks = [
    `# ${campaign.topic.title}`,
    `Topic URL: ${campaign.topicUrl}`,
    `Lead URL: ${campaign.leadUrl}`,
    `Focus keyword: ${campaign.focusKeyword}`,
    `Audience: ${campaign.audience}`,
    '',
    '## Carousel',
    ...campaign.carouselSlides.map((slide) => `- ${slide}`),
    '',
    '## Reel',
    ...campaign.reelScript.map((line) => `- ${line}`),
    '',
    '## Channels',
    ...campaign.platformCopies.flatMap((item) => [
      `### ${item.label}`,
      item.copy,
      '',
    ]),
    '## Notes',
    ...campaign.notes.map((note) => `- ${note}`),
  ];

  return blocks.join('\n');
}

function buildAutomationQueueItem(
  topic: MarketingTopic,
  tone: SocialTone,
  channel: SocialChannel,
  slot: number,
  leadPath: string,
) {
  const profile = buildTopicBaseProfile(topic);
  const campaign = buildSocialCampaign(topic, {
    tone,
    channels: [channel],
    leadPath,
  });
  const item = campaign.platformCopies[0];

  return {
    slot,
    week: Math.floor((slot - 1) / 7) + 1,
    day: DEFAULT_ROTATION_DAYS[(slot - 1) % DEFAULT_ROTATION_DAYS.length],
    time: DEFAULT_ROTATION_TIMES[(slot - 1) % DEFAULT_ROTATION_TIMES.length],
    channel,
    topic: {
      id: topic.id,
      kind: topic.kind,
      slug: topic.slug,
      title: topic.title,
    },
    angle:
      profile.weeklyAngles[(slot - 1) % profile.weeklyAngles.length] ||
      profile.hook,
    topicUrl: campaign.topicUrl,
    leadUrl: campaign.leadUrl,
    copy: item?.copy || '',
  } satisfies AutomationQueueItem;
}

function buildSeoIdeaItem(topic: MarketingTopic, order: number): SeoIdeaItem {
  const profile = buildTopicBaseProfile(topic);
  const outline = uniqueStrings([
    `Kimler için uygun?`,
    `Gerekli belgeler`,
    `Süreçte en sık hata`,
    `Ön değerlendirme çağrısı`,
    profile.weeklyAngles[0] || profile.hook,
  ]).slice(0, 4);

  return {
    order,
    topic: {
      id: topic.id,
      kind: topic.kind,
      slug: topic.slug,
      title: topic.title,
    },
    focusKeyword: profile.focusKeyword,
    title: `${topic.title} için pratik rehber`,
    angle: profile.weeklyAngles[0] || profile.hook,
    outline,
  };
}

export function buildSocialAutomationSnapshot(
  topics: MarketingTopic[],
  options: SocialAutomationSnapshotOptions = {},
): SocialAutomationSnapshot {
  const tone = options.tone || 'donusum';
  const channels =
    options.channels && options.channels.length > 0
      ? options.channels
      : SOCIAL_CHANNEL_OPTIONS.filter((option) => option.defaultSelected).map(
          (option) => option.id,
        );
  const leadPath = options.leadPath || '/uygunluk-testi';
  const campaignCount = options.campaignCount || topics.length;
  const rotationCount = options.rotationCount || 14;
  const distributionCount = options.distributionCount || 14;
  const seoCount = options.seoCount || Math.min(5, topics.length);
  if (topics.length === 0) {
    return {
      generatedAt: new Date().toISOString(),
      tone,
      leadPath,
      channels,
      campaigns: [],
      rotationPlan: [],
      distributionQueue: [],
      seoQueue: [],
      notes: [
        'Uygun konu bulunamadı.',
        `Lead yolu: ${leadPath}`,
        `Kanal seti: ${channels.join(', ')}`,
      ],
    };
  }
  const campaignTopics = topics.slice(0, campaignCount);
  const distributionTopics = topics.length > 0 ? topics : campaignTopics;

  const campaigns = campaignTopics.map((topic) =>
    buildSocialCampaign(topic, {
      tone,
      channels,
      leadPath,
    }),
  );

  const rotationPlan = buildRotationPlan(topics, {
    tone,
    channels,
    count: rotationCount,
    topicCount: Math.min(4, topics.length),
  });

  const distributionQueue: AutomationQueueItem[] = Array.from(
    { length: distributionCount },
    (_, index) => {
      const topic = distributionTopics[index % distributionTopics.length];
      const channel = channels[index % channels.length];
      return buildAutomationQueueItem(
        topic,
        tone,
        channel,
        index + 1,
        leadPath,
      );
    },
  );

  const seoQueue: SeoIdeaItem[] = campaignTopics
    .slice(0, seoCount)
    .map((topic, index) => buildSeoIdeaItem(topic, index + 1));

  const notes = uniqueStrings([
    'Kapsam yalnızca Almanya çalışma vizesi, Mavi Kart, Fırsat Kartı ve seçili göç sonrası servislerle sınırlıdır.',
    `Lead yolu: ${leadPath}`,
    `Kanal seti: ${channels.join(', ')}`,
    `Kampanya sayısı: ${campaigns.length}`,
    `Rotasyon sayısı: ${rotationPlan.length}`,
    'Bu paket otomatik üretim için hazırlanır, yayınlamadan önce manuel kontrol önerilir.',
  ]);

  return {
    generatedAt: new Date().toISOString(),
    tone,
    leadPath,
    channels,
    campaigns,
    rotationPlan,
    distributionQueue,
    seoQueue,
    notes,
  };
}
