'use client';

import { usePathname } from 'next/navigation';

import { Footer } from '@/components/layout/Footer';
import { LegalConsentBar } from '@/components/layout/LegalConsentBar';
import { MainNav } from '@/components/layout/MainNav';
import { MaintenanceGate } from '@/components/layout/MaintenanceGate';
import { WhatsAppCommunityPopup } from '@/components/layout/WhatsAppCommunityPopup';
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton';
import type { SiteSettings } from '@/lib/settings/site';

type AppChromeProps = {
  site: SiteSettings;
  children: React.ReactNode;
};

export function AppChrome({ site, children }: AppChromeProps) {
  const pathname = usePathname() || '/';
  const isWorkspace =
    pathname.startsWith('/admin') || pathname.startsWith('/crm');

  if (isWorkspace) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav site={site} />
      <main className="flex-1">
        <MaintenanceGate site={site}>{children}</MaintenanceGate>
      </main>
      <Footer site={site} />
      <LegalConsentBar />
      <WhatsAppCommunityPopup site={site} />
      <WhatsAppFloatingButton whatsappNumber={site.whatsappNumber} />
    </div>
  );
}
