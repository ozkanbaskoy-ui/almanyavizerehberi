import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('yabancilar-dairesi-islemleri');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/yabancilar-dairesi-islemleri',
});

export default function YabancilarDairesiIslemleriPage() {
  return <ServiceDetailLayout service={service} />;
}

