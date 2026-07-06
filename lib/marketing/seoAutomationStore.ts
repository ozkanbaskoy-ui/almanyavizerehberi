import fs from 'node:fs';
import path from 'node:path';

import type { SeoAutomationSnapshot } from '@/lib/marketing/seoAutomation';

const GENERATED_DIR = path.join(process.cwd(), 'content', 'generated');

export const SEO_AUTOMATION_SNAPSHOT_PATH = path.join(
  GENERATED_DIR,
  'seo-automation.json',
);

function ensureGeneratedDir() {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
}

export function readSeoAutomationSnapshot():
  | SeoAutomationSnapshot
  | null {
  try {
    if (!fs.existsSync(SEO_AUTOMATION_SNAPSHOT_PATH)) {
      return null;
    }

    const raw = fs.readFileSync(SEO_AUTOMATION_SNAPSHOT_PATH, 'utf8');
    return JSON.parse(raw) as SeoAutomationSnapshot;
  } catch {
    return null;
  }
}

export function writeSeoAutomationSnapshot(
  snapshot: SeoAutomationSnapshot,
) {
  ensureGeneratedDir();
  fs.writeFileSync(
    SEO_AUTOMATION_SNAPSHOT_PATH,
    JSON.stringify(snapshot, null, 2),
    'utf8',
  );
}
