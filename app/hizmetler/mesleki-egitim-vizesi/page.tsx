import type { Metadata } from 'next';

import { getVisaBySlug } from '@/lib/content/visas';
import { buildMetadata } from '@/lib/seo/metadata';
import { VisaDetailLayout } from '@/components/hizmetler/VisaDetailLayout';

const visa = getVisaBySlug('mesleki-egitim-vizesi');

export const metadata: Metadata = buildMetadata({
  title: visa.seoTitle || visa.title,
  description: visa.seoDescription || '',
  path: '/hizmetler/mesleki-egitim-vizesi',
});

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: visa.title,
  description: visa.seoDescription,
  provider: {
    '@type': 'Organization',
    name: 'Almanya Vize Rehberi',
    url: 'https://www.almanyavizerehberi.com',
  },
  areaServed: { '@type': 'Country', name: 'Germany' },
  url: 'https://www.almanyavizerehberi.com/hizmetler/mesleki-egitim-vizesi',
};

export default function MeslekiEgitimVizesiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <VisaDetailLayout visa={visa} />
    </>
  );
}
