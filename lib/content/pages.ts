import fs from 'node:fs';
import path from 'node:path';

export type PageContent = {
  type: 'page';
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  canonical: string;
  source: string;
  bodyHtml: string;
};

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

// Removes layout chrome (topbar, header, footer, scripts, etc.)
// and keeps only the main page content from the legacy HTML.
function cleanPageHtml(html: string): string {
  if (!html) return html;

  let working = html;

  // If there is a <main> block, keep only its inner HTML.
  const mainIndex = working.indexOf('<main');
  if (mainIndex !== -1) {
    const mainOpenEnd = working.indexOf('>', mainIndex);
    const mainCloseIndex = working.lastIndexOf('</main>');

    if (mainOpenEnd !== -1 && mainCloseIndex !== -1 && mainCloseIndex > mainOpenEnd) {
      // Slice out everything between <main ...> and </main>
      working = working.slice(mainOpenEnd + 1, mainCloseIndex);
    }
  }

  // Defensive cleanup: strip any remaining site chrome blocks if present.
  working = working
    // Top bar with email/phone.
    .replace(/<section[^>]*id=["']topbar["'][\s\S]*?<\/section>/gi, '')
    // Legacy header/nav.
    .replace(/<header[^>]*id=["']header["'][\s\S]*?<\/header>/gi, '')
    // Legacy footer.
    .replace(/<footer[^>]*id=["']footer["'][\s\S]*?<\/footer>/gi, '')
    // Preloader + back-to-top button.
    .replace(/<div[^>]*id=["']preloader["'][\s\S]*?<\/div>/gi, '')
    .replace(/<a[^>]*class=["'][^"']*back-to-top[^"']*["'][\s\S]*?<\/a>/gi, '')
    // Any legacy scripts from the old theme.
    .replace(/<script[\s\S]*?<\/script>/gi, '');

  return working.trim();
}

export function getPageBySlug(slug: string): PageContent {
  const fullPath = path.join(PAGES_DIR, `${slug}.json`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const parsed = JSON.parse(raw) as PageContent;

  return {
    ...parsed,
    bodyHtml: cleanPageHtml(parsed.bodyHtml),
  };
}
