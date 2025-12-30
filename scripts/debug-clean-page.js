// Quick debug utility to inspect how cleanPageHtml behaves for a given slug.
// Usage: node scripts/debug-clean-page.js kvkk

const fs = require('fs');
const path = require('path');

function cleanPageHtml(html) {
  if (!html) return html;

  let working = html;

  const mainIndex = working.indexOf('<main');
  if (mainIndex !== -1) {
    const mainOpenEnd = working.indexOf('>', mainIndex);
    const mainCloseIndex = working.lastIndexOf('</main>');

    if (
      mainOpenEnd !== -1 &&
      mainCloseIndex !== -1 &&
      mainCloseIndex > mainOpenEnd
    ) {
      working = working.slice(mainOpenEnd + 1, mainCloseIndex);
    }
  }

  working = working
    .replace(/<section[^>]*id=["']topbar["'][\s\S]*?<\/section>/gi, '')
    .replace(/<header[^>]*id=["']header["'][\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*id=["']footer["'][\s\S]*?<\/footer>/gi, '')
    .replace(/<div[^>]*id=["']preloader["'][\s\S]*?<\/div>/gi, '')
    .replace(/<a[^>]*class=["'][^"']*back-to-top[^"']*["'][\s\S]*?<\/a>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');

  return working.trim();
}

function main() {
  const slug = process.argv[2] || 'kvkk';
  const file = path.join(process.cwd(), 'content', 'pages', `${slug}.json`);
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = JSON.parse(raw);

  const originalLen = parsed.bodyHtml.length;
  const cleaned = cleanPageHtml(parsed.bodyHtml);

  console.log('Slug:', slug);
  console.log('Original length:', originalLen);
  console.log('Cleaned length:', cleaned.length);
  console.log('\n=== Cleaned preview ===\n');
  console.log(cleaned.slice(0, 1200));
}

main();

