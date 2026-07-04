import fs from 'node:fs';
import path from 'node:path';

import type { MetadataRoute } from 'next';

import { getAllBlogPosts } from '@/lib/content/blog';
import { getAllServices } from '@/lib/content/services';
import { getAllVisas } from '@/lib/content/visas';
import {
  ALLOWED_SERVICE_SLUGS,
  ALLOWED_VISA_SLUGS,
} from '@/lib/marketing/topicCatalog';

const SITE_URL = 'https://www.almanyavizerehberi.com';

function fileMtime(filePath: string) {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return new Date();
  }
}

function contentMtime(dir: string, slug: string) {
  return fileMtime(path.join(process.cwd(), 'content', dir, `${slug}.json`));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/almanya-goc`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/hizmetler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/servisler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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

  const visaPages: MetadataRoute.Sitemap = getAllVisas()
    .filter((item) => ALLOWED_VISA_SLUGS.has(item.slug))
    .map((item) => ({
    url: `${SITE_URL}/hizmetler/${item.slug}`,
    lastModified: contentMtime('visas', item.slug),
    changeFrequency: 'monthly',
    priority:
      item.slug === 'calisma-vizesi' ||
      item.slug === 'mavi-kart-vizesi' ||
      item.slug === 'firsat-karti'
        ? 0.95
        : 0.8,
  }));

  const servicePages: MetadataRoute.Sitemap = getAllServices()
    .filter((item) => ALLOWED_SERVICE_SLUGS.has(item.slug))
    .map((item) => ({
    url: `${SITE_URL}/servisler/${item.slug}`,
    lastModified: contentMtime('services', item.slug),
    changeFrequency: 'monthly',
    priority:
      item.slug === 'oturum-izni-basvurusu-ve-yenilenmesi' ||
      item.slug === 'yabancilar-dairesi-islemleri' ||
      item.slug === 'calisma-izni'
        ? 0.9
        : 0.75,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllBlogPosts().map((item) => ({
    url: `${SITE_URL}/blog/${item.slug}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...visaPages, ...servicePages, ...blogPages];
}
