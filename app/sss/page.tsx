import type { Metadata } from 'next';
import Script from 'next/script';

import { getAllFaq, buildFaqSchemaOrg } from '@/lib/content/faq';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description:
    'Almanya vize başvuru süreci hakkında en sık sorulan sorular ve yanıtlar.',
};

export default function SSSPage() {
  const items = getAllFaq();
  const schema = buildFaqSchemaOrg(items);

  return (
    <>
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <RevealOnScroll>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900">
            Sıkça Sorulan Sorular
          </h1>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <details
                key={item.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <summary className="cursor-pointer text-sm font-medium text-slate-900">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-slate-700">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}

