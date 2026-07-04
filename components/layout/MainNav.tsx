'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import { SocialLinks } from '@/components/layout/SocialLinks';
import type { SiteSettings } from '@/lib/settings/site';
import {
  createWhatsAppHref,
  DEFAULT_WHATSAPP_MESSAGE,
} from '@/lib/whatsapp';

type NavItem = {
  label: string;
  href?: string;
  title?: string;
  children?: { label: string; href: string; title?: string }[];
};

const VISA_SERVICES: NavItem = {
  label: 'Hizmetlerimiz',
  href: '/hizmetler',
  title: 'Hizmetlerimiz',
  children: [
    { label: 'Tüm Vize Hizmetleri', href: '/hizmetler' },
    { label: 'Çalışma Vizesi', href: '/hizmetler/calisma-vizesi' },
    { label: 'Mavi Kart Vizesi', href: '/hizmetler/mavi-kart-vizesi' },
    { label: 'Fırsat Kartı', href: '/hizmetler/firsat-karti' },
  ],
};

const AFTERCARE_SERVICES: NavItem = {
  label: 'Göç Sonrası Hizmetlerimiz',
  href: '/servisler',
  title: 'Göç Sonrası Hizmetlerimiz',
  children: [
    { label: 'Tüm Göç Sonrası Hizmetler', href: '/servisler' },
    {
      label: 'Oturum İzni Başvurusu ve Yenilenmesi',
      href: '/servisler/oturum-izni-basvurusu-ve-yenilenmesi',
    },
    { label: 'Yabancılar Dairesi İşlemleri', href: '/servisler/yabancilar-dairesi-islemleri' },
    { label: 'Çalışma İzni', href: '/servisler/calisma-izni' },
    { label: 'Sigorta ve Sosyal Güvenlik', href: '/servisler/sigorta-ve-sosyal-guvenlik' },
    { label: 'Vergi İşlemleri', href: '/servisler/vergi-islemleri' },
    { label: 'Barınma ve Emlak İşlemleri', href: '/servisler/barinma-ve-emlak-islemleri' },
    { label: 'Hukuki Danışmanlık ve Haklar', href: '/servisler/hukuki-danismanlik-ve-haklar' },
    { label: 'Kültürel ve Sosyal Rehberlik', href: '/servisler/kulturel-ve-sosyal-rehberlik' },
  ],
};

const MAIN_ITEMS: NavItem[] = [
  { label: 'Ana Sayfa', href: '/', title: 'Ana Sayfa' },
  { label: 'Hakkımızda', href: '/hakkimizda', title: 'Hakkımızda' },
  {
    label: 'Uygunluk Testi',
    href: '/uygunluk-testi',
    title: 'Almanya Vize Uygunluk Testi',
  },
  {
    label: 'Almanya Göç',
    href: '/almanya-goc',
    title: 'Almanya Göç Rehberi',
  },
  VISA_SERVICES,
  AFTERCARE_SERVICES,
  { label: 'S.S.S.', href: '/sss', title: 'Sıkça Sorulan Sorular' },
  { label: 'Blog', href: '/blog', title: 'Blog' },
  { label: 'İletişim', href: '/iletisim', title: 'İletişim' },
];

function normalizePathname(pathname: string) {
  const pathOnly = pathname.split('?')[0] || '/';
  const withoutPhp = pathOnly.endsWith('.php')
    ? pathOnly.slice(0, -4)
    : pathOnly;

  if (withoutPhp === '/index') {
    return '/';
  }

  return withoutPhp || '/';
}

function hrefPath(href?: string) {
  if (!href) {
    return '';
  }

  try {
    return normalizePathname(new URL(href, 'https://local.test').pathname);
  } catch {
    return normalizePathname(href);
  }
}

type MainNavProps = {
  site: SiteSettings;
};

