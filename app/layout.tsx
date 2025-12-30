import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import '../styles/globals.css';

import { MainNav } from '@/components/layout/MainNav';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton';
import { LegalConsentBar } from '@/components/layout/LegalConsentBar';
import { MaintenanceGate } from '@/components/layout/MaintenanceGate';
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
    "Almanya'ya yerleşim, çalışma ve eğitim vizeleri için profesyonel danışmanlık. Çalışma vizesi, Mavi Kart, Fırsat Kartı ve daha fazlası için kapsamlı rehberlik.",
  openGraph: {
    type: 'website',
    siteName: 'Almanya Vize Rehberi',
    url: 'https://www.almanyavizerehberi.com/',
    images: [
      {
        url: '/og/default-og.webp',
        width: 1200,
        height: 630,
        alt: 'Almanya Vize Rehberi',
      },
    ],
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

  return (
    <html lang="tr">
      <body
        className={[
          fontClass,
          'min-h-screen bg-surface-main text-brand-dark antialiased scrollbar-modern',
          `theme-${activeTheme}`,
          `typography-${typography.scale}`,
        ].join(' ')}
        style={cssVars}
      >
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
        <div className="flex min-h-screen flex-col">
          <MainNav site={site} />
          <main className="flex-1">
            <MaintenanceGate site={site}>{children}</MaintenanceGate>
          </main>
          <Footer site={site} />
          <LegalConsentBar />
          <WhatsAppFloatingButton whatsappNumber={site.whatsappNumber} />
        </div>
      </body>
    </html>
  );
}

