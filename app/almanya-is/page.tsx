import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { buildFaqSchemaOrg, type FAQItem } from '@/lib/content/faq';
import { buildMetadata } from '@/lib/seo/metadata';

const SITE_URL = 'https://www.almanyavizerehberi.com';

const QUICK_LINKS = [
  { href: '/hizmetler/calisma-vizesi', label: 'Çalışma Vizesi' },
  { href: '/hizmetler/mavi-kart-vizesi', label: 'Mavi Kart' },
  { href: '/hizmetler/firsat-karti', label: 'Fırsat Kartı' },
  { href: '/uygunluk-testi', label: 'Ön Değerlendirme' },
  { href: '/almanya-goc', label: 'Almanya Göç Rehberi' },
] as const;

const ROUTES = [
  {
    href: '/hizmetler/calisma-vizesi',
    title: 'İş teklifi olanlar',
    text:
      'Almanya iş başvurusu sonrası iş teklifiniz varsa çalışma vizesi rotasını değerlendirin.',
  },
  {
    href: '/hizmetler/mavi-kart-vizesi',
    title: 'Nitelikli uzmanlar',
    text:
      'Diploma, maaş eşiği ve pozisyon uyuyorsa Mavi Kart daha güçlü bir seçenek olabilir.',
  },
  {
    href: '/hizmetler/firsat-karti',
    title: 'İş arayanlar',
    text:
      "İş sözleşmesi olmadan Almanya'da iş aramak için Fırsat Kartı rotasını inceleyin.",
  },
] as const;

const CHECKLIST = [
  'CV, diploma, iş deneyimi ve referans dosyanızı tek yerde toplayın.',
  'İlanın istediği dil seviyesi, maaş eşiği ve meslek uyumunu kontrol edin.',
  'İş teklifi varsa çalışma vizesi, yoksa Fırsat Kartı veya Mavi Kart rotasını kıyaslayın.',
  'Başvuruya geçmeden önce ön değerlendirme ile ilk rotayı netleştirin.',
] as const;

const PROCESS_STEPS = [
  {
    title: 'İlanı doğrulayın',
    text:
      'Pozisyonun gerektirdiği dil, deneyim ve maaş koşullarını kontrol edin.',
  },
  {
    title: 'Belgeleri eşleştirin',
    text:
      'Diploma, CV ve iş referanslarını başvuruyla uyumlu hale getirin.',
  },
  {
    title: 'Rota seçin',
    text:
      'İş teklifi, Mavi Kart veya Fırsat Kartı arasından doğru hattı belirleyin.',
  },
] as const;

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'job-1',
    question: 'Almanya iş başvurusu için iş teklifi şart mı?',
    answer:
      'Çoğu çalışma vizesi rotasında iş teklifi gerekir. İş arayanlar için ise Fırsat Kartı ve bazı durumlarda Mavi Kart değerlendirilebilir.',
  },
  {
    id: 'job-2',
    question: 'İş aramak için hangi rota daha uygun?',
    answer:
      'Nitelik ve hedefinize göre Fırsat Kartı veya Mavi Kart daha uygun olabilir. İş teklifi varsa çalışma vizesi hattı öne çıkar.',
  },
  {
    id: 'job-3',
    question: 'CV dışında hangi belgeler önemlidir?',
    answer:
      'Diploma, denklik, dil belgesi, iş referansları, pasaport ve gerekiyorsa sigorta ve finansal belgeler önemlidir.',
  },
  {
    id: 'job-4',
    question: 'İlk adım ne olmalı?',
    answer:
      'Ön değerlendirme testiyle rotayı netleştirmek, zaman kaybını azaltır ve doğru başvuru yoluna hızla yönlendirir.',
  },
];

const OFFICIAL_SOURCES = [
  {
    href: 'https://www.make-it-in-germany.com/en/working-in-germany',
    label: 'Make it in Germany',
    text: "Almanya'da çalışma ve iş başvurusu için resmi portal.",
  },
  {
    href: 'https://www.arbeitsagentur.de/en',
    label: 'Bundesagentur für Arbeit',
    text: 'İş arama ve Alman iş piyasası hakkında resmi kaynak.',
  },
  {
    href: 'https://www.bamf.de/EN/Startseite/startseite-node.html',
    label: 'BAMF',
    text: 'Göç ve oturum süreçleri için resmi kurum.',
  },
] as const;

const LAST_UPDATED = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

