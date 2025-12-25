import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { getAllBlogPosts } from '@/lib/content/blog';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Blog Yazıları - Almanya Vize Rehberi',
  description:
    "Almanya Vize Rehberi olarak Almanya'ya göç, çalışma, eğitim ve Almanya'da günlük yaşamla ilgili güncel blog yazıları paylaşıyoruz.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  // Kart özeti: önce SEO açıklaması, yoksa içerikten sade metin üret
  const getExcerpt = (post: ReturnType<typeof getAllBlogPosts>[number]) => {
    const fromSeo = post.seoDescription?.trim();
    if (fromSeo && fromSeo.length > 0) return fromSeo;

    if (post.bodyHtml) {
      const plain = post.bodyHtml
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (plain.length > 0) return plain;
    }

    return '';
  };

  return (
    <main className="bg-surface-main">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_#020617_95%)] py-16 text-surface-main">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80">
              Blog Yazıları
            </p>
            <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
              Blog Yazılarımız
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-surface-main/80 md:text-base">
              Almanya&apos;ya taşınma sürecinden günlük yaşama, kültürel
              farklılıklardan yasal düzenlemelere kadar pek çok konuda rehber
              blog yazıları hazırlıyoruz.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Liste */}
      <section className="bg-surface-soft py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post, index) => {
              const excerptSource = getExcerpt(post);
              const excerpt =
                excerptSource.length > 160
                  ? `${excerptSource.slice(0, 157)}...`
                  : excerptSource;

              return (
                <RevealOnScroll key={post.slug} delay={index * 0.04}>
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface-main shadow-soft">
                    {post.image && (
                      <div className="relative h-44 w-full">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-base font-semibold text-brand-dark line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {post.date && (
                        <p className="mt-2 text-xs text-slate-500">
                          {post.date}
                        </p>
                      )}
                      {excerpt && (
                        <p className="mt-3 text-xs leading-relaxed text-slate-700 md:text-sm line-clamp-5">
                          {excerpt}
                        </p>
                      )}
                      <div className="mt-4">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs font-semibold text-brand-base hover:text-brand-light"
                        >
                          Devamını Oku
                        </Link>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

