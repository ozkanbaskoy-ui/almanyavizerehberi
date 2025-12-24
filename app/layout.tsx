import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';

import { MainNav } from '@/components/layout/MainNav';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton';
import { getThemeSettings } from '@/lib/settings/theme';
import { getTypographySettings } from '@/lib/settings/typography';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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

  const cssVars = {
    '--color-hero-from': customColors.heroFrom,
    '--color-hero-to': customColors.heroTo,
    '--color-video-bg': customColors.videoBg,
    '--color-video-border': customColors.videoBorder,
  } as CSSProperties;

  return (
    <html lang="tr">
      <body
        className={[
          plusJakarta.variable,
          'min-h-screen bg-surface-main text-brand-dark antialiased',
          `theme-${activeTheme}`,
          `typography-${typography.scale}`,
        ].join(' ')}
        style={cssVars}
      >
        <div className="flex min-h-screen flex-col">
          <MainNav />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatingButton />
        </div>
      </body>
    </html>
  );
}
