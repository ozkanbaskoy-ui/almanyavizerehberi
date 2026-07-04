import fs from 'fs';
import path from 'path';

import type { SocialAutomationSnapshot } from '@/lib/marketing/socialAutomation';

const GENERATED_DIR = path.join(process.cwd(), 'content', 'generated');

export const SOCIAL_AUTOMATION_SNAPSHOT_PATH = path.join(
  GENERATED_DIR,
  'social-automation.json',
);

function ensureGeneratedDir() {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
}

export function readSocialAutomationSnapshot():
  | SocialAutomationSnapshot
  | null {
  try {
    if (!fs.existsSync(SOCIAL_AUTOMATION_SNAPSHOT_PATH)) {
      return null;
    }

    const raw = fs.readFileSync(SOCIAL_AUTOMATION_SNAPSHOT_PATH, 'utf8');
    return JSON.parse(raw) as SocialAutomationSnapshot;
  } catch {
    return null;
  }
}

export function writeSocialAutomationSnapshot(
  snapshot: SocialAutomationSnapshot,
) {
  ensureGeneratedDir();
  fs.writeFileSync(
    SOCIAL_AUTOMATION_SNAPSHOT_PATH,
    JSON.stringify(snapshot, null, 2),
    'utf8',
  );
}
