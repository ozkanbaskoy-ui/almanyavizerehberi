'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Bu çubuk her sayfa yüklemesinde görünür; "Kabul Et"e basınca sadece o oturumda kapanır.
export function LegalConsentBar() {
  useEffect(() => {
    document.body.classList.add('legal-consent-visible');

    return () => {
      document.body.classList.remove('legal-consent-visible');
    };
  }, []);

  function handleAccept() {
    const bar = document.getElementById('legal-consent-bar');
    if (bar) {
      bar.style.display = 'none';
    }
    document.body.classList.remove('legal-consent-visible');
  }

  return (
    <div
      id="legal-consent-bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900/95 text-slate-100"
    >
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-3 text-xs md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-4 md:text-sm">
        <p className="min-w-0 leading-snug md:pr-2">
          Web sitemiz, size en iyi deneyimi sunmak ve yasal yükümlülüklerimizi
          yerine getirmek için çerezler kullanır. Devam ederek{' '}
          <Link
            href="/kullanim-sartlari"
            className="underline underline-offset-2 hover:text-brand-coral"
          >
            Kullanım Şartları
          </Link>
          ,{' '}
          <Link
            href="/kvkk"
            className="underline underline-offset-2 hover:text-brand-coral"
          >
            KVKK Aydınlatma Metni
          </Link>
          ,{' '}
          <Link
            href="/sorumluluk-reddi"
            className="underline underline-offset-2 hover:text-brand-coral"
          >
            Sorumluluk Reddi
          </Link>{' '}
          ve{' '}
          <Link
            href="/cerezler"
            className="underline underline-offset-2 hover:text-brand-coral"
          >
            Çerez Politikası
          </Link>
          'nı okuduğunuzu ve kabul ettiğinizi onaylamış olursunuz.
        </p>

        <div className="flex items-start justify-start md:justify-end">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-brand-red px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-red-700 md:text-xs"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
