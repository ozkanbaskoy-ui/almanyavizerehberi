import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('oturum-izni-basvurusu-ve-yenilenmesi');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/oturum-izni-basvurusu-ve-yenilenmesi',
});

export default function OturumIzniBasvurusuVeYenilenmesiPage() {
  return <ServiceDetailLayout service={service} />;
}

