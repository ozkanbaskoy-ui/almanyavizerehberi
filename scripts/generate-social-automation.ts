import {
  SOCIAL_CHANNEL_OPTIONS,
  type SocialChannel,
  type SocialTone,
  buildSocialAutomationSnapshot,
} from '../lib/marketing/socialAutomation';
import { getMarketingTopicCatalog } from '../lib/marketing/topicCatalog';
import { writeSocialAutomationSnapshot } from '../lib/marketing/socialAutomationStore';

function parseTone(value: string | undefined): SocialTone {
  if (value === 'kurumsal' || value === 'samimi' || value === 'donusum') {
    return value;
  }
  return 'donusum';
}

function parseInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseChannels(value: string | undefined): SocialChannel[] | undefined {
  if (!value?.trim()) return undefined;

  const allowed = new Set(
    SOCIAL_CHANNEL_OPTIONS.map((option) => option.id),
  );

  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item): item is SocialChannel => allowed.has(item as SocialChannel));

  return parsed.length > 0 ? parsed : undefined;
}

async function main() {
  const topics = getMarketingTopicCatalog();
  if (topics.length === 0) {
    throw new Error('Otomasyon için uygun konu bulunamadı.');
  }

  const tone = parseTone(process.env.SOCIAL_TONE);
  const channels =
    parseChannels(process.env.SOCIAL_CHANNELS) ||
    SOCIAL_CHANNEL_OPTIONS.filter((option) => option.defaultSelected).map(
      (option) => option.id,
    );
  const leadPath = process.env.SOCIAL_LEAD_PATH || '/uygunluk-testi';

  const snapshot = buildSocialAutomationSnapshot(topics, {
    tone,
    channels,
    leadPath,
    campaignCount: parseInteger(process.env.SOCIAL_CAMPAIGN_COUNT, topics.length),
    rotationCount: parseInteger(process.env.SOCIAL_ROTATION_COUNT, 14),
    distributionCount: parseInteger(
      process.env.SOCIAL_DISTRIBUTION_COUNT,
      14,
    ),
    seoCount: parseInteger(process.env.SOCIAL_SEO_COUNT, 5),
  });

  writeSocialAutomationSnapshot(snapshot);

  console.log(
    [
      'Social automation snapshot generated.',
      `Generated at: ${snapshot.generatedAt}`,
      `Campaigns: ${snapshot.campaigns.length}`,
      `Rotation items: ${snapshot.rotationPlan.length}`,
      `Distribution queue: ${snapshot.distributionQueue.length}`,
      `SEO ideas: ${snapshot.seoQueue.length}`,
      `Lead path: ${snapshot.leadPath}`,
      `Channels: ${snapshot.channels.join(', ')}`,
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
