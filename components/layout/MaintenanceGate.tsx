'use client';

import { usePathname } from 'next/navigation';

import type { SiteSettings } from '@/lib/settings/site';

type MaintenanceGateProps = {
  site: SiteSettings;
  children: React.ReactNode;
};

export function MaintenanceGate({ site, children }: MaintenanceGateProps) {
  const pathname = usePathname();

  // Admin paneli bakim modundan etkilenmesin
  const isAdmin = pathname?.startsWith('/admin');

  if (site.maintenanceMode && !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-surface-main px-4 py-16">
        <div className="max-w-xl rounded-3xl border border-amber-200 bg-amber-50/80 p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Bakım Modu
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-brand-dark">
            Kısa Bir Bakım Arası Veriyoruz
          </h1>
          <p className="mt-3 text-sm text-slate-700">
            {site.maintenanceMessage}
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Acil durumlar ve devam eden başvurularınız için{' '}
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-semibold text-brand-base underline-offset-2 hover:underline"
            >
              {site.contactEmail}
            </a>{' '}
            adresinden veya WhatsApp hattımızdan bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

