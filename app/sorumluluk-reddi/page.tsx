import type { Metadata } from 'next';

import { getPageBySlug } from '@/lib/content/pages';

export function generateMetadata(): Metadata {
  const page = getPageBySlug('sorumluluk-reddi');

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || '',
  };
}

export default function SorumlulukReddiPage() {
  const page = getPageBySlug('sorumluluk-reddi');

  return (
    <main className="bg-surface-soft">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Sorumluluk Reddi
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-slate-900 md:text-4xl">
            {page.title}
          </h1>
        </header>

        <div className="rounded-3xl border border-border-subtle bg-white p-6 shadow-soft md:p-8">
          <article
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
        </div>
      </section>
    </main>
  );
}
