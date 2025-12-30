import type { Metadata } from 'next';

import { getPageBySlug } from '@/lib/content/pages';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

const page = getPageBySlug('hakkimizda');

export const metadata: Metadata = {
  title: page.seoTitle || page.title,
  description: page.seoDescription || '',
};

export default function HakkimizdaPage() {
  return (
    <main className="bg-surface-main">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_#020617_95%)] py-16 text-surface-main">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 font-heading">
              Hakkımızda
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {page.title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-surface-main/80 md:text-base">
              Almanya Vize Rehberi olarak, Almanya&apos;ya göç etmek, çalışmak
              veya eğitim almak isteyenlere uçtan uca, güvenilir ve şeffaf vize
              danışmanlığı sunuyoruz.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Ana içerik */}
      <section className="bg-surface-soft py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <RevealOnScroll>
              <article className="space-y-4 rounded-3xl border border-border-subtle bg-surface-main p-6 text-sm leading-relaxed text-slate-800 md:p-8 md:text-base">
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
              <aside className="space-y-4 rounded-3xl border border-border-subtle bg-surface-main p-6 shadow-soft md:p-8">
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
      <section className="bg-surface-main py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-base">
              Değerlerimiz
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-brand-dark md:text-3xl">
              Vizyonumuz, Misyonumuz ve Yaklaşımımız
            </h2>
          </RevealOnScroll>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <RevealOnScroll>
              <div className="h-full rounded-3xl border border-border-subtle bg-surface-soft p-6">
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
              <div className="h-full rounded-3xl border border-border-subtle bg-surface-soft p-6">
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
              <div className="h-full rounded-3xl border border-border-subtle bg-surface-soft p-6">
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
              <div className="h-full rounded-3xl border border-border-subtle bg-surface-soft p-6">
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
            <p className="text-sm text-slate-700 md:text-base">
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


