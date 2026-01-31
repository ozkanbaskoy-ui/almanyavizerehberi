'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

import type { SiteSettings } from '@/lib/settings/site';

type NavItem = {
  label: string;
  href?: string;
  title?: string;
  children?: { label: string; href: string; title?: string }[];
};

const VISA_SERVICES: NavItem = {
  label: 'Hizmetlerimiz',
  href: '/hizmetler.php?l=1',
  title: 'Hizmetlerimiz',
  children: [
    { label: 'Çalışma Vizesi', href: '/hizmetler.php?l=1' },
    { label: 'Mavi Kart Vizesi', href: '/hizmetler.php?l=2' },
    { label: 'Fırsat Kartı', href: '/hizmetler.php?l=3' },
    { label: 'Mesleki Eğitim Vizesi', href: '/hizmetler.php?l=5' },
    { label: 'Aile Birleşimi Vizesi', href: '/hizmetler.php?l=7' },
    { label: 'Yükseköğrenim Vizesi', href: '/hizmetler.php?l=9' },
    { label: 'Dil Kursu Vizesi', href: '/hizmetler.php?l=10' },
  ],
};

const AFTERCARE_SERVICES: NavItem = {
  label: 'Göç Sonrası Hizmetlerimiz',
  href: '/servisler.php?l=1',
  title: 'Göç Sonrası Hizmetlerimiz',
  children: [
    {
      label: 'Oturum İzni Başvurusu ve Yenilenmesi',
      href: '/servisler.php?l=1',
    },
    { label: 'Yabancılar Dairesi İşlemleri', href: '/servisler.php?l=2' },
    { label: 'Çalışma İzni', href: '/servisler.php?l=3' },
    { label: 'Sigorta ve Sosyal Güvenlik', href: '/servisler.php?l=4' },
    { label: 'Vergi İşlemleri', href: '/servisler.php?l=5' },
    {
      label: 'Dil Eğitimi ve Entegrasyon Kursları',
      href: '/servisler.php?l=6',
    },
    { label: 'Barınma ve Emlak İşlemleri', href: '/servisler.php?l=7' },
    { label: 'Eğitim ve Çocukların Eğitimi', href: '/servisler.php?l=8' },
    { label: 'Hukuki Danışmanlık ve Haklar', href: '/servisler.php?l=9' },
    { label: 'Kültürel ve Sosyal Rehberlik', href: '/servisler.php?l=10' },
  ],
};

const MAIN_ITEMS: NavItem[] = [
  { label: 'Ana Sayfa', href: '/index.php', title: 'Ana Sayfa' },
  { label: 'Hakkımızda', href: '/hakkimizda.php', title: 'Hakkımızda' },
  VISA_SERVICES,
  AFTERCARE_SERVICES,
  { label: 'S.S.S.', href: '/sss.php', title: 'Sıkça Sorulan Sorular' },
  { label: 'Blog', href: '/blog.php', title: 'Blog' },
  { label: 'İletişim', href: '/iletisim.php', title: 'İletişim' },
];

type MainNavProps = {
  site: SiteSettings;
};

