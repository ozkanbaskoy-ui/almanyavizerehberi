import type { Metadata } from 'next';

import { getVisaBySlug } from '@/lib/content/visas';
import { buildMetadata } from '@/lib/seo/metadata';
import { VisaDetailLayout } from '@/components/hizmetler/VisaDetailLayout';

const visa = getVisaBySlug('firsat-karti');

export const metadata: Metadata = buildMetadata({
  title: visa.seoTitle || visa.title,
  description: visa.seoDescription || '',
  path: '/hizmetler/firsat-karti',
});

export default function FirsatKartiPage() {
  return <VisaDetailLayout visa={visa} />;
}

