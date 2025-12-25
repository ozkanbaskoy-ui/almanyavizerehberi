import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('vergi-islemleri');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/vergi-islemleri',
});

export default function VergiIslemleriPage() {
  return <ServiceDetailLayout service={service} />;
}

