import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.almanyavizerehberi.com';

const visaSlugs = [
  'calisma-vizesi',
  'mavi-kart-vizesi',
  'firsat-karti',
  'mesleki-egitim-vizesi',
  'aile-birlesimi-vizesi',
  'yuksekogrenim-vizesi',
  'dil-kursu-vizesi',
];

const servisSlugs = [
  'oturum-izni-basvurusu-ve-yenilenmesi',
  'yabancilar-dairesi-islemleri',
  'calisma-izni',
  'sigorta-ve-sosyal-guvenlik',
  'vergi-islemleri',
  'dil-egitimi-ve-entegrasyon-kurslari',
  'barinma-ve-emlak-islemleri',
  'egitim-ve-cocuklarin-egitimi',
  'hukuki-danismanlik-ve-haklar',
  'kulturel-ve-sosyal-rehberlik',
];

const blogSlugs = [
  'blog-1',
  'blog-2',
  'blog-3',
  'blog-4',
  'blog-5',
  'blog-6',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/basvuru`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/uygunluk-testi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/sss`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const visaPages: MetadataRoute.Sitemap = visaSlugs.map((slug) => ({
    url: `${SITE_URL}/hizmetler/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const servisPages: MetadataRoute.Sitemap = servisSlugs.map((slug) => ({
    url: `${SITE_URL}/servisler/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...visaPages, ...servisPages, ...blogPages];
}
