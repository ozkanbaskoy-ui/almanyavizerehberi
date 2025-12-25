import type { Metadata } from 'next';

import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

const service = getServiceBySlug('kulturel-ve-sosyal-rehberlik');

export const metadata: Metadata = buildMetadata({
  title: service.seoTitle || service.title,
  description: service.seoDescription || '',
  path: '/servisler/kulturel-ve-sosyal-rehberlik',
});

export default function KulturelVeSosyalRehberlikPage() {
  return <ServiceDetailLayout service={service} />;
}

