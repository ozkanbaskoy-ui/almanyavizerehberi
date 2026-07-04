import type { Metadata } from 'next';

import { SocialAutomationStudio } from '@/components/admin/SocialAutomationStudio';
import { getMarketingTopicCatalog } from '@/lib/marketing/topicCatalog';
import { buildSocialAutomationSnapshot } from '@/lib/marketing/socialAutomation';
import { readSocialPublishState } from '@/lib/marketing/socialPublishStore';
import { readSocialAutomationSnapshot } from '@/lib/marketing/socialAutomationStore';

export const metadata: Metadata = {
  title: 'SEO & Sosyal Otomasyon',
};

export default function AdminMarketingPage() {
  const topics = getMarketingTopicCatalog();
  const snapshot =
    readSocialAutomationSnapshot() ||
    buildSocialAutomationSnapshot(topics);
  const publishState = readSocialPublishState();

  return (
    <SocialAutomationStudio
      topics={topics}
      snapshot={snapshot}
      publishState={publishState}
    />
  );
}
