import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/musteri-panel',
          '/musteri-panel/',
          '/musteri-giris',
          '/odeme/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://www.almanyavizerehberi.com/sitemap.xml',
  };
}
