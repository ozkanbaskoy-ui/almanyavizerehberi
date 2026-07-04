import fs from 'fs';
import path from 'path';

import type { SocialChannel } from '@/lib/marketing/socialAutomation';

const GENERATED_DIR = path.join(process.cwd(), 'content', 'generated');

export const SOCIAL_PUBLISH_STATE_PATH = path.join(
  GENERATED_DIR,
  'social-publish-state.json',
);

export type SocialPublishStatus =
  | 'published'
  | 'drafted'
  | 'skipped'
  | 'failed';

export type SocialPublishDraft = {
  title: string;
  copy: string;
  imageUrl: string;
  leadUrl: string;
  topicUrl: string;
};

export type SocialPublishResult = {
  channel: SocialChannel;
  label: string;
  provider: string;
  status: SocialPublishStatus;
  message: string;
  remoteId?: string | null;
  remoteUrl?: string | null;
  draft?: SocialPublishDraft;
};

export type SocialPublishState = {
  executionMode: 'auto' | 'dry-run';
  runDateKey: string;
  generatedAt: string;
  publishedAt: string;
  campaignId: string;
  campaignSlug: string;
  campaignTitle: string;
  campaignKeyword: string;
  leadUrl: string;
  topicUrl: string;
  socialCardUrl: string;
  channels: SocialChannel[];
  results: SocialPublishResult[];
  notes: string[];
};

function ensureGeneratedDir() {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
}

export function readSocialPublishState():
  | SocialPublishState
  | null {
  try {
    if (!fs.existsSync(SOCIAL_PUBLISH_STATE_PATH)) {
      return null;
    }

    const raw = fs.readFileSync(SOCIAL_PUBLISH_STATE_PATH, 'utf8');
    return JSON.parse(raw) as SocialPublishState;
  } catch {
    return null;
  }
}

export function writeSocialPublishState(
  state: SocialPublishState,
) {
  ensureGeneratedDir();
  fs.writeFileSync(
    SOCIAL_PUBLISH_STATE_PATH,
    JSON.stringify(state, null, 2),
    'utf8',
  );
}
