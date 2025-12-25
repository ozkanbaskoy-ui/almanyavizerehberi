import fs from 'fs';
import path from 'path';

const VISAS_DIR = path.join(process.cwd(), 'content', 'visas');

export type Visa = {
  type: 'visa';
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords?: string;
  canonical?: string;
  source?: string;
  bodyHtml: string;
};

export type VisaEditableFields = {
  title: string;
  seoTitle: string;
  seoDescription: string;
  bodyHtml: string;
};

export function getVisaBySlug(slug: string): Visa {
  const filePath = path.join(VISAS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Visa not found for slug: ${slug}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw) as Visa;
  return parsed;
}

export function getAllVisas(): Visa[] {
  if (!fs.existsSync(VISAS_DIR)) return [];
  const files = fs
    .readdirSync(VISAS_DIR)
    .filter((f) => f.endsWith('.json'));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(VISAS_DIR, file), 'utf8');
    return JSON.parse(raw) as Visa;
  });
}

export function saveVisaBySlug(slug: string, fields: VisaEditableFields) {
  const filePath = path.join(VISAS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Visa not found for slug: ${slug}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const current = JSON.parse(raw) as Visa;

  const next: Visa = {
    ...current,
    title: fields.title,
    seoTitle: fields.seoTitle,
    seoDescription: fields.seoDescription,
    bodyHtml: fields.bodyHtml,
  };

  fs.writeFileSync(filePath, JSON.stringify(next, null, 2), 'utf8');
}

