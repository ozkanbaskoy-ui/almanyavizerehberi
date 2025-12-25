import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('dil-egitimi-ve-entegrasyon-kurslari');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/dil-egitimi-ve-entegrasyon-kurslari',
});

export default function DilEgitimiVeEntegrasyonKurslariPage() {
  return <ServiceDetailLayout service={service} />;
}

