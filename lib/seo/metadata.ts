import type { Metadata } from 'next';

type SeoParams = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

const SITE_URL = 'https://www.almanyavizerehberi.com';
const SITE_NAME = 'Almanya Vize Rehberi';

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
}: SeoParams): Metadata {
  const url = new URL(path, SITE_URL).toString();

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

