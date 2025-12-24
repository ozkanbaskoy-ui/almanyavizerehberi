import type { Metadata } from 'next';
import { getPageBySlug } from '@/lib/content/pages';

const page = getPageBySlug('kvkk');

export const metadata: Metadata = {
  title: page.seoTitle || page.title,
  description: page.seoDescription || '',
};

export default function KvkkPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold text-slate-900">
        {page.title}
      </h1>
      <article
        className="prose prose-slate mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      />
    </section>
  );
}

