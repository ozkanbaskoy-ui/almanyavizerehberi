import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVisaBySlug } from '@/lib/content/visas';
import { buildMetadata } from '@/lib/seo/metadata';

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  if (!params?.slug) {
    return {
      title: 'Hizmet Detayı | Almanya Vize Rehberi',
      description:
        'Almanya Vize Rehberi hizmet detayları.',
    };
  }
  const visa = getVisaBySlug(params.slug);
  return buildMetadata({
    title: visa.seoTitle || visa.title,
    description: visa.seoDescription || '',
    path: `/hizmetler/${visa.slug}`,
  });
}

export default function VisaPage({ params }: { params: Params }) {
  const visa = getVisaBySlug(params.slug);
  if (!visa) {
    return notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold text-slate-900">
        {visa.title}
      </h1>
      <article
        className="prose prose-slate mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: visa.bodyHtml }}
      />
    </section>
  );
}
