export type WhatsAppCommunityLink = {
  href: string;
  label: 'WhatsApp Grubu' | 'WhatsApp Kanalı';
  tone: 'emerald' | 'sky';
};

export function normalizeExternalUrl(value?: string | null) {
  const raw = value?.trim();
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export function buildWhatsAppCommunityLinks({
  groupUrl,
  channelUrl,
}: {
  groupUrl?: string | null;
  channelUrl?: string | null;
}): WhatsAppCommunityLink[] {
  const entries = [
    groupUrl
      ? {
          href: groupUrl,
          label: 'WhatsApp Grubu',
          tone: 'emerald' as const,
        }
      : null,
    channelUrl
      ? {
          href: channelUrl,
          label: 'WhatsApp Kanalı',
          tone: 'sky' as const,
        }
      : null,
  ].filter(Boolean) as WhatsAppCommunityLink[];

  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.href)) return false;
    seen.add(entry.href);
    return true;
  });
}
