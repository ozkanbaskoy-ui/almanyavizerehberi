import Link from 'next/link';

import { getAllBlogPosts } from '@/lib/content/blog';

export const metadata = {
  title: 'CMS / Blog Yazıları',
};

export default function AdminCmsBlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Blog Yazıları
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Buradan blog yazılarının başlık, tarih, SEO alanları ve HTML içeriğini
        düzenleyebilirsiniz.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              {post.title}
            </h2>
            {post.date && (
              <p className="mt-1 text-[11px] text-slate-500">
                {post.date}
              </p>
            )}
            <p className="mt-1 line-clamp-3 text-xs text-slate-600">
              {post.seoDescription}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-brand-base hover:text-brand-light"
                >
                  Ön Yüzü Gör
                </Link>
                <Link
                  href={`/admin/cms/blog/${post.slug}`}
                  className="text-xs font-semibold text-slate-700 hover:text-brand-base"
                >
                  Düzenle
                </Link>
              </div>
              <span className="text-[11px] text-slate-400">
                slug: {post.slug}
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

