import type { Metadata } from 'next';
import Script from 'next/script';

import { getAllFaq, buildFaqSchemaOrg } from '@/lib/content/faq';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description:
    'Almanya vize başvuru süreci hakkında en sık sorulan sorular ve yanıtlar.',
  alternates: {
    canonical: 'https://www.almanyavizerehberi.com/sss',
  },
  openGraph: {
    type: 'website',
    title: 'Sıkça Sorulan Sorular - Almanya Vize Rehberi',
    description: 'Almanya vize başvuru süreci hakkında en sık sorulan sorular ve yanıtlar.',
    url: 'https://www.almanyavizerehberi.com/sss',
    images: [{ url: '/og/default-og.webp', width: 1200, height: 630, alt: 'SSS' }],
  },
};

export default function SSSPage() {
  const items = getAllFaq();
  const schema = buildFaqSchemaOrg(items);

  return (
    <>
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>

      <main className="bg-surface-soft">
        <section className="site-hero">
          <div className="mx-auto max-w-4xl px-4">
            <p className="eyebrow-on-dark">SSS</p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-surface-main md:text-4xl">
              Sıkça Sorulan Sorular
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-surface-main/80 md:text-base">
              Almanya&apos;ya göç ve vize süreciyle ilgili en çok merak edilen
              soruların kısa yanıtlarını burada bulabilirsiniz.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:py-14">
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="interactive-panel p-5"
              >
                <h2 className="text-base font-semibold text-slate-950">
                  {item.question}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
