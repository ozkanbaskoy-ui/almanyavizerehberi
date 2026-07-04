import type { Metadata } from 'next';

import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { VisaFitEngine } from '@/components/tools/VisaFitEngine';

export const metadata: Metadata = {
  title: 'Almanya Vize Uygunluk Testi',
  description:
    'Almanya çalışma vizesi, Mavi Kart, Fırsat Kartı, öğrenci vizesi ve aile birleşimi için ön uygunluk testi. Rotanızı, risklerinizi ve eksik belgelerinizi görün.',
  keywords: [
    'Almanya vize uygunluk testi',
    'Almanya çalışma vizesi',
    'Mavi Kart',
    'Fırsat Kartı',
    'Almanya göç testi',
  ],
  alternates: {
    canonical: 'https://www.almanyavizerehberi.com/uygunluk-testi',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UygunlukTestiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Almanya Vize Uygunluk Testi',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://www.almanyavizerehberi.com/uygunluk-testi',
    provider: {
      '@type': 'Organization',
      name: 'Almanya Vize Rehberi',
      url: 'https://www.almanyavizerehberi.com',
    },
    description:
      'Almanya vize rotaları için ön değerlendirme ve başvuru aracı.',
  };

  return (
    <main id="main" className="uygunluk-page bg-surface-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="site-hero">
        <div className="site-container">
          <RevealOnScroll className="mx-auto max-w-3xl text-center">
            <p className="eyebrow-on-dark font-heading md:text-sm">
              Vize Uygunluk Testi
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Almanya vize rotanızı ve başvuru adımlarınızı netleştirin
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-surface-main/80 md:text-base">
              Kısa ön değerlendirme formunu doldurun; profilinizi, hedefinizi
              ve hazırlık durumunuzu birlikte inceleyelim. Ekibimiz size en
              uygun yol haritası ve sonraki adımlar için dönüş yapsın.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-5 md:py-7">
        <div className="site-container">
          <RevealOnScroll>
            <div id="basvuru" className="scroll-mt-28">
              <VisaFitEngine />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
