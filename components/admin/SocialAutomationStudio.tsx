'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  buildRotationPlan,
  buildSocialCampaign,
  formatCampaignMarkdown,
  SOCIAL_CHANNEL_OPTIONS,
  SOCIAL_TONE_OPTIONS,
  type MarketingTopic,
  type SocialAutomationSnapshot,
  type RotationPlanItem,
  type SocialChannel,
  type SocialCampaign,
  type SocialTone,
} from '@/lib/marketing/socialAutomation';

type SocialAutomationStudioProps = {
  topics: MarketingTopic[];
  snapshot?: SocialAutomationSnapshot | null;
};

const DEFAULT_CHANNELS = SOCIAL_CHANNEL_OPTIONS.filter(
  (option) => option.defaultSelected,
).map((option) => option.id);

function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}

function formatRotationMarkdown(items: RotationPlanItem[]) {
  const lines = ['## Rotation Plan'];
  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.day} ${item.time} - ${item.topic.title} - ${item.channel} - ${item.angle}`,
    );
  });
  return lines.join('\n');
}

function getChannelLimitLabel(length: number, limit: number) {
  return `${length}/${limit}`;
}

export function SocialAutomationStudio({
  topics,
  snapshot,
}: SocialAutomationStudioProps) {
  const [selectedTopicId, setSelectedTopicId] = useState(
    topics[0]?.id || '',
  );
  const [tone, setTone] = useState<SocialTone>('donusum');
  const [selectedChannels, setSelectedChannels] =
    useState<SocialChannel[]>(DEFAULT_CHANNELS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!topics.length) return;
    if (!topics.some((topic) => topic.id === selectedTopicId)) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  const selectedTopic = useMemo(() => {
    return topics.find((topic) => topic.id === selectedTopicId) || topics[0];
  }, [topics, selectedTopicId]);

  const selectedCampaign = useMemo<SocialCampaign | null>(() => {
    if (!selectedTopic) return null;
    return buildSocialCampaign(selectedTopic, {
      tone,
      channels: selectedChannels,
    });
  }, [selectedTopic, tone, selectedChannels]);

  const rotationPlan = useMemo(() => {
    return buildRotationPlan(topics, {
      tone,
      channels: selectedChannels,
      count: 8,
      topicCount: Math.min(4, topics.length),
    });
  }, [topics, tone, selectedChannels]);

  const topicOptions = useMemo(
    () =>
      topics.map((topic) => ({
        ...topic,
        label: `${topic.title} - ${topic.kind === 'visa' ? 'Vize' : 'Hizmet'}`,
      })),
    [topics],
  );

  async function handleCopy(key: string, text: string) {
    try {
      await copyText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1400);
    } catch {
      setCopiedKey('error');
      window.setTimeout(() => setCopiedKey((current) => (current === 'error' ? null : current)), 1400);
    }
  }

  function toggleChannel(channel: SocialChannel) {
    setSelectedChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    );
  }

  const copyAllText = useMemo(() => {
    if (!selectedCampaign) return '';
    return [
      formatCampaignMarkdown(selectedCampaign),
      '',
      formatRotationMarkdown(rotationPlan),
    ].join('\n');
  }, [selectedCampaign, rotationPlan]);

  const snapshotGeneratedLabel = snapshot
    ? new Date(snapshot.generatedAt).toLocaleString('tr-TR')
    : 'Anlık önizleme';

  if (!topics.length || !selectedCampaign || !selectedTopic) {
    return (
      <main className="admin-page">
        <h1 className="admin-page-title">SEO &amp; Sosyal Otomasyon</h1>
        <p className="admin-page-subtitle">
          Paylaşım üretmek için uygun içerik bulunamadı.
        </p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <h1 className="admin-page-title">SEO &amp; Sosyal Otomasyon</h1>
      <p className="admin-page-subtitle">
        Çalışma vizesi, Mavi Kart ve Fırsat Kart için otomatik sosyal paket
        üretin. İçerikten başlık, açıklama, platform metni ve haftalık plan
        çıkarılır.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Son Üretim
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-950">
            {snapshotGeneratedLabel}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Kampanya
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {snapshot?.campaigns.length ?? topics.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Dağıtım
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {snapshot?.distributionQueue.length ?? rotationPlan.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            SEO Fikir
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {snapshot?.seoQueue.length ?? 0}
          </p>
        </div>
      </section>

      {snapshot?.notes?.length ? (
        <section className="panel mt-6 p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Otomasyon Notları
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {snapshot.notes.slice(0, 4).map((note) => (
              <li key={note}>- {note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Toplam Konu
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {topics.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Seçili Kanal
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {selectedChannels.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Döngü
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {rotationPlan.length}
          </p>
        </div>
      </section>

      <section className="panel mt-6 p-5">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="form-label">Konu</label>
                <select
                  className="form-input"
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                >
                  {topicOptions.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Ton</label>
                <select
                  className="form-input"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as SocialTone)}
                >
                  {SOCIAL_TONE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="form-label">Kanal Seçimi</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SOCIAL_CHANNEL_OPTIONS.map((option) => {
                  const active = selectedChannels.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleChannel(option.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? 'border-brand-base bg-brand-base text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-brand-base hover:text-brand-base'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Odak Kelime
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {selectedCampaign.focusKeyword}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hedef Kitle
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {selectedCampaign.audience}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lead URL
              </p>
              <div className="mt-1 flex items-center gap-2">
                <input
                  readOnly
                  value={selectedCampaign.leadUrl}
                  className="form-input min-w-0 flex-1 text-xs"
                />
                <button
                  type="button"
                  className="btn-primary whitespace-nowrap px-4 py-2 text-xs"
                  onClick={() =>
                    void handleCopy('lead-url', selectedCampaign.leadUrl)
                  }
                >
                  {copiedKey === 'lead-url' ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Landing URL
              </p>
              <div className="mt-1 flex items-center gap-2">
                <input
                  readOnly
                  value={selectedCampaign.topicUrl}
                  className="form-input min-w-0 flex-1 text-xs"
                />
                <button
                  type="button"
                  className="btn-primary whitespace-nowrap px-4 py-2 text-xs"
                  onClick={() =>
                    void handleCopy('topic-url', selectedCampaign.topicUrl)
                  }
                >
                  {copiedKey === 'topic-url' ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => void handleCopy('all', copyAllText)}
          >
            {copiedKey === 'all' ? 'Paket kopyalandı' : 'Paketin tamamını kopyala'}
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-base hover:text-brand-base"
            onClick={() =>
              void handleCopy(
                'json',
                JSON.stringify(
                  {
                    campaign: selectedCampaign,
                    rotationPlan,
                  },
                  null,
                  2,
                ),
              )
            }
          >
            {copiedKey === 'json' ? 'JSON kopyalandı' : 'JSON kopyala'}
          </button>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="panel p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Platform Metinleri
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Seçili platformlar için hazır kopya metinler.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {selectedCampaign.platformCopies.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950">
                      {item.label}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Limit: {item.characterLimit} karakter
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-mono text-slate-600">
                    {getChannelLimitLabel(item.copy.length, item.characterLimit)}
                  </span>
                </div>

                <textarea
                  readOnly
                  className="mt-3 min-h-[160px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-800"
                  value={item.copy}
                />

                <div className="mt-3 flex items-center justify-end">
                  <button
                    type="button"
                    className="btn-primary px-4 py-2 text-xs"
                    onClick={() => void handleCopy(item.id, item.copy)}
                  >
                    {copiedKey === item.id ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Carousel ve Reel
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-950">
                  Carousel Slaytları
                </h3>
                <ol className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedCampaign.carouselSlides.map((slide) => (
                    <li key={slide} className="leading-6">
                      {slide}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-950">
                  Reels / Shorts
                </h3>
                <ol className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedCampaign.reelScript.map((line) => (
                    <li key={line} className="leading-6">
                      {line}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Hashtag Seti
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCampaign.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Haftalık Rotasyon
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Seçili konular ve kanallara göre otomatik yayın döngüsü.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Hafta</th>
                    <th className="px-3 py-2">Gün</th>
                    <th className="px-3 py-2">Saat</th>
                    <th className="px-3 py-2">Kanal</th>
                    <th className="px-3 py-2">Konu</th>
                    <th className="px-3 py-2">Açı</th>
                  </tr>
                </thead>
                <tbody>
                  {rotationPlan.map((item, index) => (
                    <tr key={`${item.topic.id}-${index}`}>
                      <td className="rounded-l-2xl border border-r-0 border-slate-200 bg-white px-3 py-3 text-slate-700">
                        {item.week}
                      </td>
                      <td className="border border-r-0 border-slate-200 bg-white px-3 py-3 text-slate-700">
                        {item.day}
                      </td>
                      <td className="border border-r-0 border-slate-200 bg-white px-3 py-3 text-slate-700">
                        {item.time}
                      </td>
                      <td className="border border-r-0 border-slate-200 bg-white px-3 py-3 text-slate-700">
                        {item.channel}
                      </td>
                      <td className="border border-r-0 border-slate-200 bg-white px-3 py-3 text-slate-700">
                        {item.topic.title}
                      </td>
                      <td className="rounded-r-2xl border border-slate-200 bg-white px-3 py-3 text-slate-700">
                        {item.angle}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
