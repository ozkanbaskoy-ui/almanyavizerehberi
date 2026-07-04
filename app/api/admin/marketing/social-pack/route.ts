import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getMarketingTopicCatalog } from '@/lib/marketing/topicCatalog';
import {
  buildRotationPlan,
  buildSocialCampaign,
  SOCIAL_CHANNEL_OPTIONS,
  SOCIAL_TONE_OPTIONS,
  type SocialChannel,
  type SocialTone,
} from '@/lib/marketing/socialAutomation';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

type Body = {
  topicId?: string;
  tone?: SocialTone;
  channels?: SocialChannel[];
  leadPath?: string;
};

async function ensureAdminSession() {
  if (!ADMIN_PASSWORD) return true;

  const cookieStore = await cookies();
  const session = cookieStore.get('admin_logged_in')?.value;
  return session === '1';
}

export async function GET() {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  return NextResponse.json({
    topics: getMarketingTopicCatalog(),
    channels: SOCIAL_CHANNEL_OPTIONS,
    tones: SOCIAL_TONE_OPTIONS,
  });
}

export async function POST(request: Request) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    const topics = getMarketingTopicCatalog();
    const selectedTopic =
      topics.find((topic) => topic.id === body.topicId) || topics[0];

    if (!selectedTopic) {
      return NextResponse.json(
        { error: 'Paket üretmek için uygun bir konu bulunamadı.' },
        { status: 400 },
      );
    }

    const channels =
      body.channels && body.channels.length > 0
        ? body.channels
        : SOCIAL_CHANNEL_OPTIONS.filter((option) => option.defaultSelected).map(
            (option) => option.id,
          );

    const campaign = buildSocialCampaign(selectedTopic, {
      tone: body.tone || 'donusum',
      channels,
      leadPath: body.leadPath,
    });
    const rotationPlan = buildRotationPlan(topics, {
      tone: body.tone || 'donusum',
      channels,
      count: 8,
      topicCount: Math.min(4, topics.length),
    });

    return NextResponse.json({
      ok: true,
      campaign,
      rotationPlan,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Sosyal paket oluşturulamadı.',
      },
      { status: 500 },
    );
  }
}
