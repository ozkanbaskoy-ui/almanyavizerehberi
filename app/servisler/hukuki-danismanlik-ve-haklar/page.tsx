import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('hukuki-danismanlik-ve-haklar');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/hukuki-danismanlik-ve-haklar',
});

export default function HukukiDanismanlikVeHaklarPage() {
  return <ServiceDetailLayout service={service} />;
}

