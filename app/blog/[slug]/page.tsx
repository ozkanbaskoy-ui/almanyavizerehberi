import type { Metadata } from 'next';
import Link from 'next/link';

import {
  getAllBlogPosts,
  getBlogSlugs,
} from '@/lib/content/blog';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { Breadcrumb } from '@/components/common/Breadcrumb';

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const SITE_URL = 'https://www.almanyavizerehberi.com';

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  try {
    const { slug } = await props.params;
    const posts = getAllBlogPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) return {};

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || '';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/blog/${post.slug}`,
        images: post.image
          ? [
              {
                url: post.image,
                alt: post.title,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage(props: PageProps) {
  const { slug } = await props.params;

  const allPosts = getAllBlogPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="bg-surface-main">
        <section className="mx-auto max-w-[1200px] px-4 py-16">
          <RevealOnScroll>
            <h1 className="text-2xl font-semibold text-slate-900">
              Blog yazısı bulunamadı
            </h1>
            <p className="mt-3 text-sm text-slate-700">
              Görüntülemeye çalıştığınız blog yazısı bulunamadı. Lütfen{' '}
              <Link
                href="/blog.php"
                className="text-brand-base hover:text-brand-light"
              >
                blog sayfasına
              </Link>{' '}
              geri dönüp başka bir yazı seçin.
            </p>
          </RevealOnScroll>
        </section>
      </main>
    );
  }

  const isBlog6 = post.slug === 'blog-6';

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
        name: 'Blog',
        item: `${SITE_URL}/blog.php`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: post.canonical || `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="bg-surface-main">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_#020617_95%)] py-12 text-surface-main">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll>
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/index.php' },
                { label: 'Blog', href: '/blog.php' },
                { label: post.title },
              ]}
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 md:text-sm">
              Blog Yazısı
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            {post.seoDescription && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-surface-main/80 md:text-base">
                {post.seoDescription}
              </p>
            )}
            {post.date && (
              <p className="mt-3 text-xs text-surface-main/70 md:text-sm">
                Yayın tarihi:{' '}
                <time dateTime={post.date}>{post.date}</time>
              </p>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* İçerik */}
      <section className="bg-surface-soft py-12">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1.2fr)]">
            {/* Sol: blog içeriği */}
            <RevealOnScroll>
              <article className="rounded-3xl border border-border-subtle bg-surface-main p-6 text-sm leading-relaxed text-slate-800 shadow-soft md:p-8 md:text-base">
                {isBlog6 ? (
                  <div className="prose prose-slate max-w-none prose-h2:text-brand-dark prose-h3:text-brand-dark prose-strong:text-brand-dark">
                    <h2>Denklik Başvurusu Nedir?</h2>
                    <p>
                      Almanya’da denklik başvurusu, yurt dışında edinilen
                      mesleki yeterliliklerin Almanya&apos;daki mesleki
                      standartlara uygun olup olmadığını belirleyen bir
                      süreçtir. Bu süreç, özellikle düzenlenmiş mesleklerde
                      (doktorluk, mühendislik, öğretmenlik gibi) Almanya’da
                      çalışmak isteyenler için zorunludur. Denklik belgesi,
                      kişinin Almanya’da bu mesleği icra etmesine yasal olarak
                      izin verir ve genellikle işverenler tarafından aranan bir
                      belgedir.
                    </p>

                    <h2>Denklik Başvurusu Neden Önemlidir?</h2>
                    <p>
                      Almanya, yüksek mesleki standartları ve düzenlemeleri olan
                      bir ülkedir. Yurt dışında alınan bir mesleki eğitimin
                      Almanya’daki mesleki standartlara uygun olup olmadığını
                      belirlemek için denklik başvurusu yapılır. Bu süreç,
                      Almanya’daki iş piyasasına entegrasyonu kolaylaştırır ve
                      yurt dışından gelen profesyonellerin Almanya’da kendi
                      alanlarında çalışabilmesini sağlar. Denklik belgesi, iş
                      başvurularında önemli bir avantaj sunar ve Almanya’da
                      düzenlenmiş mesleklerde çalışmanın ön koşuludur.
                    </p>

                    <h2>Denklik Başvurusu Nasıl Yapılır?</h2>
                    <p>
                      Denklik başvurusunda bulunmak için izlenmesi gereken
                      adımlar şunlardır:
                    </p>
                    <ul>
                      <li>
                        <strong>Mesleğinizi düzenleyen kurumu belirleyin:</strong>{' '}
                        Öncelikle mesleğinizi düzenleyen yetkili Alman kurumunu
                        belirlemeniz gerekir. Bu kurum, başvurunuzu inceleyip
                        denklik kararını verecektir. Örneğin, sağlık alanında
                        çalışmak isteyenler için Almanya’daki sağlık odaları
                        yetkili kurumlar arasındadır.
                      </li>
                      <li>
                        <strong>Belgelerin hazırlanması:</strong> Başvuru için
                        gerekli belgeleri toplamanız gerekir. Bu belgeler
                        arasında diploma, transkript, iş deneyimi belgeleri,
                        Almanca dil yeterlilik belgesi ve kimlik belgeleri
                        bulunur. Belgelerin Almanca’ya yeminli tercümanlar
                        tarafından çevrilmiş olması gerekmektedir.
                      </li>
                      <li>
                        <strong>Başvurunun yapılması:</strong> Hazırladığınız
                        belgelerle birlikte ilgili kuruma başvurunuzu
                        yapabilirsiniz. Başvuru süreci genellikle birkaç ay
                        sürebilir. Başvuru ücreti ise başvurduğunuz mesleğe ve
                        eyalete göre değişiklik gösterebilir.
                      </li>
                      <li>
                        <strong>Değerlendirme süreci:</strong> Başvurunuz
                        incelendikten sonra tam denklik, kısmi denklik veya
                        denklik reddi gibi sonuçlarla karşılaşabilirsiniz.
                        Kısmi denklik verildiği durumlarda, eksikliklerin
                        giderilmesi için ek eğitim veya sınavlara girmeniz
                        gerekebilir.
                      </li>
                    </ul>

                    <h2>Denklik Süreci İçin Gerekli Belgeler</h2>
                    <ul>
                      <li>
                        Başvuru formu (Almanca doldurulmuş resmi başvuru
                        dilekçesi).
                      </li>
                      <li>
                        Diploma ve sertifikalar (mesleki eğitimin tamamlandığını
                        gösteren belgeler).
                      </li>
                      <li>
                        Transkriptler (eğitimin içeriğini ve süresini belgeleyen
                        dokümanlar).
                      </li>
                      <li>
                        İş deneyim belgeleri (mesleki yeterliliği ve deneyimi
                        kanıtlayan belgeler).
                      </li>
                      <li>Almanca yeterlilik belgesi.</li>
                      <li>
                        Noter onaylı tercümeler (belgelerin Almanca&apos;ya
                        yeminli tercümanlar tarafından çevrilmiş halleri).
                      </li>
                      <li>
                        Kimlik ve ikamet belgeleri (pasaport, oturum izni vb.).
                      </li>
                    </ul>

                    <h2>Denklik Başvurusunda Dikkat Edilmesi Gerekenler</h2>
                    <ul>
                      <li>
                        <strong>Dil yeterliliği:</strong> Almanya&apos;da
                        mesleki denklik almak isteyenlerin Almanca dil bilgisine
                        sahip olmaları gerekmektedir. Bu nedenle, başvuru
                        öncesinde dil yeterlilik belgesi alınmalıdır.
                      </li>
                      <li>
                        <strong>Başvuru ücreti:</strong> Başvuru süreci
                        ücretlidir ve başvurduğunuz mesleğe ve eyalete bağlı
                        olarak değişiklik gösterebilir. Başvuru yapmadan önce bu
                        konuda bilgi almak önemlidir.
                      </li>
                      <li>
                        <strong>Danışmanlık hizmetleri:</strong> Denklik
                        süreci karmaşık olabilir. Bu süreçte profesyonel
                        danışmanlık almak, başvurunun doğru ve eksiksiz
                        yapılmasını sağlayabilir.
                      </li>
                    </ul>

                    <h2>Denklik Başvurusunun Sonuçları</h2>
                    <p>
                      Başvurunuzun sonucuna göre üç farklı durumla
                      karşılaşabilirsiniz:
                    </p>
                    <ul>
                      <li>
                        <strong>Tam denklik:</strong> Başvurunuzun
                        Almanya&apos;daki mesleki standartlara tam olarak uygun
                        olduğuna karar verildiğinde, tam denklik verilir. Bu
                        durumda, mesleğinizi Almanya’da tam yetkiyle icra
                        edebilirsiniz.
                      </li>
                      <li>
                        <strong>Kısmi denklik:</strong> Başvurunuzun bazı
                        eksiklikler içerdiği durumlarda kısmi denklik verilir.
                        Eksiklikleri gidermek için ek eğitimler almanız veya
                        sınavlara girmeniz gerekebilir.
                      </li>
                      <li>
                        <strong>Denklik reddi:</strong> Başvurunuzun kabul
                        edilmediği durumdur. Bu durumda, mesleğinizi Almanya’da
                        icra edebilmek için gerekli olan ek eğitimleri
                        tamamlamanız gerekebilir.
                      </li>
                    </ul>

                    <h2>Denklik Sürecinde Danışmanlık Almanın Önemi</h2>
                    <p>
                      Almanya’da denklik süreci karmaşık ve zaman alıcı
                      olabilir. Bu nedenle, profesyonel danışmanlık
                      hizmetlerinden yararlanmak, süreci hızlandırabilir ve
                      doğru bir şekilde tamamlanmasını sağlayabilir.
                      Danışmanlar, gerekli belgelerin hazırlanması, başvurunun
                      doğru yere yapılması ve süreç boyunca karşılaşılabilecek
                      olası sorunların çözülmesi konusunda destek sağlar.
                    </p>
                    <p>
                      Almanya’da mesleki denklik süreci, yurt dışında eğitim
                      almış profesyonellerin Almanya’da kariyer yapabilmesi için
                      kritik bir adımdır. Denklik belgesi, Almanya’da yasal
                      olarak çalışabilmenizi sağlar ve iş arama sürecinde büyük
                      bir avantaj sunar. Bu süreci doğru bir şekilde yönetmek,
                      Almanya’da başarılı bir kariyerin anahtarıdır.
                    </p>
                  </div>
                ) : (
                  <div
                    className="prose prose-slate max-w-none prose-h2:text-brand-dark prose-h3:text-brand-dark prose-strong:text-brand-dark"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                  />
                )}
              </article>
            </RevealOnScroll>

            {/* Sağ: diğer blog yazıları */}
            <RevealOnScroll delay={0.05}>
              <aside className="rounded-3xl border border-border-subtle bg-surface-main p-5 shadow-soft">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Diğer Blog Yazıları
                </h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {allPosts.map((p) => {
                    const active = p.slug === post.slug;
                    return (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className={[
                            'block rounded-full px-4 py-2 text-left transition',
                            active
                              ? 'bg-brand-base text-white shadow-sm'
                              : 'bg-surface-soft text-slate-800 hover:bg-surface-softer',
                          ].join(' ')}
                        >
                          {p.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </main>
  );
}

