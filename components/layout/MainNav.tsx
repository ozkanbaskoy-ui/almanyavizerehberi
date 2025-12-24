'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

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

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white shadow-sm"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Top bar */}
      <div className="bg-[#545454] text-[13px] text-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:info@almanyavizerehberi.com"
              className="transition-colors hover:text-brand-coral"
            >
              info@almanyavizerehberi.com
            </a>
            <a
              href="tel:+491783821542"
              className="transition-colors hover:text-brand-coral"
            >
              +49 178 382 1542
            </a>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <a
              href="https://www.instagram.com/almanyavizerehberi"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-brand-coral"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/491783821542"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="transition-colors hover:text-brand-coral"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 border-b border-slate-100 bg-white/95">
        <Link href="/index.php" className="flex items-center gap-3">
          <Image
            src="/assets/img/logo-yan.webp"
            alt="Almanya Vize Rehberi"
            width={180}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-6 text-[15px] font-semibold text-slate-800 md:flex">
          {MAIN_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 text-[15px] font-semibold text-slate-800 transition-colors hover:text-sky-700"
                >
                  <span>{item.label}</span>
                  <span className="text-xs">v</span>
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
                  className="text-[15px] font-semibold text-slate-800 transition-colors hover:text-sky-700"
                >
                  {item.label}
                </Link>
              )
            )
          )}

          <Link
            href="/basvuru.php"
            className="rounded-full bg-brand-red px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-red-700"
          >
            Başvuru Yap
          </Link>
        </nav>

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
        <nav className="border-t border-slate-100 bg-white px-4 py-3 text-sm md:hidden">
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
                className="block rounded-full bg-brand-red px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white"
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
