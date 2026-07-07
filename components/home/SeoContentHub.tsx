import Image from 'next/image';
import Link from 'next/link';

import type { BlogPost } from '@/lib/content/blog';
import type { SeoPageBrief } from '@/lib/marketing/seoAutomation';

type SeoContentHubProps = {
  pillars: SeoPageBrief[];
  topicBriefs: SeoPageBrief[];
  blogPosts: BlogPost[];
};

const INTENT_META: Record<
  SeoPageBrief['intent'],
  {
    label: string;
    badgeClass: string;
    accentClass: string;
  }
> = {
  informational: {
    label: 'Bilgi',
    badgeClass: 'border-sky-200 bg-sky-50 text-sky-700',
    accentClass: 'bg-sky-500',
  },
  commercial: {
    label: 'Rehber',
    badgeClass: 'border-brand-base/20 bg-brand-base/10 text-brand-base',
    accentClass: 'bg-brand-base',
  },
  transactional: {
    label: 'Başvuru',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    accentClass: 'bg-emerald-500',
  },
};

const PATH_LABELS: Record<string, string> = {
  '/almanya-is': 'Almanya iş başvurusu',
  '/almanya-goc': 'Almanya göç',
  '/almanya-vizesi': 'Almanya vizesi',
  '/hizmetler': 'Vize hizmetleri',
  '/servisler': 'Göç sonrası',
  '/uygunluk-testi': 'Ön değerlendirme',
  '/blog': 'Blog',
  '/hizmetler/calisma-vizesi': 'Çalışma vizesi',
  '/hizmetler/mavi-kart-vizesi': 'Mavi Kart',
  '/hizmetler/firsat-karti': 'Fırsat Kartı',
  '/servisler/oturum-izni-basvurusu-ve-yenilenmesi': 'Oturum izni',
  '/servisler/yabancilar-dairesi-islemleri': 'Yabancılar Dairesi',
};

function getPathLabel(path: string) {
  return (
    PATH_LABELS[path] ||
    path.replace(/^\//, '').replace(/\//g, ' / ').replace(/-/g, ' ') ||
    'Ana Sayfa'
  );
}

function formatBlogDate(date: string) {
  const normalized = date.includes(' ') ? date.replace(' ', 'T') : date;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function getExcerpt(text: string, maxLength = 112) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trimEnd()}...`;
}

export function SeoContentHub({
  pillars,
  topicBriefs,
  blogPosts,
}: SeoContentHubProps) {
  const featuredPillars = pillars.filter((pillar) => pillar.path !== '/').slice(0, 4);
  const quickTopics = topicBriefs.slice(0, 5);
  const stats = [
    { label: 'Ana konu', value: `${featuredPillars.length}` },
    { label: 'Hızlı konu', value: `${quickTopics.length}` },
    { label: 'Blog', value: `${blogPosts.length}` },
  ];

  return (
    <section
      id="seo-content-hub"
      className="bg-surface-soft py-14 md:py-16"
    >
      <div className="site-container">
        <div className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-6 text-brand-dark md:px-8 md:py-7">
            <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-base/75">
                  KONU HARİTASI
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark md:text-4xl">
                  Almanya ile ilgili ana rehberler
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                  Almanya iş başvurusu, göç, vize ve çalışma rotalarını görünür,
                  düzenli ve birbirine bağlı bir içerik ağı halinde topluyoruz.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                {stats.map((stat) => (
                  <span
                    key={stat.label}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm"
                  >
                    <span className="text-brand-base">{stat.value}</span>
                    {stat.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={topic.path}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-base hover:bg-brand-base/5 hover:text-brand-base"
                >
                  {topic.focusKeyword}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 md:px-8 md:py-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {featuredPillars.map((pillar, index) => {
                  const intent = INTENT_META[pillar.intent];
                  const isPrimary = index === 0;

                  return (
                    <article
                      key={pillar.path}
                      className={`overflow-hidden rounded-[22px] border bg-white shadow-[0_12px_28px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.09)] ${
                        isPrimary
                          ? 'border-brand-base/25 hover:border-brand-base/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`h-1 w-full ${intent.accentClass}`} />

                      <div className="p-5">
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${intent.badgeClass}`}
                            >
                              {intent.label}
                            </span>
                            <span className="text-xs font-semibold text-brand-base">
                              {pillar.focusKeyword}
                            </span>
                          </div>

                          <h3 className="mt-3 text-xl font-semibold leading-tight text-brand-dark">
                            {pillar.title}
                          </h3>

                          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                            {pillar.outline.slice(0, isPrimary ? 3 : 2).map((item) => (
                              <li key={item} className="flex gap-2">
                                <span
                                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-base"
                                  aria-hidden="true"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                          <div className="text-xs leading-5 text-slate-500">
                            İç link ağına bağlı, görünür ve güncel içerik.
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {pillar.supportingPaths.slice(0, 2).map((href) => (
                              <Link
                                key={href}
                                href={href}
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-brand-base hover:text-brand-base"
                              >
                                {getPathLabel(href)}
                              </Link>
                            ))}
                            <Link
                              href={pillar.path}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-base transition hover:text-brand-light"
                            >
                              Rehberi aç <span aria-hidden="true">→</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <section className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">SON YAZILAR</p>
                    <h3 className="mt-2 text-xl font-semibold text-brand-dark">
                      Blog hattı
                    </h3>
                  </div>
                  <Link
                    href="/blog"
                    className="text-sm font-semibold text-brand-base transition hover:text-brand-light"
                  >
                    Tümü
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {blogPosts.map((post) => {
                    const excerpt = getExcerpt(post.seoDescription);
                    const dateLabel = formatBlogDate(post.date);

                    return (
                      <article
                        key={post.slug}
                        className="group flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2.5 transition hover:border-brand-base/30 hover:bg-white"
                      >
                        {post.image ? (
                          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            Blog
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {dateLabel}
                          </p>
                          <h4 className="mt-1 text-sm font-semibold leading-6 text-slate-950 line-clamp-2">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h4>
                          <p className="mt-1.5 text-[11px] leading-5 text-slate-600 line-clamp-2">
                            {excerpt}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                <p className="eyebrow">SEO AKIŞI</p>
                <h3 className="mt-2 text-lg font-semibold text-brand-dark">
                  Görünür rota, net bağlantı, güçlü dönüşüm
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  İç bağlantılar ana sayfayı destekler, blog trafiğini toplar ve
                  uygunluk testine yönlendirir.
                </p>

                <div className="mt-4 grid gap-2">
                  {[
                    { label: 'Konu kümeleri', href: '/almanya-is' },
                    { label: 'Blog trafiği', href: '/blog' },
                    { label: 'Başvuru rotası', href: '/uygunluk-testi' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-brand-base hover:text-brand-base"
                    >
                      <span>{item.label}</span>
                      <span className="text-brand-base">→</span>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="rounded-[22px] border border-brand-base/20 bg-brand-dark p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                  ROTAYI NETLEŞTİRİN
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Hangi yolun size uygun olduğunu hızla görün.
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Ön değerlendirme ile doğru başvuru hattına geçin.
                </p>
                <Link
                  href="/uygunluk-testi"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-slate-100"
                >
                  Ön Değerlendirme
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
