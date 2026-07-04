'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { SocialLinks } from '@/components/layout/SocialLinks';
import type { SiteSettings } from '@/lib/settings/site';
import {
  createWhatsAppHref,
  DEFAULT_WHATSAPP_MESSAGE,
} from '@/lib/whatsapp';

type FooterProps = {
  site: SiteSettings;
};

const PRIMARY_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/almanya-goc', label: 'Almanya Göç Rehberi' },
  { href: '/uygunluk-testi', label: 'Uygunluk Testi' },
  { href: '/hizmetler', label: 'Hizmetlerimiz' },
  { href: '/servisler', label: 'Göç Sonrası' },
  { href: '/blog', label: 'Blog' },
  { href: '/sss', label: 'Sık Sorulan Sorular' },
];

const LEGAL_LINKS = [
  { href: '/basvuru', label: 'Randevu Al' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/cerezler', label: 'Çerez Politikası' },
  { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
  { href: '/kvkk', label: 'K.V.K.K. Metni' },
  { href: '/sorumluluk-reddi', label: 'Sorumluluk Reddi' },
  { href: '/gdpr', label: 'Data Protection & Privacy' },
];

export function Footer({ site }: FooterProps) {
  const whatsappHref = createWhatsAppHref(site.whatsappNumber, {
    message: DEFAULT_WHATSAPP_MESSAGE,
  });

  const cleanedPhone = site.contactPhone.replace(/\s+/g, '');
  const telHref = cleanedPhone ? `tel:${cleanedPhone}` : undefined;

  return (
    <motion.footer
      className="mt-0 bg-slate-950 text-slate-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative overflow-hidden border-t border-white/10 bg-[linear-gradient(135deg,#07111f_0%,#0f172a_48%,#17346b_100%)]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/assets/img/footer-bg.jpg')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />

        <div className="relative mx-auto max-w-[1200px] px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.75fr_0.75fr]">
            <div>
              <Link
                href="/"
                className="inline-flex"
              >
                <Image
                  src="/assets/img/logo-yan.webp"
                  alt={site.siteName || 'Almanya Vize Rehberi'}
                  width={168}
                  height={42}
                  className="h-9 w-auto drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]"
                />
              </Link>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                Almanya&apos;ya göç, çalışma, eğitim ve aile birleşimi
                süreçlerinde başvurunuzu daha net, düzenli ve güvenli şekilde
                planlamanız için uçtan uca danışmanlık sunuyoruz.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                {site.contactEmail && (
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 hover:border-brand-light/40 hover:text-white"
                  >
                    {site.contactEmail}
                  </a>
                )}
                {telHref && (
                  <a
                    href={telHref}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 hover:border-brand-light/40 hover:text-white"
                  >
                    {site.contactPhone}
                  </a>
                )}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <SocialLinks
                  instagramUrl={site.instagramUrl}
                  youtubeUrl={site.youtubeUrl}
                  variant="footer"
                  className="flex items-center gap-3"
                />
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/20 text-emerald-200 transition hover:bg-emerald-500 hover:text-white"
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

            <div>
              <h4 className="border-b border-white/10 pb-3 font-heading text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Site Haritası
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                {PRIMARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="border-b border-white/10 pb-3 font-heading text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Kurumsal
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
              ©{' '}
              <span className="font-semibold text-slate-300">
                almanyavizerehberi.com
              </span>
              . Tüm hakları saklıdır.
            </div>
            <div className="text-slate-500">
              Almanya vize ve göç danışmanlığı için profesyonel rehberlik.
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