export function MainNav({ site }: MainNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const cleanedPhone = site.contactPhone.replace(/\s+/g, '');
  const telHref = cleanedPhone ? `tel:${cleanedPhone}` : undefined;

  const whatsappClean = site.whatsappNumber.replace(/\s+/g, '');
  const whatsappHref = whatsappClean
    ? `https://wa.me/${whatsappClean.replace('+', '')}`
    : undefined;

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white shadow-sm"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Top bar */}
      <div className="bg-[#545454] text-[13px] text-slate-100">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2">
          {/* Sol: e-posta ve telefon */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-[13px]">
            {site.contactEmail && (
              <a
                href={`mailto:${site.contactEmail}`}
                className="transition-colors hover:text-brand-coral"
              >
                {site.contactEmail}
              </a>
            )}
            {telHref && (
              <a
                href={telHref}
                className="transition-colors hover:text-brand-coral"
              >
                {site.contactPhone}
              </a>
            )}
          </div>

          {/* Orta: kayar bilgilendirme metni */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap font-ui text-[11px] font-medium tracking-wide text-slate-100/90">
              Hayallerini erteleme, doğru, güvenilir ve şeffaf rehberlik için hemen başvur
            </div>
          </div>

          {/* SaÄŸ: sosyal ikonlar */}
          <div className="hidden items-center gap-2 sm:flex">
            {site.instagramUrl && (
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-slate-100 shadow-sm ring-1 ring-slate-700/70 transition hover:bg-brand-coral hover:text-white hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 7.3A4.7 4.7 0 1 0 16.7 12 4.71 4.71 0 0 0 12 7.3Zm0 7.7A3 3 0 1 1 15 12a3 3 0 0 1-3 3Z"
                  />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                  <path
                    fill="currentColor"
                    d="M17.5 3H6.5A3.5 3.5 0 0 0 3 6.5v11A3.5 3.5 0 0 0 6.5 21h11a3.5 3.5 0 0 0 3.5-3.5v-11A3.5 3.5 0 0 0 17.5 3Zm2 14.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2Z"
                  />
                </svg>
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/70 transition hover:scale-110 hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M20.5 12a8.5 8.5 0 0 0-14.5-6A8.44 8.44 0 0 0 3.5 12a8.32 8.32 0 0 0 1.2 4.3L3 21l4.8-1.6A8.55 8.55 0 0 0 20.5 12Zm-4.4 4.4a4.82 4.82 0 0 1-2.3.6 7.24 7.24 0 0 1-3.8-1.1 8.1 8.1 0 0 1-2.5-2.4 4.66 4.66 0 0 1-.9-2.6 3 3 0 0 1 1-2.2.79.79 0 0 1 .6-.3h.4c.2 0 .3 0 .4.3s.5 1.2.5 1.3a.33.33 0 0 1 0 .3 1.09 1.09 0 0 1-.2.3l-.2.3a.59.59 0 0 0-.1.5 3.09 3.09 0 0 0 .6 1.1 5.38 5.38 0 0 0 1.7 1.4 3.71 3.71 0 0 0 1.1.4.58.58 0 0 0 .4-.1l.4-.4a1.2 1.2 0 0 1 .4-.3.42.42 0 0 1 .4.1l1.2.6a1 1 0 0 1 .5.4.89.89 0 0 1-.1.5 3.64 3.64 0 0 1-1.3 1.4Z"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-6xl items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3">
        <Link href="/index.php" className="flex items-center gap-3">
          <Image
            src="/assets/img/logo-yan.webp"
            alt={site.siteName || 'Almanya Vize Rehberi'}
            width={160}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-800 font-ui md:flex">
          {MAIN_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-[1px] hover:bg-brand-base/5 hover:text-brand-base hover:shadow-card"
                >
                  <span>{item.label}</span>
                  <span className="text-xs leading-none">↓</span>
                </button>
                <div className="invisible absolute left-0 top-full mt-2 w-64 rounded-lg border border-slate-100 bg-white text-xs shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <ul className="py-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              item.href && (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-3 py-1 font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-[1px] hover:bg-brand-base/5 hover:text-brand-base hover:shadow-card"
                >
                  {item.label}
                </Link>
              )
            )
          )}

          <Link
            href="/basvuru.php"
            className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-b from-brand-red to-red-700 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(15,23,42,0.45)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,23,42,0.6)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(15,23,42,0.4)] font-ui"
          >
            Başvuru Yap
          </Link>
        </nav>

        {/* Mobile CTA (sadece mobilde görünsün) */}
        <Link
          href="/basvuru.php"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-brand-red to-red-700 px-4 py-2 text-xs font-ui font-semibold uppercase tracking-wide text-white shadow-[0_6px_14px_rgba(15,23,42,0.45)] md:hidden"
        >
          Başvuru Yap
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-700 md:hidden"
          aria-label="Menüyü aç/kapat"
        >
          <span className="sr-only">Menüyü aç/kapat</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 text-sm font-ui md:hidden">
          <ul className="space-y-2">
            {MAIN_ITEMS.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.label}
                  </div>
                  <ul className="space-y-1 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-1 text-slate-800"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                item.href && (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block py-1 text-slate-800"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )
            )}
            <li className="pt-2">
              <Link
                href="/basvuru.php"
                className="block rounded-full bg-gradient-to-b from-brand-red to-red-700 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white shadow-[0_6px_14px_rgba(15,23,42,0.45)] active:shadow-[0_3px_8px_rgba(15,23,42,0.4)]"
                onClick={() => setMobileOpen(false)}
              >
                Başvuru Yap
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </motion.header>
  );
}



