import { getAllServices } from '@/lib/content/services';
import { getAllVisas } from '@/lib/content/visas';

import {
  buildInternalPath,
  buildTopicProfile,
  SITE_URL,
  type MarketingTopic,
} from '@/lib/marketing/socialAutomation';

export const ALLOWED_VISA_SLUGS = new Set([
  'calisma-vizesi',
  'mavi-kart-vizesi',
  'firsat-karti',
]);

export const ALLOWED_SERVICE_SLUGS = new Set([
  'calisma-izni',
  'oturum-izni-basvurusu-ve-yenilenmesi',
  'yabancilar-dairesi-islemleri',
  'sigorta-ve-sosyal-guvenlik',
  'vergi-islemleri',
  'barinma-ve-emlak-islemleri',
  'hukuki-danismanlik-ve-haklar',
  'kulturel-ve-sosyal-rehberlik',
]);

function buildFullUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString();
}

function toMarketingTopic(
  kind: 'visa' | 'service',
  slug: string,
  title: string,
  seoTitle: string,
  seoDescription: string,
  keywords = '',
  source = '',
): MarketingTopic {
  const sitePath = buildInternalPath({ kind, slug });
  const profile = buildTopicProfile({
    kind,
    slug,
    title,
    seoDescription,
  });

  return {
    id: `${kind}:${slug}`,
    kind,
    slug,
    title,
    seoTitle,
    seoDescription,
    keywords,
    source,
    sitePath,
    fullUrl: buildFullUrl(sitePath),
    focusKeyword: profile.focusKeyword,
    audience: profile.audience,
    priority: profile.priority,
  };
}

export function getMarketingTopicCatalog(): MarketingTopic[] {
  const visaTopics = getAllVisas()
    .filter((item) => ALLOWED_VISA_SLUGS.has(item.slug))
    .map((item) =>
      toMarketingTopic(
        'visa',
        item.slug,
        item.title,
        item.seoTitle,
        item.seoDescription,
        item.keywords || '',
        item.source || '',
      ),
    );

  const serviceTopics = getAllServices()
    .filter((item) => ALLOWED_SERVICE_SLUGS.has(item.slug))
    .map((item) =>
      toMarketingTopic(
        'service',
        item.slug,
        item.title,
        item.seoTitle,
        item.seoDescription,
        item.keywords || '',
        item.source || '',
      ),
    );

  return [...visaTopics, ...serviceTopics].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.title.localeCompare(b.title, 'tr');
  });
}

export function getMarketingTopicById(id: string) {
  return getMarketingTopicCatalog().find((topic) => topic.id === id);
}
