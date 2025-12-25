const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.almanyavizerehberi.com';
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

async function fetchHtml(relativePath) {
  const url = relativePath.startsWith('http')
    ? relativePath
    : `${BASE_URL}${relativePath}`;
  const res = await axios.get(url, { responseType: 'text' });
  return res.data;
}

function getMeta($) {
  const title = $('title').first().text().trim();
  const description =
    $('meta[name="description"]').attr('content')?.trim() || '';
  const keywords =
    $('meta[name="keywords"]').attr('content')?.trim() || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  return { title, description, keywords, canonical };
}

async function scrapeSingleBlog(l) {
  const html = await fetchHtml(`/blog-yazi.php?l=${l}`);
  const $ = cheerio.load(html);
  const meta = getMeta($);

  const article = $('article.entry').first();
  const title =
    article.find('.entry-title').first().text().trim() ||
    meta.title ||
    `blog-${l}`;
  const date =
    article.find('.entry-meta time').attr('datetime') ||
    article.find('time').attr('datetime') ||
    '';
  const image = article.find('.entry-img img').attr('src') || '';
  const bodyHtml =
    article.find('.entry-content').html()?.trim() || '';

  const slug = `blog-${l}`;

  const out = {
    type: 'blog',
    id: slug,
    slug,
    title,
    date,
    seoTitle: meta.title,
    seoDescription: meta.description,
    keywords: meta.keywords,
    canonical: meta.canonical,
    source: `/blog-yazi.php?l=${l}`,
    image,
    bodyHtml,
  };

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', filePath);
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/scrape-single-blog.js <l>');
    process.exit(1);
  }

  const l = String(arg).trim();
  try {
    await scrapeSingleBlog(l);
  } catch (err) {
    console.error('Error while scraping blog post', l, err);
    process.exit(1);
  }
}

main();

