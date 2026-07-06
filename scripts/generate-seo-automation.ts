import { getMarketingTopicCatalog } from '../lib/marketing/topicCatalog';
import { buildSeoAutomationSnapshot } from '../lib/marketing/seoAutomation';
import { writeSeoAutomationSnapshot } from '../lib/marketing/seoAutomationStore';

function parseInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function main() {
  const topics = getMarketingTopicCatalog();
  if (topics.length === 0) {
    throw new Error('SEO otomasyonu için uygun konu bulunamadı.');
  }

  const snapshot = buildSeoAutomationSnapshot(topics, {
    topicCount: parseInteger(process.env.SEO_TOPIC_COUNT, 6),
  });

  writeSeoAutomationSnapshot(snapshot);

  console.log(
    [
      'SEO automation snapshot generated.',
      `Generated at: ${snapshot.generatedAt}`,
      `Pillars: ${snapshot.primaryPillars.length}`,
      `Topic briefs: ${snapshot.topicBriefs.length}`,
      `Link suggestions: ${snapshot.linkSuggestions.length}`,
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
