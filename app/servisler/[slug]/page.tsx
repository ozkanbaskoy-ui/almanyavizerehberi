import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  if (!params?.slug) {
    return {
      title: 'Göç Sonrası Hizmet Detayı | Almanya Vize Rehberi',
      description:
        'Almanya göç sonrası hizmet detayları.',
    };
  }
  const service = getServiceBySlug(params.slug);
  return buildMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || '',
    path: `/servisler/${service.slug}`,
  });
}

export default function ServicePage({ params }: { params: Params }) {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold text-slate-900">
        {service.title}
      </h1>
      <article
        className="prose prose-slate mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: service.bodyHtml }}
      />
    </section>
  );
}
