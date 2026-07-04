import type { ReactNode } from 'react';
import Link from 'next/link';

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
      { label: 'CRM Çalışma Alanı', href: '/crm' },
      { label: 'Lead Başvuruları', href: '/crm/leads' },
      { label: 'CRM Kullanıcıları', href: '/admin/users' },
      { label: 'Roller & İzinler', href: '/admin/roles' },
      { label: 'Finans & Randevu', href: '/admin/finance' },
      { label: 'Müşteriler', href: '/admin/customers' },
      { label: 'Audit Log', href: '/admin/audit-logs' },
      { label: 'E-posta Logları', href: '/admin/email-logs' },
      { label: 'Ayarlar & E-posta', href: '/admin/settings' },
      { label: 'Sistem Sağlığı', href: '/admin/system' },
    ],
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 md:flex">
        <div className="px-4 pb-4 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Admin
          </p>
          <h1 className="mt-2 text-sm font-semibold tracking-tight text-slate-50">
            Almanya Vize Rehberi
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            CRM, içerik ve site ayarları
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
            Yönetim Paneli
          </p>
          <p>Lead, müşteri ve içerik yönetimi.</p>
        </div>
      </aside>

      <div className="admin-content min-w-0 flex-1 bg-surface-soft">
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <p className="text-sm font-semibold text-slate-950">
            Almanya Vize Rehberi Admin
          </p>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 text-xs font-semibold text-slate-700">
            {NAV_ITEMS.flatMap((group) => group.items).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:border-brand-base hover:text-brand-base"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}

