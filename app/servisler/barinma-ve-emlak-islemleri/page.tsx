import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('barinma-ve-emlak-islemleri');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/barinma-ve-emlak-islemleri',
});

export default function BarinmaVeEmlakIslemleriPage() {
  return <ServiceDetailLayout service={service} />;
}

