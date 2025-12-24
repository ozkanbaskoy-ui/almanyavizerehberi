import fs from 'node:fs';
import path from 'node:path';

export type ServiceContent = {
  type: 'service';
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

const SERVICES_DIR = path.join(process.cwd(), 'content', 'services');

export function getServiceSlugs(): string[] {
  return fs
    .readdirSync(SERVICES_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''));
}

export function getServiceBySlug(slug: string): ServiceContent {
  const fullPath = path.join(SERVICES_DIR, `${slug}.json`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const data = JSON.parse(raw) as ServiceContent;
  return data;
}

export function getAllServices(): ServiceContent[] {
  return getServiceSlugs().map(getServiceBySlug);
}
