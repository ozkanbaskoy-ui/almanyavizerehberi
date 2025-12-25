'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'password' | 'code';

export default function AdminLoginPage() {
  const [step, setStep] = useState<Step>('password');
  const [username, setUsername] = useState('ozkan');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      if (step === 'password') {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'password', username, password }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(
            data?.error ??
              'Giriş yapılamadı. Lütfen kullanıcı adı / şifreyi kontrol edin.',
          );
        }

        const data = (await res.json().catch(() => null)) as
          | { step?: string }
          | null;

        if (data?.step === 'code') {
          setStep('code');
          setInfo(
            'Şifre doğrulandı. Kayıtlı yönetici e-posta adresinize tek kullanımlık bir doğrulama kodu gönderildi. Lütfen e-postanızı kontrol edin.',
          );
          return;
        }

        // No OTP (SMTP not configured): go directly to admin.
        router.push('/admin');
        return;
      }

      // step === 'code'
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'code', code }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ??
            'Doğrulama kodu kabul edilmedi. Lütfen kodu kontrol edip tekrar deneyin.',
        );
      }

      router.push('/admin');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-8 shadow-xl">
        <h1 className="text-center text-xl font-semibold text-slate-50">
          Admin Girişi
        </h1>
        <p className="mt-2 text-center text-xs text-slate-400">
          Yönetim paneline giriş için kullanıcı adı, şifre ve (varsa) e-posta
          ile gönderilen doğrulama kodu kullanılır.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {step === 'password' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Kullanıcı adı
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="ozkan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Yönetici şifresi
                </label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {step === 'code' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                E-posta doğrulama kodu
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="6 haneli kod"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <p className="mt-2 text-[11px] text-slate-500">
                Kod e-posta kutunuza gelmediyse spam / gereksiz klasörünü
                kontrol edin. Süresi dolarsa tekrar giriş yaparak yeni bir kod
                isteyebilirsiniz.
              </p>
            </div>
          )}

          {info && (
            <p className="text-xs text-emerald-400">
              {info}
            </p>
          )}

          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-60"
          >
            {loading
              ? step === 'password'
                ? 'Giriş yapılıyor...'
                : 'Kod doğrulanıyor...'
              : step === 'password'
                ? 'Devam et'
                : 'Panele giriş yap'}
          </button>

          <p className="mt-3 text-center text-[11px] text-slate-500">
            Not: Üretim ortamında{' '}
            <code className="rounded bg-slate-800 px-1">
              ADMIN_USERNAME
            </code>{' '}
            ve{' '}
            <code className="rounded bg-slate-800 px-1">
              ADMIN_PASSWORD
            </code>{' '}
            değişkenlerini, ayrıca SMTP ayarlarını mutlaka güçlü değerlerle
            tanımlayın.
          </p>
        </form>
      </div>
    </main>
  );
}

