import type { Metadata } from 'next';

import { SocialAutomationStudio } from '@/components/admin/SocialAutomationStudio';
import { getMarketingTopicCatalog } from '@/lib/marketing/topicCatalog';
import { buildSocialAutomationSnapshot } from '@/lib/marketing/socialAutomation';
import { readSocialPublishState } from '@/lib/marketing/socialPublishStore';
import { readSocialAutomationSnapshot } from '@/lib/marketing/socialAutomationStore';
import {
  buildSeoAutomationSnapshot,
} from '@/lib/marketing/seoAutomation';
import { readSeoAutomationSnapshot } from '@/lib/marketing/seoAutomationStore';

export const metadata: Metadata = {
  title: 'SEO & Sosyal Otomasyon',
};

export default function AdminMarketingPage() {
  const topics = getMarketingTopicCatalog();
  const snapshot =
    readSocialAutomationSnapshot() ||
    buildSocialAutomationSnapshot(topics);
  const seoSnapshot =
    readSeoAutomationSnapshot() || buildSeoAutomationSnapshot(topics);
  const publishState = readSocialPublishState();

  return (
    <>
      <section className="admin-page">
        <h1 className="admin-page-title">SEO &amp; Sosyal Otomasyon</h1>
        <p className="admin-page-subtitle">
          Kapsamı günlük olarak yenilenen sosyal paket ve SEO motoru.
        </p>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="metric-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pillar
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {seoSnapshot.primaryPillars.length}
            </p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Brief
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {seoSnapshot.topicBriefs.length}
            </p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Link
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {seoSnapshot.linkSuggestions.length}
            </p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Son Üretim
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {new Date(seoSnapshot.generatedAt).toLocaleString('tr-TR')}
            </p>
          </div>
        </section>

        <section className="panel mt-6 p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            SEO Motoru
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Her cron çalışmasında ana hub sayfalar, konu brief&apos;leri ve iç
            link önerileri yeniden oluşturulur.
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Ana Kapsam
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {seoSnapshot.primaryPillars.slice(0, 4).map((pillar) => (
                  <li key={pillar.id} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-base" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {pillar.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {pillar.focusKeyword} • {pillar.path}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Link Haritası
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {seoSnapshot.linkSuggestions.slice(0, 5).map((link) => (
                  <li key={`${link.fromPath}-${link.toPath}-${link.anchorText}`}>
                    <span className="font-semibold text-slate-900">
                      {link.fromLabel}
                    </span>{' '}
                    -&gt; {link.anchorText} -{' '}
                    <span className="text-slate-500">{link.toPath}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-950">
              Güncel Notlar
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {seoSnapshot.notes.slice(0, 4).map((note) => (
                <li key={note}>- {note}</li>
              ))}
            </ul>
          </div>
        </section>
      </section>

      <SocialAutomationStudio
        topics={topics}
        snapshot={snapshot}
        publishState={publishState}
      />
    </>
  );
}
