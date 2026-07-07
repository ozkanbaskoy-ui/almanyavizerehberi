'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { SiteSettings } from '@/lib/settings/site';
import {
  buildWhatsAppCommunityLinks,
  normalizeExternalUrl,
} from '@/lib/whatsappCommunity';

const AUTO_OPEN_DELAY_MS = 650;

function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2.5A9.5 9.5 0 0 0 4.17 17.35L3 21l3.75-1.1A9.5 9.5 0 1 0 12 2.5Zm4.85 13.7c-.2.57-1.16 1.1-1.6 1.16-.42.07-.96.1-1.55-.09-.36-.12-.82-.27-1.42-.52-2.5-1.08-4.12-3.63-4.24-3.8-.12-.17-1.01-1.34-1.01-2.56s.64-1.82.87-2.07c.2-.22.55-.34.89-.34h.64c.2 0 .48-.08.75.58.28.67.96 2.32 1.04 2.48.08.17.13.38.03.59-.1.21-.15.34-.31.52-.15.18-.32.4-.46.53-.15.16-.31.33-.13.65.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.5 1.54.33.16.52.13.72-.08.2-.2.84-.98 1.08-1.31.24-.32.48-.26.8-.15.33.12 2.08.98 2.44 1.16.36.18.6.27.69.42.08.14.08.8-.12 1.37Z"
      />
    </svg>
  );
}

function LinkArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7H17V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 7L10.5 16.5 4 10"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type WhatsAppCommunityPopupProps = {
  site: SiteSettings;
};

export function WhatsAppCommunityPopup({
  site,
}: WhatsAppCommunityPopupProps) {
  const groupUrl = useMemo(
    () => normalizeExternalUrl(site.whatsappGroupUrl),
    [site.whatsappGroupUrl],
  );
  const channelUrl = useMemo(
    () => normalizeExternalUrl(site.whatsappChannelUrl),
    [site.whatsappChannelUrl],
  );
  const communityLinks = useMemo(
    () => buildWhatsAppCommunityLinks({ groupUrl, channelUrl }),
    [channelUrl, groupUrl],
  );
  const highlights = [
    {
      title: 'Anlık duyurular',
      description: 'Yeni içerikler ve önemli site güncellemeleri.',
    },
    {
      title: 'Topluluk desteği',
      description: 'Sorularınızı grup üzerinden daha hızlı paylaşın.',
    },
    {
      title: 'Tek tık erişim',
      description: 'Grup ve kanal bağlantılarına doğrudan ulaşın.',
    },
  ];
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!communityLinks.length) return;

    if (typeof window === 'undefined') return;
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setOpen(true);
    }, AUTO_OPEN_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [channelUrl, groupUrl, communityLinks.length]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, open]);

  if (!open || !communityLinks.length) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm sm:items-center"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-community-popup-title"
        aria-describedby="whatsapp-community-popup-description"
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-[0_28px_90px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-base via-emerald-400 to-cyan-400" />

        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/15">
                  <WhatsAppMark className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                    WhatsApp Topluluk
                  </p>
                  <h2
                    id="whatsapp-community-popup-title"
                    className="mt-1 font-heading text-2xl font-semibold text-brand-dark md:text-3xl"
                  >
                    Grup ve kanala katılın
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Pop-up'ı kapat"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-surface-soft text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <p
              id="whatsapp-community-popup-description"
              className="mt-4 max-w-xl text-sm leading-6 text-slate-600"
            >
              Duyurular, güncellemeler ve topluluk paylaşımları için WhatsApp
              grubumuz ve kanalımızı takip edebilirsiniz.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-surface-soft px-3 py-1 text-xs font-semibold text-slate-600">
                Duyurular
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-surface-soft px-3 py-1 text-xs font-semibold text-slate-600">
                Topluluk
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-surface-soft px-3 py-1 text-xs font-semibold text-slate-600">
                Hızlı erişim
              </span>
            </div>

            <div
              className={`mt-6 grid gap-3 ${
                communityLinks.length > 1 ? 'sm:grid-cols-2' : ''
              }`}
            >
              {communityLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target="_blank"
                  rel="noreferrer"
                  className={`group inline-flex min-h-12 items-center justify-between gap-4 rounded-full border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                    link.tone === 'emerald'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-300 hover:bg-emerald-100 focus:ring-emerald-500/20'
                      : 'border-sky-200 bg-sky-50 text-sky-950 hover:border-sky-300 hover:bg-sky-100 focus:ring-sky-500/20'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <WhatsAppMark className="h-5 w-5 shrink-0" />
                    <span className="whitespace-normal text-left">{link.label}</span>
                  </span>
                  <LinkArrowIcon
                    className={`h-4 w-4 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                      link.tone === 'emerald'
                        ? 'text-emerald-600'
                        : 'text-sky-600'
                    }`}
                  />
                </a>
              ))}
            </div>

          </div>

          <aside className="hidden border-l border-slate-200 bg-slate-50/80 px-6 py-6 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="eyebrow text-emerald-600">Neden katılmalı?</p>
              <h3 className="mt-2 font-heading text-xl font-semibold text-brand-dark">
                Güncellemeleri tek yerden takip edin
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Başvuru duyuruları, yeni içerikler ve topluluk paylaşımları için
                grup ve kanalı kullanabilirsiniz.
              </p>
            </div>

            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/15">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-dark">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
