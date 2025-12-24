import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/content/blog';
import { buildMetadata } from '@/lib/seo/metadata';

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  if (!params?.slug) {
    return {
      title: 'Blog Yazısı | Almanya Vize Rehberi',
      description:
        "Almanya'ya göç, eğitim ve çalışma hayatı hakkında blog yazıları.",
    };
  }
  const post = getBlogPostBySlug(params.slug);
  const ogImage =
    post.image && post.image.startsWith('http')
      ? post.image
      : undefined;

  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || '',
    path: `/blog/${post.slug}`,
    ogImage,
  });
}

export default function BlogPostPage({ params }: { params: Params }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold text-slate-900">
        {post.title}
      </h1>
      {post.date && (
        <p className="mt-2 text-xs text-slate-500">{post.date}</p>
      )}
      {post.image && (
        <div className="relative mt-6 h-64 w-full overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <article
        className="prose prose-slate mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      />
    </section>
  );
}
