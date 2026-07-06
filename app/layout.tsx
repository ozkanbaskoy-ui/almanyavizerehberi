import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import '../styles/globals.css';

import { AppChrome } from '@/components/layout/AppChrome';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo/metadata';
import { getThemeSettings } from '@/lib/settings/theme';
import { getTypographySettings } from '@/lib/settings/typography';
import { getSiteSettings } from '@/lib/settings/site';

// Ana fontlar:
// - Raleway: basliklar icin
// - Inter: govde metinleri ve KVKK / sozlesmeler icin
// - Poppins: menu ve CTA (buton) alanlari icin
const fontRaleway = localFont({
  src: [
    {
      path: '../Fonts/Raleway/Raleway-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../Fonts/Raleway/Raleway-Italic-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-raleway',
  display: 'swap',
});

const fontInter = localFont({
  src: [
    {
      path: '../Fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../Fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

const fontPoppins = localFont({
  src: [
    {
      path: '../Fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../Fonts/Poppins/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../Fonts/Poppins/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../Fonts/Poppins/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.almanyavizerehberi.com'),
  title: {
    default: 'Almanya Vize Rehberi - Profesyonel Danışmanlık',
    template: '%s | Almanya Vize Rehberi',
  },
  description:
    'Almanya vizesi, Almanya çalışma vizesi, Mavi Kart, Fırsat Kartı ve göç sonrası işlemler için profesyonel rehberlik.',
  keywords: [
    'Almanya vize rehberi',
    'Almanya vizesi',
    'Almanya çalışma vizesi',
    'çalışma vizesi',
    'Mavi Kart',
    'Fırsat Kartı',
    'Almanya göç',
    'Almanya vize danışmanlığı',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Almanya Vize Rehberi',
    url: 'https://www.almanyavizerehberi.com/',
    description:
      'Almanya vizesi, Almanya çalışma vizesi, Mavi Kart, Fırsat Kartı ve göç sonrası işlemler için profesyonel rehberlik.',
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Almanya Vize Rehberi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@VizeRehberi',
    creator: '@VizeRehberi',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  alternates: {
    canonical: 'https://www.almanyavizerehberi.com/',
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const { activeTheme, customColors } = getThemeSettings();
  const typography = getTypographySettings();
  const site = getSiteSettings();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const cleanPhone = site.contactPhone.replace(/\s+/g, '');

  const cssVars = {
    '--color-hero-from': customColors.heroFrom,
    '--color-hero-to': customColors.heroTo,
    '--color-video-bg': customColors.videoBg,
    '--color-video-border': customColors.videoBorder,
  } as CSSProperties;

  // Tipografi ayarlarindaki "font" secimi artik sadece eski Plus Jakarta / Inter / Roboto
  // degisimini temsil ediyordu. Artik govde icin Inter, baslik icin Raleway,
  // CTA / menu icin Poppins sabit; bu nedenle burada tum font degiskenlerini
  // body'ye ekliyoruz. (Boyut olcegi ayari aynen calismaya devam eder.)
  const fontClass = [
    fontInter.variable,
    fontRaleway.variable,
    fontPoppins.variable,
  ].join(' ');

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.siteName,
    url: 'https://www.almanyavizerehberi.com',
    logo: 'https://www.almanyavizerehberi.com/assets/img/logo-yan.webp',
    sameAs: [
      'https://www.instagram.com/almanyavizerehberi',
      'https://x.com/VizeRehberi',
      'https://www.tiktok.com/@almanyavizerehberi',
      'https://www.youtube.com/@AlmanyaVizeRehberi',
      'https://www.facebook.com/people/Almanya-Vize-Rehberi/61576181364841/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: cleanPhone,
      email: site.contactEmail || undefined,
      availableLanguage: ['Turkish', 'German'],
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.siteName,
    url: 'https://www.almanyavizerehberi.com',
    inLanguage: 'tr-TR',
    publisher: {
      '@type': 'Organization',
      name: site.siteName,
      url: 'https://www.almanyavizerehberi.com',
    },
  };

  return (
    <html lang="tr" className="overflow-x-hidden">
      <body
        className={[
          fontClass,
          'min-h-screen overflow-x-hidden bg-surface-main text-brand-dark antialiased scrollbar-modern',
          `theme-${activeTheme}`,
          `typography-${typography.scale}`,
        ].join(' ')}
        style={cssVars}
      >
        <Script id="organization-jsonld" type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </Script>
        <Script id="website-jsonld" type="application/ld+json">
          {JSON.stringify(websiteJsonLd)}
        </Script>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
        <AppChrome site={site}>{children}</AppChrome>
      </body>
    </html>
  );
}
