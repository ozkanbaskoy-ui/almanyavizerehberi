import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ServiceDetailLayout } from '@/components/servisler/ServiceDetailLayout';

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    return {
      title: 'Göç Sonrası Hizmet Detayı | Almanya Vize Rehberi',
      description:
        'Almanya göç sonrası hizmet detayları.',
    };
  }
  const service = getServiceBySlug(resolvedParams.slug);
  return buildMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || '',
    path: `/servisler/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return notFound();
  }

  return <ServiceDetailLayout service={service} />;
}
