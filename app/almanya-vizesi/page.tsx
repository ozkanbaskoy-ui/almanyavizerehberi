import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { getAllBlogPosts } from '@/lib/content/blog';
import { buildFaqSchemaOrg, getAllFaq } from '@/lib/content/faq';
import { getVisaBySlug } from '@/lib/content/visas';
import { buildMetadata } from '@/lib/seo/metadata';

const SITE_URL = 'https://www.almanyavizerehberi.com';

const FEATURED_VISA_SLUGS = [
  'calisma-vizesi',
  'mavi-kart-vizesi',
  'firsat-karti',
] as const;

const FEATURED_BLOG_SLUGS = ['blog-1', 'blog-2', 'blog-6'] as const;

const QUICK_LINKS = [
  { href: '/hizmetler/calisma-vizesi', label: 'Çalışma Vizesi' },
  { href: '/hizmetler/mavi-kart-vizesi', label: 'Mavi Kart' },
  { href: '/hizmetler/firsat-karti', label: 'Fırsat Kartı' },
  { href: '/almanya-goc', label: 'Almanya Göç Rehberi' },
  { href: '/uygunluk-testi', label: 'Ön Değerlendirme' },
  { href: '/sss', label: 'SSS' },
];

const PAGE_OUTLINE = [
  { href: '#rota', label: 'Rota Seçimi' },
  { href: '#akis', label: 'Başvuru Akışı' },
  { href: '#sss', label: 'Sık Sorulanlar' },
  { href: '#kaynaklar', label: 'Resmi Kaynaklar' },
];

const OFFICIAL_SOURCES = [
  {
    href: 'https://www.idata.com.tr/',
    label: 'iDATA',
    text: 'Türkiye’den Almanya vize başvuruları için resmi başvuru yüzeyi.',
  },
  {
    href: 'https://www.mfa.gov.tr/almanya.tr.mfa',
    label: 'T.C. Dışişleri Bakanlığı',
    text: 'Almanya sayfasındaki seyahat ve konsolosluk yönlendirmeleri.',
  },
  {
    href: 'https://www.goc.gov.tr/',
    label: 'Göç İdaresi Başkanlığı',
    text: 'Almanya sonrası göç ve yerleşim tarafında kamusal referans.',
  },
];

const LAST_UPDATED = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

const PROCESS_STEPS = [
  {
    title: 'Rota netleştirin',
    text:
      'Almanya vizesi, çalışma vizesi veya göç hattı için hangi dosyanın daha uygun olduğunu belirleyin.',
  },
  {
    title: 'Evrakları düzenleyin',
    text:
      'İş teklifi, diploma, denklik, sigorta ve finansal belgeleri eksiksiz hazırlayın.',
  },
  {
    title: 'Başvuruyu takip edin',
    text:
      'Randevu, dosya kontrolü ve son adımı tek bir akışta ilerletin.',
  },
];

const FAQ_IDS = ['faq-1', 'faq-2', 'faq-3', 'faq-9', 'faq-11', 'faq-20'];

export const metadata: Metadata = buildMetadata({
  title: 'Almanya Vizesi Rehberi',
  description:
    'Almanya vizesi, Almanya çalışma vizesi, çalışma vizesi, Mavi Kart ve Fırsat Kartı için tek merkezde güncel rehber.',
  keywords: [
    'Almanya vizesi',
    'Almanya',
    'Almanya çalışma vizesi',
    'Almanya göç',
    'çalışma vizesi',
    'Mavi Kart',
    'Fırsat Kartı',
  ],
  path: '/almanya-vizesi',
});

