import type { Metadata } from 'next';

type SeoParams = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
};

const SITE_URL = 'https://www.almanyavizerehberi.com';
const SITE_NAME = 'Almanya Vize Rehberi';

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  ogType = 'website',
}: SeoParams): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const defaultOgImage = `${SITE_URL}/og/default-og.webp`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [
        {
          url: ogImage ?? defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage ?? defaultOgImage],
    },
  };
}

