import type { Metadata } from 'next';
import Script from 'next/script';

import { getAllFaq, buildFaqSchemaOrg } from '@/lib/content/faq';

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
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900">
          Sıkça Sorulan Sorular
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Almanya&apos;ya göç ve vize süreciyle ilgili en çok merak edilen
          soruların yanıtlarını aşağıda bulabilirsiniz.
        </p>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-card"
            >
              <h2 className="text-sm font-semibold text-slate-900">
                {item.question}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

