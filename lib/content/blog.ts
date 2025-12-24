import fs from 'node:fs';
import path from 'node:path';

export type BlogPost = {
  type: 'blog';
  id: string;
  slug: string;
  title: string;
  date: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  canonical: string;
  source: string;
  image?: string;
  bodyHtml: string;
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getBlogSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''));
}

export function getBlogPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(BLOG_DIR, `${slug}.json`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const data = JSON.parse(raw) as BlogPost;
  return data;
}

export function getAllBlogPosts(): BlogPost[] {
  return getBlogSlugs()
    .map(getBlogPostBySlug)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

