import Link from 'next/link';

export const metadata = {
  title: 'Yönetim Paneli',
};

export default function AdminLandingPage() {
  return (
    <main className="mx-auto max-w-[960px] px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-dark">
        Yönetim Paneli
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Buradan sitenin renk temalarını, ana sayfa metinlerini ve genel
        ayarları kod yazmadan güncelleyebilirsiniz.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/site"
          className="group rounded-2xl border border-border-subtle bg-surface-main p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-base hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-brand-dark">
            Site Genel Ayarları
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            İletişim bilgileri, WhatsApp numarası, sosyal medya linkleri ve
            Calendly / YouTube entegrasyonlarını yönetin.
          </p>
        </Link>

        <Link
          href="/admin/theme"
          className="group rounded-2xl border border-border-subtle bg-surface-main p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-base hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-brand-dark">
            Renk Temaları
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Hazır renk paketleri arasından seçim yapın, hero ve video
            alanlarının görünümünü anında değiştirin.
          </p>
        </Link>

        <Link
          href="/admin/home"
          className="group rounded-2xl border border-border-subtle bg-surface-main p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-base hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-brand-dark">
            Ana Sayfa Metinleri
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Hero başlığı, açıklamalar ve video bloğu metinlerini kolayca
            güncelleyin.
          </p>
        </Link>

        <Link
          href="/admin/typography"
          className="group rounded-2xl border border-border-subtle bg-surface-main p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-base hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-brand-dark">
            Tipografi (Yazı Boyutları)
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Başlıkların ve paragraf metinlerinin genel büyüklük seviyesini
            ayarlayın (küçük / normal / büyük).
          </p>
        </Link>
      </div>
    </main>
  );
}

