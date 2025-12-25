import Link from 'next/link';

import { getAllPages } from '@/lib/content/pages';

export const metadata = {
  title: 'CMS / Statik Sayfalar',
};

export default function AdminCmsPagesPage() {
  const pages = getAllPages();

  // Önceliklendirmek istediğimiz sayfaları öne alıyoruz
  const order = [
    'hakkimizda',
    'iletisim',
    'basvuru',
    'index',
    'cerezler',
    'kullanim-sartlari',
    'kvkk',
    'sorumluluk-reddi',
    'gdpr',
  ];

  const sorted = [...pages].sort((a, b) => {
    const ai = order.indexOf(a.slug);
    const bi = order.indexOf(b.slug);
    const aIndex = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const bIndex = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.slug.localeCompare(b.slug);
  });

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Statik Sayfalar
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Buradan Hakkımızda, İletişim, Başvuru ve diğer yasal metin sayfalarının
        başlık, SEO alanları ve HTML içeriğini düzenleyebilirsiniz.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((page) => (
          <article
            key={page.slug}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              {page.title}
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
              slug: {page.slug}
            </p>
            <p className="mt-1 line-clamp-3 text-xs text-slate-600">
              {page.seoDescription}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <Link
                  href={
                    page.source && page.source !== '/'
                      ? page.source
                      : '/index.php'
                  }
                  className="text-xs font-semibold text-brand-base hover:text-brand-light"
                >
                  Ön Yüzü Gör
                </Link>
                <Link
                  href={`/admin/cms/pages/${page.slug}`}
                  className="text-xs font-semibold text-slate-700 hover:text-brand-base"
                >
                  Düzenle
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

