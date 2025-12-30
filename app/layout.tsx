import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Plus_Jakarta_Sans, Roboto } from 'next/font/google';
import '../styles/globals.css';

import { MainNav } from '@/components/layout/MainNav';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton';
import { LegalConsentBar } from '@/components/layout/LegalConsentBar';
import { MaintenanceGate } from '@/components/layout/MaintenanceGate';
import { getThemeSettings } from '@/lib/settings/theme';
import { getTypographySettings } from '@/lib/settings/typography';
import { getSiteSettings } from '@/lib/settings/site';

// Tüm ana yazı tiplerini aynı CSS değişkenine bağluyoruz.
// Böylece Tailwind'deki font-sans / font-heading sınıfları değişmeden kalıyor,
// sadece seçilen font bu değişkene atanıyor.
const fontPlusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const fontInter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const fontRoboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-plus-jakarta',
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

  const fontClass =
    typography.font === 'inter'
      ? fontInter.variable
      : typography.font === 'roboto'
        ? fontRoboto.variable
        : fontPlusJakarta.variable;

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
