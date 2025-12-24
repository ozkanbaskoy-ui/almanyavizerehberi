import fs from 'node:fs';
import path from 'node:path';

export type VisaContent = {
  type: 'visa';
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

const VISAS_DIR = path.join(process.cwd(), 'content', 'visas');

export function getVisaSlugs(): string[] {
  return fs
    .readdirSync(VISAS_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''));
}

export function getVisaBySlug(slug: string | undefined): VisaContent {
  if (!slug) {
    throw new Error('getVisaBySlug: slug is required');
  }
  const fullPath = path.join(VISAS_DIR, `${slug}.json`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const data = JSON.parse(raw) as VisaContent;
  return data;
}

export function getAllVisas(): VisaContent[] {
  return getVisaSlugs().map(getVisaBySlug);
}
