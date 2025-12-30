'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Yeni sürüm anahtarı: daha önce verilen onayları sıfırlamak için
// v4 -> herkese çubuğu tekrar gösterir
const STORAGE_KEY = 'avrh_legal_consent_v4';

type VisibleState = 'unknown' | 'shown' | 'hidden';

export function LegalConsentBar() {
  const [visible, setVisible] = useState<VisibleState>('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const accepted = window.localStorage.getItem(STORAGE_KEY);
      if (accepted === 'true') {
        setVisible('hidden');
      } else {
        setVisible('shown');
      }
    } catch {
      // localStorage kullanılamıyorsa barı yine de göster
      setVisible('shown');
    }
  }, []);

  function handleAccept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setVisible('hidden');
  }

  if (visible !== 'shown') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900/95 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 text-xs md:flex-row md:items-center md:justify-between md:text-sm">
        <p className="leading-snug">
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

        <div className="flex items-center justify-end">
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

