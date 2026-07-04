'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { SiteSettings } from '@/lib/settings/site';
import {
  buildWhatsAppCommunityLinks,
  normalizeExternalUrl,
} from '@/lib/whatsappCommunity';

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

type WhatsAppCommunityBannerProps = {
  site: SiteSettings;
};

export function WhatsAppCommunityBanner({
  site,
}: WhatsAppCommunityBannerProps) {
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
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!communityLinks.length) return;
    if (typeof window === 'undefined') return;

    setVisible(true);
  }, [communityLinks.length]);

  if (!visible || !communityLinks.length) {
    return null;
  }

  return (
    <section className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="site-container py-3">
        <div className="relative flex flex-col gap-3 rounded-lg border border-emerald-200/70 bg-emerald-50/70 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 sm:right-4 sm:top-4"
            aria-label="Banner'ı kapat"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 pr-12 sm:pr-0">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/15">
              <WhatsAppMark className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow text-emerald-600">WhatsApp Topluluk</p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">
                Grup ve kanal bağlantıları burada.
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Duyurular ve topluluk paylaşımları için hızlı erişim.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:pr-12">
            {communityLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex min-h-10 items-center justify-between gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                  link.tone === 'emerald'
                    ? 'border-emerald-200 bg-white text-emerald-950 hover:border-emerald-300 hover:bg-emerald-50 focus:ring-emerald-500/20'
                    : 'border-sky-200 bg-white text-sky-950 hover:border-sky-300 hover:bg-sky-50 focus:ring-sky-500/20'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <WhatsAppMark className="h-4 w-4 shrink-0" />
                  {link.label}
                </span>
                <LinkArrowIcon
                  className={`h-4 w-4 shrink-0 ${
                    link.tone === 'emerald'
                      ? 'text-emerald-600'
                      : 'text-sky-600'
                  }`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