export default function AlmanyaVizesiPage() {
  const allBlogPosts = getAllBlogPosts();
  const featuredVisas = FEATURED_VISA_SLUGS.map((slug) =>
    getVisaBySlug(slug),
  );
  const blogPosts = FEATURED_BLOG_SLUGS.map((slug) =>
    allBlogPosts.find((post) => post.slug === slug),
  ).filter(Boolean) as (typeof allBlogPosts)[number][];
  const faqItems = getAllFaq().filter((item) => FAQ_IDS.includes(item.id));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Almanya Vizesi Rehberi',
        item: `${SITE_URL}/almanya-vizesi`,
      },
    ],
  };

  const faqJsonLd = buildFaqSchemaOrg(faqItems);

  return (
    <main className="public-page bg-surface-main">
      <Script id="almanya-vizesi-breadcrumb" type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <Script id="almanya-vizesi-faq" type="application/ld+json">
        {JSON.stringify(faqJsonLd)}
      </Script>

      <section className="site-hero py-12">
        <div className="site-container grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <RevealOnScroll>
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Almanya Vizesi Rehberi' },
              ]}
            />
            <p className="eyebrow-on-dark mt-3 md:text-sm">
              Almanya Vizesi
            </p>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-surface-main md:text-4xl lg:text-5xl">
              Almanya Vizesi, Almanya Çalışma Vizesi ve Göç Rehberi
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-surface-main/80 md:text-base">
              Almanya vizesi, çalışma vizesi, Mavi Kart ve Fırsat Kartı
              için doğru rotayı netleştirin. İş teklifi, denklik, belge
              sırası ve başvuru adımlarını tek yerden takip edin.
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
                Resmi kaynaklarla desteklenir
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="overflow-hidden rounded-[10px] border border-white/10 bg-slate-900/50 shadow-2xl shadow-slate-950/30">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/assets/img/hizmet/1.webp"
                  alt="Almanya vizesi ve çalışma vizesi rehberi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid gap-px bg-white/10 md:grid-cols-3">
                {['İş teklifi', 'Maaş eşiği', 'Belgeler'].map((label) => (
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

      <section className="section-surface pb-4 pt-0">
        <div className="site-container">
          <div className="flex flex-wrap gap-3">
            {PAGE_OUTLINE.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-brand-base hover:text-brand-base"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container" id="rota">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Hangi rota size uygun?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Almanya vizesi aramasında en çok ihtiyaç duyulan üç ana
              rota, burada yan yana duruyor.
            </p>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featuredVisas.map((visa, index) => (
              <RevealOnScroll key={visa.slug} delay={index * 0.05}>
                <Link
                  href={`/hizmetler/${visa.slug}`}
                  className="panel flex h-full flex-col p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vize Rotası
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {visa.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {visa.seoDescription}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-brand-base">
                    Detaylı rehber
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                href: '/almanya-goc',
                title: 'Almanya Göç Rehberi',
                text:
                  'Yerleşme, ilk adımlar ve göç sonrası süreçler için tek merkez.',
              },
              {
                href: '/uygunluk-testi',
                title: 'Ön Değerlendirme',
                text:
                  'Kendi dosyanız için en uygun başvuru hattını hızlıca görün.',
              },
            ].map((item, index) => (
              <RevealOnScroll key={item.href} delay={0.1 + index * 0.05}>
                <Link
                  href={item.href}
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kılavuz
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container" id="akis">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Başvuru akışı nasıl ilerliyor?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Diğer sitelerde gördüğümüz uzun rehber yapısını, daha kısa
              ve daha uygulanabilir bir akışa çeviriyoruz.
            </p>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <RevealOnScroll key={step.title} delay={index * 0.05}>
                <article className="interactive-panel h-full p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-base">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {step.text}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container" id="sss">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Sık Sorulanlar
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              En çok sorulan soruların kısa yanıtları burada. Bu bölüm,
              Almanya vizesi arayan kullanıcıların aradığı temel cevapları
              tek yerde toplar.
            </p>
          </RevealOnScroll>

          <div className="mt-6 space-y-4">
            {faqItems.map((item, index) => (
              <RevealOnScroll key={item.id} delay={index * 0.04}>
                <article className="interactive-panel p-5">
                  <h3 className="text-base font-semibold text-slate-950">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {item.answer}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container" id="kaynaklar">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Resmi kaynaklar
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Önemli başvuru ve yerleşim bilgilerini doğrulamak için
              kullandığımız ana kamu kaynakları.
            </p>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {OFFICIAL_SOURCES.map((item, index) => (
              <RevealOnScroll key={item.href} delay={index * 0.05}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Resmi
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </a>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              İlgili rehberler
            </h2>
          </RevealOnScroll>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {blogPosts.map((post, index) => {
              const excerpt =
                post.seoDescription.length > 140
                  ? `${post.seoDescription.slice(0, 137)}...`
                  : post.seoDescription;

              return (
                <RevealOnScroll key={post.slug} delay={index * 0.05}>
                  <article className="interactive-panel group flex h-full flex-col overflow-hidden">
                    {post.image && (
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-semibold text-brand-dark line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      {post.date && (
                        <p className="mt-2 text-xs text-slate-500">
                          {post.date}
                        </p>
                      )}
                      <p className="mt-3 text-xs leading-relaxed text-slate-700 md:text-sm line-clamp-5">
                        {excerpt}
                      </p>
                      <div className="mt-4">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs font-semibold text-brand-base hover:text-brand-light"
                        >
                          Devamını Oku
                        </Link>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <div className="panel flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Rotayı netleştirin
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Almanya vizesi, çalışma vizesi veya göç hattınız için
                  ilk soruyu birlikte cevaplayalım.
                </p>
              </div>
              <Link
                href="/uygunluk-testi"
                className="btn-primary inline-flex self-start md:self-auto"
              >
                Ön Değerlendirme
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
