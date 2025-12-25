import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('sigorta-ve-sosyal-guvenlik');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/sigorta-ve-sosyal-guvenlik',
});

export default function SigortaVeSosyalGuvenlikPage() {
  return <ServiceDetailLayout service={service} />;
}