export const metadata: Metadata = buildMetadata({
  title: 'Almanya İş Başvurusu Rehberi',
  description:
    'Almanya iş, Almanya iş başvurusu, iş teklifi, Mavi Kart ve Fırsat Kartı için tek yerde yol haritası.',
  keywords: [
    'Almanya iş',
    'Almanya iş başvurusu',
    'Almanya çalışma vizesi',
    'Almanya göç',
    'iş teklifi',
    'Mavi Kart',
    'Fırsat Kartı',
  ],
  path: '/almanya-is',
});

export default function AlmanyaIsPage() {
  const faqJsonLd = buildFaqSchemaOrg(FAQ_ITEMS);

  return (
    <main className="public-page bg-surface-main">
      <Script id="almanya-is-faq" type="application/ld+json">
        {JSON.stringify(faqJsonLd)}
      </Script>

      <section className="site-hero py-12">
        <div className="site-container grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <RevealOnScroll>
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Almanya İş Başvurusu Rehberi' },
              ]}
            />
            <p className="eyebrow-on-dark mt-3 md:text-sm">
              İş Başvurusu
            </p>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-surface-main md:text-4xl lg:text-5xl">
              Almanya İş Başvurusu Rehberi
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-surface-main/80 md:text-base">
              Almanya iş başvurusu yaparken hangi yolun size uygun olduğunu
              netleştirin. İş teklifi, CV, denklik, maaş eşiği ve başvuru
              belgelerini tek yerde topladık.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/15"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-surface-main/80">
                Son güncelleme: {LAST_UPDATED}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-surface-main/80">
                İş başvurusu odaklı rehber
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="overflow-hidden rounded-[10px] border border-white/10 bg-slate-900/50 shadow-2xl shadow-slate-950/30">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/assets/img/hizmet/1.webp"
                  alt="Almanya iş başvurusu rehberi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid gap-px bg-white/10 md:grid-cols-3">
                {['İş teklifi', 'CV ve denklik', 'Belgeler'].map((label) => (
                  <div
                    key={label}
                    className="bg-slate-950/80 px-4 py-3 text-sm font-semibold text-slate-100"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Hangi rota size uygun?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Almanya iş arama ve iş başvurusu sürecinde en çok kullanılan
              üç ana rota burada yan yana duruyor.
            </p>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ROUTES.map((route, index) => (
              <RevealOnScroll key={route.href} delay={index * 0.05}>
                <Link
                  href={route.href}
                  className="panel flex h-full flex-col p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rota
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {route.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {route.text}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-brand-base">
                    Detaylı rehber
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <RevealOnScroll>
            <article className="panel h-full p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                İş başvurusu için hazırlık listesi
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Başvuruyu hızlandırmak için belgeleri tek akışta toparlayın.
              </p>
              <ul className="mt-6 space-y-2.5">
                {CHECKLIST.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm leading-5 text-slate-700"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-base"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </RevealOnScroll>

          <RevealOnScroll delay={0.05}>
            <article className="panel h-full p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Başvuru akışı
              </h2>
              <div className="mt-6 space-y-4">
                {PROCESS_STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-base/10 text-xs font-semibold text-brand-base">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-slate-950">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </RevealOnScroll>
        </div>
      </section>

      <section id="sss" className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Sık Sorulanlar
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Almanya iş, iş başvurusu ve çalışma rotasıyla ilgili kısa cevaplar.
            </p>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {FAQ_ITEMS.map((item, index) => (
              <RevealOnScroll key={item.id} delay={index * 0.04}>
                <article className="interactive-panel h-full p-5">
                  <h3 className="text-base font-semibold text-brand-dark">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.answer}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="kaynaklar" className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Resmi kaynaklar
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Başvuruyu yaparken kontrol edilmesi gereken resmi bilgiler.
            </p>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {OFFICIAL_SOURCES.map((source, index) => (
              <RevealOnScroll key={source.label} delay={index * 0.04}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Resmi kaynak
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {source.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {source.text}
                  </p>
                </a>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <div className="panel flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                İlk rota net değil mi?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Ön değerlendirme ile hangi iş ve vize hattına yönelmeniz
                gerektiğini birlikte ayıralım.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/uygunluk-testi"
                className="inline-flex items-center justify-center rounded-full bg-brand-base px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-light"
              >
                Uygunluk Testi
              </Link>
              <Link
                href="/basvuru"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-brand-base hover:text-brand-base"
              >
                Başvuru Yap
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
