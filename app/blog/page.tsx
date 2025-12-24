import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  title: 'Blog Yazılarımız',
  description:
    "Almanya'ya göç, eğitim ve çalışma hayatı hakkında güncel blog yazıları.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold text-slate-900">
        Blog Yazılarımız
      </h1>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            {post.image && (
              <div className="relative h-40 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              <h2 className="text-sm font-semibold text-slate-900">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.date && (
                <p className="mt-1 text-xs text-slate-500">
                  {post.date}
                </p>
              )}
              <div className="mt-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-brand-red hover:text-brand-coral"
                >
                  Devamını Oku
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

