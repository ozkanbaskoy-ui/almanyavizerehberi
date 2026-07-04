'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  CRM_USER_ROLES,
  CRM_USER_STATUSES,
  type CrmUserRole,
  type CrmUserStatus,
} from '@/lib/admin/crmUserModel';

export function NewCrmUserForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<CrmUserRole>('case_advisor');
  const [status, setStatus] = useState<CrmUserStatus>('active');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName || !email || !username || !password) {
      setError('Lütfen zorunlu alanları doldurun.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
          role,
          status,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(
          json.error || 'CRM kullanıcısı oluşturulurken hata oluştu.',
        );
      }

      setSuccess(
        json.storage === 'local'
          ? 'CRM kullanıcısı lokal geliştirme deposuna kaydedildi.'
          : 'CRM kullanıcısı oluşturuldu.',
      );
      setFullName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setRole('case_advisor');
      setStatus('active');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'CRM kullanıcısı oluşturulurken hata oluştu.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel mt-6 space-y-4 p-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-950">
          Yeni CRM Kullanıcısı
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          İç ekip için kullanıcı oluşturun. Müşteri hesapları bu bölümden ayrı
          tutulur.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">Ad Soyad</label>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Geçici Şifre</label>
          <input
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-input"
            placeholder="Örn. CRM2026!"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">Rol</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as CrmUserRole)}
            className="form-select"
          >
            {CRM_USER_ROLES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Durum</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as CrmUserStatus)}
            className="form-select"
          >
            {CRM_USER_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Kaydediliyor...' : 'Kullanıcı Oluştur'}
        </button>
      </div>
    </form>
  );
}
