import type { Metadata } from 'next';
import Script from 'next/script';

import { getPageBySlug } from '@/lib/content/pages';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo/metadata';

function getPage() {
  return getPageBySlug('hakkimizda');
}

export function generateMetadata(): Metadata {
  const page = getPage();

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || '',
    keywords: page.keywords,
    alternates: {
      canonical: 'https://www.almanyavizerehberi.com/hakkimizda',
    },
    openGraph: {
      type: 'website',
      title: page.seoTitle || page.title,
      description: page.seoDescription || '',
      url: 'https://www.almanyavizerehberi.com/hakkimizda',
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
  };
}

export default function HakkimizdaPage() {
  const page = getPage();
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: page.title,
    description: page.seoDescription,
    url: 'https://www.almanyavizerehberi.com/hakkimizda',
    about: {
      '@type': 'Organization',
      name: 'Almanya Vize Rehberi',
      url: 'https://www.almanyavizerehberi.com',
    },
  };

  return (
    <main className="compact-content-page bg-surface-main">
      <Script id="about-jsonld" type="application/ld+json">
        {JSON.stringify(aboutJsonLd)}
      </Script>
      {/* Hero */}
      <section className="site-hero">
        <div className="site-container">
          <RevealOnScroll className="max-w-3xl">
            <p className="eyebrow-on-dark font-heading">
              Hakkımızda
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {page.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-surface-main/80 md:text-base">
              Almanya Vize Rehberi olarak, Almanya&apos;ya göç etmek, çalışmak
              veya eğitim almak isteyenlere uçtan uca, güvenilir ve şeffaf vize
              danışmanlığı sunuyoruz.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Ana içerik */}
      <section className="section-surface">
        <div className="site-container">
          <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <RevealOnScroll>
              <article className="panel space-y-4 p-6 text-sm leading-relaxed text-slate-800 md:p-8 md:text-base">
                <p className="font-semibold text-brand-dark">
                  Almanya Vize Rehberi olarak, uzun yıllardır Avrupa&apos;da
                  yaşayan ve Almanya ile Finlandiya&apos;da ekibi olan bir
                  organizasyonuz. Ekibimiz, geçmiş iş tecrübelerinde sayısız
                  aileye Almanya ve Avrupa&apos;nın farklı ülkelerine göç
                  etmeleri konusunda danışmanlık hizmeti vermiş, bu alanda derin
                  bilgi ve deneyim kazanmıştır.
                </p>
                <p>
                  Bugüne kadar edindiğimiz tüm tecrübeleri Almanya Vize Rehberi
                  çatısı altında birleştirerek güçlü ve yetkin bir ekip
                  oluşturduk. Her danışanımız için en uygun vize türünü
                  belirleyip, başvurunun ilk adımından Almanya&apos;ya yerleşme
                  sürecine kadar tüm aşamalarda yanlarında oluyoruz.
                </p>
                <p>
                  Hedefimiz, danışanlarımızın Almanya&apos;ya göç süreçlerini
                  mümkün olan en sorunsuz şekilde tamamlamalarını sağlamak.
                  Danışmanlık hizmetlerimiz; kişiye özel vize başvuru süreci
                  yönetimi, gerekli belgelerin hazırlanması, randevu süreçleri
                  ve Almanya&apos;da yaşam / entegrasyon konularında rehberliği
                  kapsayan geniş bir yelpazeye sahiptir.
                </p>
              </article>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <aside className="panel space-y-4 p-6 md:p-8">
                <h2 className="text-lg font-semibold text-brand-dark md:text-xl">
                  Danışmanlık Yaklaşımımız
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-800 md:text-base">
                  <li>
                    • Her başvuruyu, danışanımızın mesleği, aile durumu ve hedef
                    planına göre bireysel olarak değerlendiriyoruz.
                  </li>
                  <li>
                    • Tüm süreç boyunca hangi adımda olduğunuzu ve sırada ne
                    olduğunu şeffaf şekilde paylaşıyoruz.
                  </li>
                  <li>
                    • Başvuru sonrasında da Almanya&apos;ya uyum sürecinizde
                    ihtiyaç duyduğunuz konularda yanınızda olmaya devam ediyoruz.
                  </li>
                </ul>
              </aside>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Vizyon, misyon, neden biz, gelecek planları */}
      <section className="section-white">
        <div className="site-container">
          <RevealOnScroll className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-white/20 bg-white/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-base shadow-sm">
              Değerlerimiz
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white drop-shadow-sm md:text-3xl">
              Vizyonumuz, Misyonumuz ve Yaklaşımımız
            </h2>
          </RevealOnScroll>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <RevealOnScroll>
              <div className="interactive-panel h-full p-6">
                <h3 className="text-lg font-semibold text-brand-dark">
                  Vizyonumuz
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-800 md:text-base">
                  Almanya&apos;ya göç etmek isteyenlere en doğru ve hızlı şekilde
                  yardım ederek, yeni bir hayata güvenle adım atmalarını
                  sağlamak; Almanya vize ve göç danışmanlığında güvenilen ilk
                  adres olmak.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.05}>
              <div className="interactive-panel h-full p-6">
                <h3 className="text-lg font-semibold text-brand-dark">
                  Misyonumuz
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-800 md:text-base">
                  Güncel yasa ve prosedürler konusundaki uzmanlığımızla,
                  danışanlarımıza güvenilir, profesyonel ve kişiselleştirilmiş
                  çözümler sunmak; her başvuruyu kendi dosyanız gibi titizlikle
                  ele almak.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="interactive-panel h-full p-6">
                <h3 className="text-lg font-semibold text-brand-dark">
                  Neden Biz?
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-800 md:text-base">
                  <li>• Deneyimli ve alanında uzman ekip</li>
                  <li>• Kişiye özel strateji ve başvuru dosyaları</li>
                  <li>• Güncel yasa ve prosedürlere hâkimiyet</li>
                  <li>• Göç öncesi ve sonrası kapsayıcı danışmanlık</li>
                </ul>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <div className="interactive-panel h-full p-6">
                <h3 className="text-lg font-semibold text-brand-dark">
                  Geleceğe Yönelik Planlarımız
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-800 md:text-base">
                  Hizmetlerimizi sürekli geliştirerek online danışmanlık
                  seansları, interaktif vize rehberleri ve Almanya&apos;da yaşam
                  konusunda kapsamlı içeriklerle danışanlarımıza daha fazla
                  değer sunmayı hedefliyoruz.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll className="mt-10 text-center">
            <p className="text-sm text-white/86 drop-shadow-sm md:text-base">
              Hayallerinizi gerçeğe dönüştürmek için yanınızdayız. Almanya&apos;daki
              yeni hayatınıza giden yolculukta size rehberlik etmekten mutluluk
              duyarız.
            </p>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
