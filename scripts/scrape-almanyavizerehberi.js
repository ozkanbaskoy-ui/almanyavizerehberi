const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.almanyavizerehberi.com';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const VISAS_DIR = path.join(CONTENT_DIR, 'visas');
const SERVICES_DIR = path.join(CONTENT_DIR, 'services');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const FAQ_DIR = path.join(CONTENT_DIR, 'faq');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(VISAS_DIR);
ensureDir(SERVICES_DIR);
ensureDir(BLOG_DIR);
ensureDir(FAQ_DIR);
ensureDir(PAGES_DIR);

async function fetchHtml(relativePath) {
  const url = relativePath.startsWith('http')
    ? relativePath
    : `${BASE_URL}${relativePath}`;
  console.log('GET', url);
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

// Hizmetler (vize türleri)
const VISA_PAGES = [
  { l: 1, slug: 'calisma-vizesi' },
  { l: 2, slug: 'mavi-kart-vizesi' },
  { l: 3, slug: 'firsat-karti' },
  { l: 5, slug: 'mesleki-egitim-vizesi' },
  { l: 7, slug: 'aile-birlesimi-vizesi' },
  { l: 9, slug: 'yuksekogrenim-vizesi' },
  { l: 10, slug: 'dil-kursu-vizesi' },
];

async function scrapeVisas() {
  for (const v of VISA_PAGES) {
    const html = await fetchHtml(`/hizmetler.php?l=${v.l}`);
    const $ = cheerio.load(html);
    const meta = getMeta($);

    const container = $('.portfolio-description').first();
    const title =
      container.find('h2').first().text().trim() ||
      meta.title ||
      v.slug;
    const bodyHtml = container.html()?.trim() || '';

    const out = {
      type: 'visa',
      id: v.slug,
      slug: v.slug,
      title,
      seoTitle: meta.title,
      seoDescription: meta.description,
      keywords: meta.keywords,
      canonical: meta.canonical,
      source: `/hizmetler.php?l=${v.l}`,
      bodyHtml,
    };

    const filePath = path.join(VISAS_DIR, `${v.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote', filePath);
  }
}

// Göç sonrası hizmetler
const SERVICE_PAGES = [
  { l: 1, slug: 'oturum-izni-basvurusu-ve-yenilenmesi' },
  { l: 2, slug: 'yabancilar-dairesi-islemleri' },
  { l: 3, slug: 'calisma-izni' },
  { l: 4, slug: 'sigorta-ve-sosyal-guvenlik' },
  { l: 5, slug: 'vergi-islemleri' },
  { l: 6, slug: 'dil-egitimi-ve-entegrasyon-kurslari' },
  { l: 7, slug: 'barinma-ve-emlak-islemleri' },
  { l: 8, slug: 'egitim-ve-cocuklarin-egitimi' },
  { l: 9, slug: 'hukuki-danismanlik-ve-haklar' },
  { l: 10, slug: 'kulturel-ve-sosyal-rehberlik' },
];

async function scrapeServices() {
  for (const s of SERVICE_PAGES) {
    const html = await fetchHtml(`/servisler.php?l=${s.l}`);
    const $ = cheerio.load(html);
    const meta = getMeta($);

    const container = $('.portfolio-description').first();
    const title =
      container.find('h2').first().text().trim() ||
      meta.title ||
      s.slug;
    const bodyHtml = container.html()?.trim() || '';

    const out = {
      type: 'service',
      id: s.slug,
      slug: s.slug,
      title,
      seoTitle: meta.title,
      seoDescription: meta.description,
      keywords: meta.keywords,
      canonical: meta.canonical,
      source: `/servisler.php?l=${s.l}`,
      bodyHtml,
    };

    const filePath = path.join(SERVICES_DIR, `${s.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote', filePath);
  }
}

// Blog yazıları (blog.php + blog-yazi.php?l=...)
async function scrapeBlog() {
  const listHtml = await fetchHtml('/blog.php');
  const $list = cheerio.load(listHtml);
  const entries = [];

  $list('a[href*="blog-yazi.php?l="]').each((_, el) => {
    const href = $list(el).attr('href') || '';
    const match = href.match(/blog-yazi\.php\?l=(\d+)/);
    if (match) {
      const l = match[1];
      if (!entries.find((e) => e.l === l)) {
        entries.push({ l, href });
      }
    }
  });

  console.log('Blog entries found:', entries);

  for (const item of entries) {
    const html = await fetchHtml(
      '/' + item.href.replace(/^\//, '')
    );
    const $ = cheerio.load(html);
    const meta = getMeta($);

    const article = $('article.entry').first();
    const title =
      article.find('.entry-title').first().text().trim() ||
      meta.title ||
      `blog-${item.l}`;
    const date =
      article.find('.entry-meta time').attr('datetime') ||
      article.find('time').attr('datetime') ||
      '';
    const image =
      article.find('.entry-img img').attr('src') || '';
    const bodyHtml =
      article.find('.entry-content').html()?.trim() || '';

    const slug = `blog-${item.l}`;

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
      source: `/blog-yazi.php?l=${item.l}`,
      image,
      bodyHtml,
    };

    const filePath = path.join(BLOG_DIR, `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote', filePath);
  }
}

// S.S.S. -> FAQ JSON (question + answer)
async function scrapeFaq() {
  const html = await fetchHtml('/sss.php');
  const $ = cheerio.load(html);
  const items = [];

  $('.faq-list li').each((index, el) => {
    const q = $(el)
      .find('a[data-bs-toggle="collapse"]')
      .first()
      .text()
      .trim();
    const a = $(el).find('p').first().text().trim();

    if (q && a) {
      items.push({
        id: `faq-${index + 1}`,
        question: q,
        answer: a,
      });
    }
  });

  const outPath = path.join(FAQ_DIR, 'faq.json');
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf8');
  console.log('Wrote', outPath);
}

// Diğer statik sayfalar (tam body içeriğini saklıyoruz)
const STATIC_PAGES = [
  { path: '/', slug: 'index' },
  { path: '/hakkimizda.php', slug: 'hakkimizda' },
  { path: '/iletisim.php', slug: 'iletisim' },
  { path: '/basvuru.php', slug: 'basvuru' },
  { path: '/cerezler.php', slug: 'cerezler' },
  { path: '/kullanim-sartlari.php', slug: 'kullanim-sartlari' },
  { path: '/kvkk.php', slug: 'kvkk' },
  { path: '/sorumluluk-reddi.php', slug: 'sorumluluk-reddi' },
  { path: '/gdpr.php', slug: 'gdpr' },
];

async function scrapeStaticPages() {
  for (const p of STATIC_PAGES) {
    const html = await fetchHtml(p.path);
    const $ = cheerio.load(html);
    const meta = getMeta($);

    const h1 = $('h1').first().text().trim();
    const bodyHtml = $('body').html()?.trim() || '';

    const out = {
      type: 'page',
      id: p.slug,
      slug: p.slug,
      title: h1 || meta.title || p.slug,
      seoTitle: meta.title,
      seoDescription: meta.description,
      keywords: meta.keywords,
      canonical: meta.canonical,
      source: p.path || '/',
      bodyHtml,
    };

    const filePath = path.join(PAGES_DIR, `${p.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote', filePath);
  }
}

async function main() {
  try {
    await scrapeVisas();
    await scrapeServices();
    await scrapeBlog();
    await scrapeFaq();
    await scrapeStaticPages();
    console.log('Scraping finished.');
  } catch (err) {
    console.error('Scraping error:', err);
    process.exit(1);
  }
}

main();

