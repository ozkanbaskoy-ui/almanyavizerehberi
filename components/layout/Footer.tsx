'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import type { SiteSettings } from '@/lib/settings/site';

type FooterProps = {
  site: SiteSettings;
};

export function Footer({ site }: FooterProps) {
  const whatsappClean = site.whatsappNumber.replace(/\s+/g, '');
  const whatsappHref = whatsappClean
    ? `https://wa.me/${whatsappClean.replace('+', '')}`
    : undefined;

  return (
    <motion.footer
      className="mt-0 border-t border-slate-200 bg-slate-950 text-slate-100"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div
        className="relative"
        style={{
          backgroundImage: "url('/assets/img/footer-bg.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="font-semibold tracking-tight">
                {site.siteName || 'Almanya Vize Rehberi'}
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                Almanya&apos;ya göç sürecinizde güvenilir partneriniz.
                Çalışma, eğitim ve aile birleşimi vizelerinde uzman
                danışmanlık sunuyoruz.
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                {site.instagramUrl && (
                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-300 transition-colors hover:text-brand-coral"
                  >
                    Instagram
                  </a>
                )}
                {site.instagramUrl && whatsappHref && (
                  <span className="text-slate-500">•</span>
                )}
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-300 transition-colors hover:text-brand-coral"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Linkler
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/index.php" className="hover:text-brand-coral">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hakkimizda.php"
                    className="hover:text-brand-coral"
                  >
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hizmetler.php?l=1"
                    className="hover:text-brand-coral"
                  >
                    Hizmetlerimiz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servisler.php?l=1"
                    className="hover:text-brand-coral"
                  >
                    Göç Sonrası
                  </Link>
                </li>
                <li>
                  <Link href="/blog.php" className="hover:text-brand-coral">
                    Blog Yazıları
                  </Link>
                </li>
                <li>
                  <Link
                    href="/index.php#yorum"
                    className="hover:text-brand-coral"
                  >
                    Müşteri Yorumları
                  </Link>
                </li>
                <li>
                  <Link href="/sss.php" className="hover:text-brand-coral">
                    Sık Sorulan Sorular
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Diğer Linkler
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/basvuru.php"
                    className="hover:text-brand-coral"
                  >
                    Başvuru Formu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cerezler.php"
                    className="hover:text-brand-coral"
                  >
                    Çerez Politikası
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kullanim-sartlari.php"
                    className="hover:text-brand-coral"
                  >
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/kvkk.php" className="hover:text-brand-coral">
                    K.V.K.K. Metni
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sorumluluk-reddi.php"
                    className="hover:text-brand-coral"
                  >
                    Sorumluluk Reddi
                  </Link>
                </li>
                <li>
                  <Link href="/gdpr.php" className="hover:text-brand-coral">
                    Data Protection &amp; Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6 border-t border-slate-800 pt-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Bültenimize Abone Olun
              </h4>
              <p className="mt-2 text-xs text-slate-400">
                Son gelişmelerden haberdar olmak için bültenimize abone olun.
              </p>
            </div>
            <form className="flex max-w-md gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="Mail adresinizi giriniz"
                className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-red px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-red-700"
              >
                Abone Ol
              </button>
            </form>
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-500 md:flex-row md:items-center">
            <div>
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold text-slate-200">
                almanyavizerehberi.com
              </span>
              . Tüm hakları saklıdır.
            </div>
            <div>
              Designed by{' '}
              <a
                href="https://parkdijital.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand-coral hover:underline"
              >
                Park Dijital
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

