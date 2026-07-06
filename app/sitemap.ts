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

function latestMtime(items: Array<string | Date>) {
  const mtimes = items.map((item) =>
    item instanceof Date ? item : fileMtime(item),
  );
  return mtimes.reduce((latest, current) =>
    current > latest ? current : latest,
  );
}

function contentMtime(dir: string, slug: string) {
  return fileMtime(path.join(process.cwd(), 'content', dir, `${slug}.json`));
}

function contentDirMtime(dir: string) {
  const fullDir = path.join(process.cwd(), 'content', dir);
  try {
    const files = fs
      .readdirSync(fullDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => path.join(fullDir, file));

    if (files.length === 0) return new Date();
    return latestMtime(files);
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'page.tsx'),
        path.join(process.cwd(), 'content', 'settings', 'home.json'),
        path.join(process.cwd(), 'content', 'settings', 'site.json'),
      ]),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/almanya-vizesi`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'almanya-vizesi', 'page.tsx'),
        contentDirMtime('visas'),
        contentDirMtime('blog'),
        contentDirMtime('faq'),
      ]),
      changeFrequency: 'weekly',
      priority: 0.97,
    },
    {
      url: `${SITE_URL}/almanya-is`,
      lastModified: fileMtime(
        path.join(process.cwd(), 'app', 'almanya-is', 'page.tsx'),
      ),
      changeFrequency: 'weekly',
      priority: 0.94,
    },
    {
      url: `${SITE_URL}/almanya-goc`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'almanya-goc', 'page.tsx'),
        contentDirMtime('blog'),
        contentDirMtime('visas'),
        contentDirMtime('services'),
      ]),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/hizmetler`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'hizmetler', 'page.tsx'),
        contentDirMtime('visas'),
      ]),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/servisler`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'servisler', 'page.tsx'),
        contentDirMtime('services'),
      ]),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/hakkimizda`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'hakkimizda', 'page.tsx'),
        path.join(process.cwd(), 'content', 'pages', 'hakkimizda.json'),
      ]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/iletisim`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'iletisim', 'page.tsx'),
        path.join(process.cwd(), 'content', 'pages', 'iletisim.json'),
      ]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/basvuru`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'basvuru', 'page.tsx'),
        path.join(process.cwd(), 'content', 'settings', 'site.json'),
      ]),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/uygunluk-testi`,
      lastModified: fileMtime(
        path.join(process.cwd(), 'app', 'uygunluk-testi', 'page.tsx'),
      ),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/sss`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'sss', 'page.tsx'),
        path.join(process.cwd(), 'content', 'faq', 'faq.json'),
      ]),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestMtime([
        path.join(process.cwd(), 'app', 'blog', 'page.tsx'),
        contentDirMtime('blog'),
      ]),
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
