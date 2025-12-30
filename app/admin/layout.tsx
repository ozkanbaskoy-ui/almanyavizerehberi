import type { ReactNode } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-admin-inter',
  display: 'swap',
});

type AdminLayoutProps = {
  children: ReactNode;
};

const NAV_ITEMS: {
  section: string;
  items: { label: string; href: string }[];
}[] = [
  {
    section: 'Genel',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Yönetim Paneli', href: '/admin' },
    ],
  },
  {
    section: 'İçerik',
    items: [
      { label: 'Site Genel Ayarları', href: '/admin/site' },
      { label: 'Ana Sayfa Metinleri', href: '/admin/home' },
      { label: 'Renk Temaları', href: '/admin/theme' },
      { label: 'Tipografi', href: '/admin/typography' },
      { label: 'Vize Sayfaları', href: '/admin/cms/visas' },
      { label: 'Göç Sonrası Hizmetler', href: '/admin/cms/services' },
      { label: 'Blog Yazıları', href: '/admin/cms/blog' },
      { label: 'SSS (FAQ)', href: '/admin/cms/faq' },
      { label: 'Statik Sayfalar', href: '/admin/cms/pages' },
    ],
  },
  {
    section: 'İş Yönetimi',
    items: [
      { label: 'Başvurular (CRM)', href: '/admin/applications' },
      { label: 'Finans & Randevu', href: '/admin/finance' },
      { label: 'Musteriler', href: '/admin/customers' },
      { label: 'Ayarlar & E-posta', href: '/admin/settings' },
    ],
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={`${inter.className} flex min-h-full bg-slate-950/95`}>
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 md:flex">
        <div className="px-4 pb-4 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Admin
          </p>
          <h1 className="mt-2 text-sm font-semibold tracking-tight text-slate-50">
            Almanya Vize Rehberi
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Yönetim panelinden siteyi kod yazmadan yönetin.
          </p>
        </div>
        <nav className="flex-1 space-y-3 px-2 pb-4 pt-2 text-sm">
          {NAV_ITEMS.map((group) => (
            <div key={group.section}>
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {group.section}
              </p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mb-0.5 block rounded-lg px-3 py-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-800 px-4 py-3 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-400">
            V0 • Yönetim Paneli
          </p>
          <p>Gelişmiş dashboard, CRM ve Stripe entegrasyonu sırada.</p>
        </div>
      </aside>

      <div className="flex-1 bg-surface-soft">{children}</div>
    </div>
  );
}

