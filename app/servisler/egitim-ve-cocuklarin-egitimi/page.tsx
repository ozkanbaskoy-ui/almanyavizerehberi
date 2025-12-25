import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('egitim-ve-cocuklarin-egitimi');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/egitim-ve-cocuklarin-egitimi',
});

export default function EgitimVeCocuklarinEgitimiPage() {
  return <ServiceDetailLayout service={service} />;
}

