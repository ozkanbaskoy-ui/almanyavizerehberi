import type { Metadata } from 'next';

import { getVisaBySlug } from '@/lib/content/visas';
import { buildMetadata } from '@/lib/seo/metadata';
import { VisaDetailLayout } from '@/components/hizmetler/VisaDetailLayout';

const visa = getVisaBySlug('calisma-vizesi');

export const metadata: Metadata = buildMetadata({
  title: visa.seoTitle || visa.title,
  description: visa.seoDescription || '',
  path: '/hizmetler/calisma-vizesi',
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
  url: 'https://www.almanyavizerehberi.com/hizmetler/calisma-vizesi',
};

export default function CalismaVizesiPage() {
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