export function MainNav({ site }: MainNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || '/';
  const currentPath = normalizePathname(pathname);

  const cleanedPhone = site.contactPhone.replace(/\s+/g, '');
  const telHref = cleanedPhone ? `tel:${cleanedPhone}` : undefined;

  const whatsappHref = createWhatsAppHref(site.whatsappNumber, {
    message: DEFAULT_WHATSAPP_MESSAGE,
  });

  const isHrefActive = (href?: string) => {
    const targetPath = hrefPath(href);

    if (!targetPath) {
      return false;
    }

    if (targetPath === '/') {
      return currentPath === '/';
    }

    if (targetPath === '/hizmetler' || targetPath === '/servisler') {
      return (
        currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
      );
    }

    if (targetPath === '/blog') {
      return currentPath === '/blog' || currentPath.startsWith('/blog/');
    }

    return currentPath === targetPath;
  };

  const isItemActive = (item: NavItem) =>
    isHrefActive(item.href) || item.children?.some((child) => isHrefActive(child.href));

  const desktopNavClass = (active?: boolean) =>
    [
      'inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-3 py-2 text-center font-semibold leading-none whitespace-nowrap transition-all duration-200 hover:-translate-y-[1px] hover:bg-brand-base/5 hover:text-brand-base hover:shadow-card',
      active
        ? 'bg-brand-base/10 text-brand-base shadow-[inset_0_0_0_1px_rgba(30,58,138,0.14)]'
        : 'text-slate-800',
    ].join(' ');

  const desktopItemClass = (item: NavItem, active?: boolean) => {
    const isFitTest = item.href === '/uygunluk-testi';
    const baseClass = desktopNavClass(active);

    if (!isFitTest) {
      return baseClass;
    }

    return 'inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-b from-brand-base to-brand-light px-5 py-2 text-center text-xs font-bold uppercase leading-none tracking-wide text-white shadow-[0_8px_18px_rgba(30,58,138,0.22)] ring-1 ring-blue-200/50 transition hover:-translate-y-[1px] hover:shadow-[0_12px_24px_rgba(30,58,138,0.28)]';
  };

  const mobileNavClass = (active?: boolean) =>
    [
      'block rounded-xl px-3 py-2 transition',
      active
        ? 'bg-brand-base/10 font-semibold text-brand-base'
        : 'text-slate-800 hover:bg-slate-50 hover:text-brand-base',
    ].join(' ');

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white shadow-sm"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Top bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-dark text-[13px] text-slate-100">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-2">
          {/* Sol: e-posta ve telefon */}
          <div className="hidden flex-wrap items-center gap-4 text-[11px] sm:flex sm:text-[13px]">
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
          <div className="min-w-0 flex-1 overflow-hidden sm:min-w-[320px]">
            <div className="animate-marquee whitespace-nowrap font-ui text-[11px] font-semibold tracking-wide text-slate-100/95 sm:text-[11px]">
              <span className="marquee-item">
                Hayallerini erteleme, doğru, güvenilir ve şeffaf rehberlik için hemen başvur
              </span>
              <span className="marquee-item" aria-hidden="true">
                Hayallerini erteleme, doğru, güvenilir ve şeffaf rehberlik için hemen başvur
              </span>
            </div>
          </div>

          {/* Sağ: sosyal ikonlar */}
          <div className="hidden items-center gap-2 sm:flex">
            <SocialLinks
              instagramUrl={site.instagramUrl}
              youtubeUrl={site.youtubeUrl}
              className="flex items-center gap-2"
            />
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
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-2 border-b border-slate-100 bg-white/95 px-4 py-3">
        <Link href="/" className="mr-8 flex min-h-14 shrink-0 items-center gap-3">
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
        <nav className="hidden flex-1 items-center justify-between gap-2 text-[13px] font-semibold text-slate-800 font-ui xl:gap-3 xl:text-sm md:flex">
          {MAIN_ITEMS.map((item) => {
            const active = isItemActive(item);

            return item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className={`gap-1 ${desktopNavClass(active)}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  <span className="text-xs leading-none">+</span>
                </button>
                <div className="invisible absolute left-0 top-full z-50 w-72 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-xl border border-slate-100 bg-white text-xs shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                    <ul className="py-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              item.href && (
                <Link
                  key={item.label}
                  href={item.href}
                  className={desktopItemClass(item, active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            );
          })}

          <Link
            href="/basvuru"
            className="relative inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-b from-brand-red to-red-700 px-5 py-2.5 text-center text-xs font-bold uppercase leading-none tracking-wide text-white shadow-[0_8px_18px_rgba(185,28,28,0.28)] ring-1 ring-red-300/35 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(185,28,28,0.34)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(185,28,28,0.22)] font-ui"
          >
            Başvuru Yap
          </Link>
        </nav>

        {/* Mobile CTA (sadece mobilde görünsün) */}
        <Link
          href="/basvuru"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-b from-brand-red to-red-700 px-4 py-2 text-xs font-ui font-semibold uppercase leading-none tracking-wide text-white shadow-[0_6px_14px_rgba(15,23,42,0.28)] md:hidden"
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
        <nav className="fixed inset-x-0 top-[116px] z-50 max-h-[calc(100dvh-116px)] overflow-y-auto overscroll-contain border-t border-slate-100 bg-white px-4 py-3 text-sm font-ui shadow-2xl md:hidden">
          <ul className="space-y-2">
            {MAIN_ITEMS.map((item) => {
              const active = isItemActive(item);

              return item.children ? (
                <li key={item.label}>
                  <div
                    className={[
                      'mb-1 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide',
                      active
                        ? 'bg-brand-base/10 text-brand-base'
                        : 'text-slate-500',
                    ].join(' ')}
                  >
                    {item.label}
                  </div>
                  <ul className="space-y-1 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={mobileNavClass(isHrefActive(child.href))}
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
                      className={mobileNavClass(active)}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              );
            })}
            <li className="pt-2">
              <Link
                href="/basvuru"
                className="block whitespace-nowrap rounded-full bg-gradient-to-b from-brand-red to-red-700 px-4 py-2 text-center text-xs font-semibold uppercase leading-none tracking-wide text-white shadow-[0_6px_14px_rgba(15,23,42,0.28)] active:shadow-[0_3px_8px_rgba(15,23,42,0.22)]"
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



