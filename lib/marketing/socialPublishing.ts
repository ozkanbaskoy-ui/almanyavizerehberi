import {
  SOCIAL_CHANNEL_OPTIONS,
  buildSocialCardUrl,
  truncateToWordBoundary,
  type SocialAutomationSnapshot,
  type SocialChannel,
} from '@/lib/marketing/socialAutomation';
import {
  readSocialPublishState,
  writeSocialPublishState,
  type SocialPublishDraft,
  type SocialPublishResult,
  type SocialPublishState,
} from '@/lib/marketing/socialPublishStore';
type PublishOptions = {
  runAt?: Date;
  channels?: SocialChannel[];
  force?: boolean;
  dryRun?: boolean;
};

type PublishContext = {
  campaign: SocialAutomationSnapshot['campaigns'][number];
  channel: SocialChannel;
  copy: string;
  label: string;
  leadUrl: string;
  topicUrl: string;
  imageUrl: string;
};

type PublisherOutcome = {
  status: 'published' | 'skipped';
  provider: string;
  message: string;
  remoteId?: string | null;
  remoteUrl?: string | null;
};

function buildDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function selectCampaign(
  snapshot: SocialAutomationSnapshot,
  runAt: Date,
) {
  if (snapshot.campaigns.length === 0) return null;
  const index = hashString(buildDateKey(runAt)) % snapshot.campaigns.length;
  return snapshot.campaigns[index];
}

function getChannelMeta(channel: SocialChannel) {
  return SOCIAL_CHANNEL_OPTIONS.find((option) => option.id === channel);
}

function getChannelLabel(channel: SocialChannel) {
  return getChannelMeta(channel)?.label || channel;
}

function buildDraft(context: PublishContext): SocialPublishDraft {
  return {
    title: context.campaign.topic.title,
    copy: context.copy,
    imageUrl: context.imageUrl,
    leadUrl: context.leadUrl,
    topicUrl: context.topicUrl,
  };
}

function buildPayloadText(context: PublishContext) {
  return context.copy.trim();
}

function finalizePublisherResult(
  context: PublishContext,
  result: {
    status: SocialPublishResult['status'];
    provider: string;
    message: string;
    remoteId?: string | null;
    remoteUrl?: string | null;
  },
): SocialPublishResult {
  return {
    channel: context.channel,
    label: context.label,
    provider: result.provider,
    status: result.status,
    message: result.message,
    remoteId: result.remoteId ?? null,
    remoteUrl: result.remoteUrl ?? null,
    draft: result.status === 'skipped' ? buildDraft(context) : undefined,
  };
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function requestJson(
  url: string,
  init: RequestInit,
  label: string,
) {
  const response = await fetch(url, init);
  const body = await parseResponse(response);

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          String((body as any).error?.message || (body as any).error || '')
        : typeof body === 'string'
          ? body
          : '';

    throw new Error(
      `${label} isteği başarısız oldu (${response.status})${
        message ? `: ${message}` : ''
      }`,
    );
  }

  return body;
}

function getSocialCardUrl(params: {
  title: string;
  keyword: string;
  channel: string;
}) {
  return buildSocialCardUrl({
    title: params.title,
    keyword: params.keyword,
    channel: params.channel,
    cta: 'Ön değerlendirme formunu doldurun',
  });
}

async function publishTelegram(
  context: PublishContext,
): Promise<PublisherOutcome> {
  const token = process.env.SOCIAL_TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.SOCIAL_TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    return {
      status: 'skipped' as const,
      provider: 'telegram',
      message: 'Telegram için bot token veya chat id eksik.',
    };
  }

  const caption = truncateToWordBoundary(buildPayloadText(context), 900);
  const body = new URLSearchParams({
    chat_id: chatId,
    photo: context.imageUrl,
    caption,
  });

  const payload = await requestJson(
    `https://api.telegram.org/bot${token}/sendPhoto`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
    'Telegram',
  );

  const messageId =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload as any)?.result?.message_id ?? null;

  return {
    status: 'published' as const,
    provider: 'telegram',
    message: 'Telegram kanalına gönderildi.',
    remoteId: messageId ? String(messageId) : null,
  };
}

async function publishFacebook(
  context: PublishContext,
): Promise<PublisherOutcome> {
  const pageId =
    process.env.SOCIAL_FACEBOOK_PAGE_ID?.trim() ||
    process.env.SOCIAL_META_PAGE_ID?.trim();
  const accessToken =
    process.env.SOCIAL_META_ACCESS_TOKEN?.trim() ||
    process.env.SOCIAL_FACEBOOK_PAGE_ACCESS_TOKEN?.trim();

  if (!pageId || !accessToken) {
    return {
      status: 'skipped' as const,
      provider: 'facebook',
      message: 'Facebook için sayfa ID veya access token eksik.',
    };
  }

  const body = new URLSearchParams({
    url: context.imageUrl,
    caption: buildPayloadText(context),
    published: 'true',
    access_token: accessToken,
  });

  const payload = await requestJson(
    `https://graph.facebook.com/v21.0/${pageId}/photos`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
    'Facebook',
  );

  const remoteId =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload as any)?.id ?? null;

  return {
    status: 'published' as const,
    provider: 'facebook',
    message: 'Facebook sayfasına gönderildi.',
    remoteId: remoteId ? String(remoteId) : null,
  };
}

