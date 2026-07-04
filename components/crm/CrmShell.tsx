'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type CrmShellProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { label: 'Genel Bakış', href: '/crm' },
  { label: 'Lead Havuzu', href: '/crm/leads' },
  { label: 'Evrak Kuyruğu', href: '/crm/documents' },
  { label: 'Görevler', href: '/crm/tasks' },
  { label: 'Randevular', href: '/crm/calendar' },
  { label: 'Müşteri Profilleri', href: '/crm/customers' },
  { label: 'Raporlar', href: '/crm/reports' },
];

function isActive(pathname: string, href: string) {
  if (href === '/crm') {
    return pathname === '/crm';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CrmShell({ children }: CrmShellProps) {
  const pathname = usePathname() || '/crm';

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/95 md:flex md:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">
              CRM
            </p>
            <h1 className="mt-2 text-lg font-semibold text-white">
              Almanya Vize Rehberi
            </h1>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Lead, dosya, evrak ve operasyon takibi
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'block rounded-xl px-3 py-2.5 font-semibold transition',
                    active
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-950/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 px-5 py-4 text-xs text-slate-400">
            <Link
              href="/admin"
              className="font-semibold text-slate-200 hover:text-white"
            >
              Admin paneline dön
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/92 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
                  Operasyon Merkezi
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Başvurudan dosya kapanışına kadar tek CRM akışı.
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto md:hidden">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold',
                      isActive(pathname, item.href)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-slate-200',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/crm/leads"
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 hover:bg-slate-100"
                >
                  Lead Havuzu
                </Link>
                <Link
                  href="/admin/users"
                  className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 hover:bg-white/10"
                >
                  Kullanıcılar
                </Link>
              </div>
            </div>
          </header>

          <main className="crm-page min-h-[calc(100vh-74px)] bg-[linear-gradient(180deg,#0d1f45_0%,#e8f0ff_54%,#ffffff_100%)] px-4 py-6 text-slate-950 md:px-6 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
