'use client';

import {
  createWhatsAppHref,
  DEFAULT_WHATSAPP_MESSAGE,
} from '@/lib/whatsapp';

type WhatsAppFloatingButtonProps = {
  whatsappNumber: string;
};

export function WhatsAppFloatingButton({
  whatsappNumber,
}: WhatsAppFloatingButtonProps) {
  const href = createWhatsAppHref(whatsappNumber, {
    message: DEFAULT_WHATSAPP_MESSAGE,
  });

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile hızlı iletişim"
      className="whatsapp-floating-button group fixed bottom-6 right-5 z-50 inline-flex items-center gap-3 rounded-full border border-white/20 bg-emerald-500 px-4 py-3 text-white shadow-[0_18px_42px_rgba(16,185,129,0.35)] ring-4 ring-emerald-500/15 transition hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-[0_22px_54px_rgba(16,185,129,0.45)] focus:outline-none focus:ring-4 focus:ring-emerald-300 md:bottom-8 md:right-8"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-400/35 opacity-60" />
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M20.5 12a8.5 8.5 0 0 0-14.5-6A8.44 8.44 0 0 0 3.5 12a8.32 8.32 0 0 0 1.2 4.3L3 21l4.8-1.6A8.55 8.55 0 0 0 20.5 12Zm-4.4 4.4a4.82 4.82 0 0 1-2.3.6 7.24 7.24 0 0 1-3.8-1.1 8.1 8.1 0 0 1-2.5-2.4 4.66 4.66 0 0 1-.9-2.6 3 3 0 0 1 1-2.2.79.79 0 0 1 .6-.3h.4c.2 0 .3 0 .4.3s.5 1.2.5 1.3a.33.33 0 0 1 0 .3 1.09 1.09 0 0 1-.2.3l-.2.3a.59.59 0 0 0-.1.5 3.09 3.09 0 0 0 .6 1.1 5.38 5.38 0 0 0 1.7 1.4 3.71 3.71 0 0 0 1.1.4.58.58 0 0 0 .4-.1l.4-.4a1.2 1.2 0 0 1 .4-.3.42.42 0 0 1 .4.1l1.2.6a1 1 0 0 1 .5.4.89.89 0 0 1-.1.5 3.64 3.64 0 0 1-1.3 1.4Z"
          />
        </svg>
      </span>
      <span className="hidden pr-1 text-left text-sm font-semibold leading-tight md:block">
        WhatsApp
        <span className="block text-xs font-medium text-emerald-50/85">
          Bilgi alın
        </span>
      </span>
    </a>
  );
}