async function publishInstagram(
  context: PublishContext,
): Promise<PublisherOutcome> {
  const instagramUserId = process.env.SOCIAL_INSTAGRAM_USER_ID?.trim();
  const accessToken =
    process.env.SOCIAL_META_ACCESS_TOKEN?.trim() ||
    process.env.SOCIAL_INSTAGRAM_ACCESS_TOKEN?.trim();

  if (!instagramUserId || !accessToken) {
    return {
      status: 'skipped' as const,
      provider: 'instagram',
      message: 'Instagram için user id veya access token eksik.',
    };
  }

  const createBody = new URLSearchParams({
    image_url: context.imageUrl,
    caption: buildPayloadText(context),
    access_token: accessToken,
  });

  const createPayload = await requestJson(
    `https://graph.facebook.com/v21.0/${instagramUserId}/media`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createBody,
    },
    'Instagram medya oluşturma',
  );

  const creationId =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (createPayload as any)?.id || (createPayload as any)?.creation_id;

  if (!creationId) {
    throw new Error('Instagram medya konteyneri oluşturulamadı.');
  }

  const publishBody = new URLSearchParams({
    creation_id: String(creationId),
    access_token: accessToken,
  });

  const publishPayload = await requestJson(
    `https://graph.facebook.com/v21.0/${instagramUserId}/media_publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: publishBody,
    },
    'Instagram paylaşım yayınlama',
  );

  const remoteId =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (publishPayload as any)?.id ?? creationId;

  return {
    status: 'published' as const,
    provider: 'instagram',
    message: 'Instagram paylaşımı yayınlandı.',
    remoteId: remoteId ? String(remoteId) : null,
  };
}

async function publishLinkedIn(
  context: PublishContext,
): Promise<PublisherOutcome> {
  const accessToken = process.env.SOCIAL_LINKEDIN_ACCESS_TOKEN?.trim();
  const authorUrn = process.env.SOCIAL_LINKEDIN_AUTHOR_URN?.trim();

  if (!accessToken || !authorUrn) {
    return {
      status: 'skipped' as const,
      provider: 'linkedin',
      message: 'LinkedIn için access token veya author URN eksik.',
    };
  }

  const body = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: buildPayloadText(context),
        },
        shareMediaCategory: 'ARTICLE',
        media: [
          {
            status: 'READY',
            originalUrl: context.leadUrl,
            title: {
              text: context.campaign.topic.title,
            },
            description: {
              text: context.campaign.focusKeyword,
            },
          },
        ],
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const payload = await requestJson(
    'https://api.linkedin.com/v2/ugcPosts',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    'LinkedIn',
  );

  const remoteId =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload as any)?.id ?? null;

  return {
    status: 'published' as const,
    provider: 'linkedin',
    message: 'LinkedIn paylaşımı yayınlandı.',
    remoteId: remoteId ? String(remoteId) : null,
  };
}

async function publishX(context: PublishContext): Promise<PublisherOutcome> {
  const accessToken =
    process.env.SOCIAL_X_ACCESS_TOKEN?.trim() ||
    process.env.SOCIAL_X_BEARER_TOKEN?.trim();

  if (!accessToken) {
    return {
      status: 'skipped' as const,
      provider: 'x',
      message: 'X için access token eksik.',
    };
  }

  const body = {
    text: buildPayloadText(context),
  };

  const endpoints = [
    'https://api.x.com/2/tweets',
    'https://api.twitter.com/2/tweets',
  ];

  let lastError: Error | null = null;
  for (const endpoint of endpoints) {
    try {
      const payload = await requestJson(
        endpoint,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
        'X',
      );

      const remoteId =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload as any)?.data?.id ?? null;

      return {
        status: 'published' as const,
        provider: 'x',
        message: 'X paylaşımı yayınlandı.',
        remoteId: remoteId ? String(remoteId) : null,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('X paylaşımı başarısız oldu.');
    }
  }

  throw lastError || new Error('X paylaşımı yayınlanamadı.');
}

function buildDraftResult(
  context: PublishContext,
  provider: string,
  message: string,
): SocialPublishResult {
  return {
    channel: context.channel,
    label: context.label,
    provider,
    status: 'drafted',
    message,
    draft: buildDraft(context),
  };
}

async function publishContext(
  context: PublishContext,
  dryRun: boolean,
): Promise<SocialPublishResult> {
  if (
    context.channel === 'whatsapp_status' ||
    context.channel === 'tiktok' ||
    context.channel === 'youtube_shorts'
  ) {
    return buildDraftResult(
      context,
      'manual',
      'Bu kanal için doğrudan API yayını yok, otomatik draft üretildi.',
    );
  }

  if (dryRun) {
    return buildDraftResult(
      context,
      'dry-run',
      'Dry-run modunda içerik hazırlanıp yayın atlandı.',
    );
  }

  try {
    switch (context.channel) {
      case 'telegram': {
        const result = await publishTelegram(context);
        return finalizePublisherResult(context, result);
      }
      case 'facebook': {
        const result = await publishFacebook(context);
        return finalizePublisherResult(context, result);
      }
      case 'instagram': {
        const result = await publishInstagram(context);
        return finalizePublisherResult(context, result);
      }
      case 'linkedin': {
        const result = await publishLinkedIn(context);
        return finalizePublisherResult(context, result);
      }
      case 'x':
      default: {
        const result = await publishX(context);
        return finalizePublisherResult(context, result);
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Yayınlama sırasında hata oluştu.';
    return {
      channel: context.channel,
      label: context.label,
      provider: context.channel,
      status: 'failed',
      message,
      draft: buildDraft(context),
    };
  }
}

export async function publishSocialAutomation(
  snapshot: SocialAutomationSnapshot,
  options: PublishOptions = {},
) {
  const runAt = options.runAt || new Date();
  const runDateKey = buildDateKey(runAt);
  const selectedCampaign = selectCampaign(snapshot, runAt);
  const channels =
    options.channels && options.channels.length > 0
      ? options.channels
      : snapshot.channels;
  const primaryChannel: SocialChannel = selectedCampaign
    ? selectedCampaign.platformCopies[0]?.id || 'instagram'
    : 'instagram';
  const socialCardUrl = selectedCampaign
    ? getSocialCardUrl({
        title: selectedCampaign.topic.title,
        keyword: selectedCampaign.focusKeyword,
        channel: getChannelLabel(primaryChannel),
      })
    : '';

  if (!selectedCampaign) {
    const emptyState: SocialPublishState = {
      executionMode: options.dryRun ? 'dry-run' : 'auto',
      runDateKey,
      generatedAt: runAt.toISOString(),
      publishedAt: runAt.toISOString(),
      campaignId: '',
      campaignSlug: '',
      campaignTitle: '',
      campaignKeyword: '',
      leadUrl: '',
      topicUrl: '',
      socialCardUrl: '',
      channels,
      results: [],
      notes: ['Yayınlanacak kampanya bulunamadı.'],
    };

    writeSocialPublishState(emptyState);
    return emptyState;
  }

  const existingState = readSocialPublishState();
  if (
    !options.force &&
    existingState &&
    existingState.runDateKey === runDateKey &&
    existingState.campaignId === selectedCampaign.topic.id &&
    existingState.results.some((result) => result.status === 'published')
  ) {
    return existingState;
  }

  const results: SocialPublishResult[] = [];

  for (const channel of channels) {
    const copyItem = selectedCampaign.platformCopies.find(
      (item) => item.id === channel,
    );
    const label = getChannelLabel(channel);
    if (!copyItem) {
      results.push({
        channel,
        label,
        provider: 'manual',
        status: 'skipped',
        message: 'Bu kanal için içerik bulunamadı.',
      });
      continue;
    }

    const context: PublishContext = {
      campaign: selectedCampaign,
      channel,
      copy: copyItem.copy,
      label,
      leadUrl: copyItem.leadUrl,
      topicUrl: copyItem.topicUrl,
      imageUrl: buildSocialCardUrl({
        title: selectedCampaign.topic.title,
        keyword: selectedCampaign.focusKeyword,
        channel: label,
        cta: 'Ön değerlendirme formunu doldurun',
      }),
    };

    const result = await publishContext(context, Boolean(options.dryRun));
    results.push(result);
  }

  const publishedCount = results.filter(
    (result) => result.status === 'published',
  ).length;

  const state: SocialPublishState = {
    executionMode: options.dryRun ? 'dry-run' : 'auto',
    runDateKey,
    generatedAt: runAt.toISOString(),
    publishedAt: runAt.toISOString(),
    campaignId: selectedCampaign.topic.id,
    campaignSlug: selectedCampaign.topic.slug,
    campaignTitle: selectedCampaign.topic.title,
    campaignKeyword: selectedCampaign.focusKeyword,
    leadUrl: selectedCampaign.leadUrl,
    topicUrl: selectedCampaign.topicUrl,
    socialCardUrl,
    channels,
    results,
    notes: [
      `Yayın kampanyası: ${selectedCampaign.topic.title}`,
      `Run key: ${runDateKey}`,
      `Kanal seti: ${channels.join(', ')}`,
      options.dryRun
        ? 'Dry-run modu açık; gerçek yayın yapılmadı.'
        : publishedCount > 0
          ? 'Otomatik yayın çalıştırıldı.'
          : 'Yayın ortam değişkenleri eksik; draftlar hazırlandı.',
    ],
  };

  writeSocialPublishState(state);
  return state;
}
