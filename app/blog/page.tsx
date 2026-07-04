import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { getAllBlogPosts } from '@/lib/content/blog';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Blog Yazıları - Almanya Vize Rehberi',
  description:
    "Almanya Vize Rehberi olarak Almanya'ya göç, çalışma, eğitim ve Almanya'da günlük yaşamla ilgili güncel blog yazıları paylaşıyoruz.",
  alternates: {
    canonical: 'https://www.almanyavizerehberi.com/blog',
  },
  openGraph: {
    type: 'website',
    title: 'Blog Yazıları - Almanya Vize Rehberi',
    description:
      "Almanya Vize Rehberi olarak Almanya'ya göç, çalışma, eğitim ve Almanya'da günlük yaşamla ilgili güncel blog yazıları paylaşıyoruz.",
    url: 'https://www.almanyavizerehberi.com/blog',
    images: [{ url: '/og/default-og.webp', width: 1200, height: 630, alt: 'Blog Yazıları' }],
  },
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
      <section className="site-hero">
        <div className="site-container">
          <RevealOnScroll>
            <p className="eyebrow-on-dark">
              Blog Yazıları
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
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
        <div className="site-container">
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post, index) => {
              const excerptSource = getExcerpt(post);
              const excerpt =
                excerptSource.length > 160
                  ? `${excerptSource.slice(0, 157)}...`
                  : excerptSource;

              return (
                <RevealOnScroll key={post.slug} delay={index * 0.04}>
                  <article className="interactive-panel group flex h-full flex-col overflow-hidden">
                    {post.image && (
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
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
