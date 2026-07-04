import { getMarketingTopicCatalog } from '../lib/marketing/topicCatalog';
import {
  buildSocialAutomationSnapshot,
  type SocialAutomationSnapshot,
} from '../lib/marketing/socialAutomation';
import {
  readSocialAutomationSnapshot,
  writeSocialAutomationSnapshot,
} from '../lib/marketing/socialAutomationStore';
import {
  publishSocialAutomation,
} from '../lib/marketing/socialPublishing';
import type { SocialPublishState } from '../lib/marketing/socialPublishStore';

function parseBoolean(value: string | undefined) {
  return value === 'true' || value === '1';
}

function summarizeResult(state: SocialPublishState) {
  const published = state.results.filter(
    (result) => result.status === 'published',
  ).length;
  const drafted = state.results.filter(
    (result) => result.status === 'drafted',
  ).length;
  const skipped = state.results.filter(
    (result) => result.status === 'skipped',
  ).length;
  const failed = state.results.filter(
    (result) => result.status === 'failed',
  ).length;

  return [
    `Run key: ${state.runDateKey}`,
    `Campaign: ${state.campaignTitle}`,
    `Published: ${published}`,
    `Drafted: ${drafted}`,
    `Skipped: ${skipped}`,
    `Failed: ${failed}`,
  ].join('\n');
}

async function ensureSnapshot(): Promise<SocialAutomationSnapshot> {
  const existing = readSocialAutomationSnapshot();
  if (existing) {
    return existing;
  }

  const topics = getMarketingTopicCatalog();
  const snapshot = buildSocialAutomationSnapshot(topics);
  writeSocialAutomationSnapshot(snapshot);
  return snapshot;
}

async function main() {
  const snapshot = await ensureSnapshot();
  const state = await publishSocialAutomation(snapshot, {
    dryRun: parseBoolean(process.env.SOCIAL_DRY_RUN),
    force: parseBoolean(process.env.SOCIAL_FORCE_PUBLISH),
  });

  console.log(summarizeResult(state));

  for (const result of state.results) {
    const draftSuffix = result.draft ? ' [draft]' : '';
    const remoteSuffix = result.remoteId ? ` (${result.remoteId})` : '';
    console.log(
      `${result.label} - ${result.status} - ${result.provider}${remoteSuffix}${draftSuffix}: ${result.message}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
