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
      className="mt-0 border-t border-slate-800 bg-slate-950 text-slate-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
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
        <div className="relative mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-heading text-lg font-semibold tracking-tight">
                {site.siteName || 'Almanya Vize Rehberi'}
              </h3>
              <p className="mt-3 text-sm text-slate-300/90">
                Almanya&apos;ya göç sürecinizde güvenilir partneriniz. Çalışma,
                eğitim ve aile birleşimi vizelerinde uzman danışmanlık
                sunuyoruz.
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                {site.instagramUrl && (
                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-slate-200 shadow-sm ring-1 ring-slate-700/70 transition hover:bg-brand-coral hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
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
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-slate-200 shadow-sm ring-1 ring-slate-700/70 transition hover:bg-emerald-500 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
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

            {/* Primary links */}
            <div>
              <h4 className="font-heading text-[13px] font-semibold uppercase tracking-wide text-slate-300">
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
                    Sosyal Medya Videoları
                  </Link>
                </li>
                <li>
                  <Link href="/sss.php" className="hover:text-brand-coral">
                    Sık Sorulan Sorular
                  </Link>
                </li>
              </ul>
            </div>

            {/* Secondary links */}
            <div>
              <h4 className="font-heading text-[13px] font-semibold uppercase tracking-wide text-slate-300">
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

          {/* Newsletter */}
          <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-300">
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
                className="flex-1 rounded-md border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="font-ui rounded-md bg-brand-red px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-red-700"
              >
                Abone Ol
              </button>
            </form>
          </div>

          {/* Bottom line */}
          <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-3 text-[11px] text-slate-500 md:flex-row md:items-center">
            <div>
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold text-slate-200">
                almanyavizerehberi.com
              </span>
              . Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
