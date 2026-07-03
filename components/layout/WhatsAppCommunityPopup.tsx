'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { SiteSettings } from '@/lib/settings/site';

const DISMISS_KEY = 'whatsapp-community-popup-dismissed-at';
const DISMISS_WINDOW_MS = 1000 * 60 * 60 * 24 * 7;
const AUTO_OPEN_DELAY_MS = 1800;

function normalizeExternalUrl(value?: string | null) {
  const raw = value?.trim();
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

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
  const communityLinks = useMemo(() => {
    const entries = [
      groupUrl
        ? {
            href: groupUrl,
            label: 'WhatsApp Grubu',
            tone: 'emerald' as const,
          }
        : null,
      channelUrl
        ? {
            href: channelUrl,
            label: 'WhatsApp Kanalı',
            tone: 'sky' as const,
          }
        : null,
    ].filter(Boolean) as Array<{
      href: string;
      label: string;
      tone: 'emerald' | 'sky';
    }>;

    const seen = new Set<string>();
    return entries.filter((entry) => {
      if (seen.has(entry.href)) return false;
      seen.add(entry.href);
      return true;
    });
  }, [channelUrl, groupUrl]);
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!communityLinks.length) return;

    if (typeof window === 'undefined') return;

    const dismissedAtRaw = window.localStorage.getItem(DISMISS_KEY);
    if (dismissedAtRaw) {
      const dismissedAt = Number(dismissedAtRaw);
      if (
        !Number.isNaN(dismissedAt) &&
        Date.now() - dismissedAt < DISMISS_WINDOW_MS
      ) {
        return;
      }
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [handleClose, open]);

  if (!open || !communityLinks.length) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm sm:items-center"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-community-popup-title"
        aria-describedby="whatsapp-community-popup-description"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-white shadow-[0_24px_80px_rgba(2,6,23,0.65)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />

        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <WhatsAppMark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                WhatsApp Topluluk
              </p>
              <h2
                id="whatsapp-community-popup-title"
                className="mt-1 text-xl font-semibold text-white"
              >
                Grup ve kanala katılın
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Pop-up'ı kapat"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-5 pt-4">
          <p
            id="whatsapp-community-popup-description"
            className="text-sm leading-6 text-slate-300"
          >
            Duyurular, güncellemeler ve topluluk paylaşımları için WhatsApp
            grubumuz ve kanalımızı takip edebilirsiniz.
          </p>

          <div
            className={`mt-5 grid gap-3 ${
              communityLinks.length > 1 ? 'sm:grid-cols-2' : ''
            }`}
          >
            {communityLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`group inline-flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition hover:text-white ${
                  link.tone === 'emerald'
                    ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100 hover:border-emerald-300/40 hover:bg-emerald-500/15'
                    : 'border-sky-400/20 bg-sky-500/10 text-sky-100 hover:border-sky-300/40 hover:bg-sky-500/15'
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  <WhatsAppMark className="h-5 w-5" />
                  {link.label}
                </span>
                <LinkArrowIcon
                  className={`h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    link.tone === 'emerald'
                      ? 'text-emerald-200'
                      : 'text-sky-200'
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/10"
            >
              Sonra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
