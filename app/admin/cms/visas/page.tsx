import Link from 'next/link';

import { getAllVisas } from '@/lib/content/visas';

export const metadata = {
  title: 'CMS / Vize İçerikleri',
};

export default function AdminCmsVisasPage() {
  const visas = getAllVisas();

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Vize Sayfaları
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Buradan vize sayfalarının başlık, SEO alanları ve HTML içeriğini
        düzenleyebilirsiniz.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visas.map((visa) => (
          <article
            key={visa.slug}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              {visa.title}
            </h2>
            <p className="mt-1 line-clamp-3 text-xs text-slate-600">
              {visa.seoDescription}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <Link
                  href={`/hizmetler/${visa.slug}`}
                  className="text-xs font-semibold text-brand-base hover:text-brand-light"
                >
                  Ön Yüzü Gör
                </Link>
                <Link
                  href={`/admin/cms/visas/${visa.slug}`}
                  className="text-xs font-semibold text-slate-700 hover:text-brand-base"
                >
                  Düzenle
                </Link>
              </div>
              <span className="text-[11px] text-slate-400">
                slug: {visa.slug}
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

