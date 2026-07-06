import { NextResponse } from 'next/server';

import { getMarketingTopicCatalog } from '@/lib/marketing/topicCatalog';
import {
  buildSocialAutomationSnapshot,
} from '@/lib/marketing/socialAutomation';
import { writeSocialAutomationSnapshot } from '@/lib/marketing/socialAutomationStore';
import {
  buildSeoAutomationSnapshot,
} from '@/lib/marketing/seoAutomation';
import { writeSeoAutomationSnapshot } from '@/lib/marketing/seoAutomationStore';
import { publishSocialAutomation } from '@/lib/marketing/socialPublishing';

export const runtime = 'nodejs';

const CRON_SECRET = process.env.CRON_SECRET?.trim();

function isAuthorized(request: Request) {
  if (process.env.NODE_ENV !== 'production' && !CRON_SECRET) {
    return true;
  }

  if (!CRON_SECRET) {
    return false;
  }

  const authorization = request.headers.get('authorization')?.trim();
  return authorization === `Bearer ${CRON_SECRET}`;
}

function buildSummary({
  topicCount,
  publishMode,
  publishedCount,
  draftedCount,
  skippedCount,
}: {
  topicCount: number;
  publishMode: 'auto' | 'draft';
  publishedCount: number;
  draftedCount: number;
  skippedCount: number;
}) {
  return [
    `Topics: ${topicCount}`,
    `Mode: ${publishMode}`,
    `Published: ${publishedCount}`,
    `Drafted: ${draftedCount}`,
    `Skipped: ${skippedCount}`,
  ].join('\n');
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Yetkisiz cron isteği.' },
      { status: 401 },
    );
  }

  try {
    const topics = getMarketingTopicCatalog();
    const socialSnapshot = buildSocialAutomationSnapshot(topics);
    const seoSnapshot = buildSeoAutomationSnapshot(topics);

    writeSocialAutomationSnapshot(socialSnapshot);
    writeSeoAutomationSnapshot(seoSnapshot);

    const autoPublish = process.env.SOCIAL_AUTO_PUBLISH === 'true';
    const publishState = await publishSocialAutomation(socialSnapshot, {
      dryRun: !autoPublish,
      force: false,
    });

    const publishedCount = publishState.results.filter(
      (result) => result.status === 'published',
    ).length;
    const draftedCount = publishState.results.filter(
      (result) => result.status === 'drafted',
    ).length;
    const skippedCount = publishState.results.filter(
      (result) => result.status === 'skipped',
    ).length;

    return NextResponse.json({
      ok: true,
      generatedAt: socialSnapshot.generatedAt,
      seoGeneratedAt: seoSnapshot.generatedAt,
      topicCount: topics.length,
      publishMode: autoPublish ? 'auto' : 'draft',
      publishedCount,
      draftedCount,
      skippedCount,
      summary: buildSummary({
        topicCount: topics.length,
        publishMode: autoPublish ? 'auto' : 'draft',
        publishedCount,
        draftedCount,
        skippedCount,
      }),
      seo: {
        pillars: seoSnapshot.primaryPillars.length,
        briefs: seoSnapshot.topicBriefs.length,
        links: seoSnapshot.linkSuggestions.length,
      },
      social: {
        campaigns: socialSnapshot.campaigns.length,
        rotation: socialSnapshot.rotationPlan.length,
        seoIdeas: socialSnapshot.seoQueue.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Marketing cron çalıştırılamadı.',
      },
      { status: 500 },
    );
  }
}
