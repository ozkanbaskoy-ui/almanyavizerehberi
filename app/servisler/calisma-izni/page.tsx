import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('calisma-izni');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/calisma-izni',
});

export default function CalismaIzniPage() {
  return <ServiceDetailLayout service={service} />;
}

