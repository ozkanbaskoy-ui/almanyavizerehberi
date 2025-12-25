import type { Metadata } from 'next';

import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { Breadcrumb } from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Almanya Fırsat Kartı Nedir? - Almanya Vize Rehberi',
  description:
    "Almanya Fırsat Kartı (Chancenkarte) programının ne olduğunu, kimlerin başvurabileceğini, puanlama sistemini, başvuru sürecini ve sunduğu çalışma ile yaşam avantajlarını anlatıyoruz.",
};

export default function Blog1Page() {
  return (
    <main className="bg-surface-main">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_#020617_95%)] py-12 text-surface-main">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll>
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/index.php' },
                { label: 'Blog', href: '/blog.php' },
                { label: 'Almanya Fırsat Kartı Nedir?' },
              ]}
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 md:text-sm">
              Blog Yazısı
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Almanya Fırsat Kartı Nedir?
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-surface-main/80 md:text-base">
              Almanya, demografik değişikliklere uyum sağlamak ve iş gücü açığını kapatmak amacıyla
              Fırsat Kartı (Chancenkarte) programını hayata geçirdi. Bu kart, Almanya&apos;da çalışmak
              ve yaşamak isteyen nitelikli göçmenlere yeni imkanlar sunuyor.
            </p>
            <p className="mt-3 text-xs text-surface-main/70 md:text-sm">
              Yayın tarihi:{' '}
              <time dateTime="2024-04-15 16:41:32">2024-04-15 16:41:32</time>
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* İçerik */}
      <section className="bg-surface-soft py-12">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll>
            <article className="rounded-3xl border border-border-subtle bg-surface-main p-6 text-sm leading-relaxed text-slate-800 shadow-soft md:p-8 md:text-base">
              <p>
                Almanya, demografik değişikliklere uyum sağlamak ve iş gücü açığını kapatmak için
                &quot;Fırsat Kartı&quot; (Chancenkarte) programını başlattı. Bu kart, Almanya&apos;da
                çalışmak ve yaşamak isteyen nitelikli göçmenlere fırsatlar sunuyor.
              </p>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">Kimler Başvurabilir?</h2>
              <p className="mt-3">
                Başvuru kriterleri arasında yükseköğrenim diploması, mesleki deneyim, dil
                yeterliliği (Almanca veya İngilizce), yaş ve Almanya&apos;da önceden bulunma yer alır.
                Başvuru süreci ise online başvuru, belgelerin sunulması ve puanlama ile
                değerlendirilir.
              </p>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">Avantajlar</h2>
              <p className="mt-3">
                Fırsat Kartı sahipleri, Almanya&apos;da uzun vadeli çalışma ve yaşama imkanına sahip
                olurken, aile birleşimi ve eğitim fırsatlarından da yararlanabilirler.
              </p>

              <p className="mt-4">
                Almanya Fırsat Kartı programı, nitelikli göçmenler için Almanya&apos;da çalışma ve
                yaşam fırsatları sunan yenilikçi bir göçmenlik programıdır. Bu program, puan bazlı
                bir sistemle adayların niteliklerini değerlendirir ve uygun adaylara Almanya&apos;da
                yerleşim ve istihdam imkanı tanır. Fırsat Kartı, Almanya&apos;da iş gücü açığını
                kapatmak ve ülkenin ekonomik büyümesine katkıda bulunmak amacıyla tasarlanmıştır.
              </p>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                Kriterler ve Başvuru Süreci
              </h2>
              <p className="mt-3">
                Fırsat Kartı&apos;na başvurabilmek için adayların belirli kriterleri karşılaması
                gerekmektedir. Bu kriterler, adayların puan kazanabileceği farklı kategorilerden
                oluşur:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Eğitim durumu:</strong> Adayların yükseköğrenim diplomasına sahip olmaları
                  veya mesleki eğitimlerini tamamlamış olmaları gerekmektedir.
                </li>
                <li>
                  <strong>Mesleki deneyim:</strong> İş deneyimi, adayların puan kazanmasına yardımcı
                  olan önemli bir faktördür.
                </li>
                <li>
                  <strong>Dil yeterliliği:</strong> Almanca veya İngilizce dil yeterliliği, adayların
                  puan kazanmasını sağlayan önemli kriterlerden biridir.
                </li>
                <li>
                  <strong>Yaş:</strong> Genç adaylar, özellikle 35 yaşın altındakiler, daha fazla
                  puan kazanma şansına sahiptir.
                </li>
                <li>
                  <strong>Almanya&apos;da önceden bulunma:</strong> Almanya&apos;da daha önce bulunmuş
                  veya çalışmış olmak da ek puan kazandırabilir.
                </li>
                <li>
                  <strong>Aile bağlantıları:</strong> Almanya&apos;da yaşayan aile bireylerinin olması
                  da ek puan kazandıran faktörlerden biridir.
                </li>
              </ul>

              <p className="mt-4">
                Başvuru süreci ise online başvuru, belgelerin sunulması ve puanlama ile değerlendirilir.
                Değerlendirme sonucunda uygun bulunan adaylar, Almanya konsoloslukları aracılığıyla
                vize başvurusunda bulunabilirler. Fırsat Kartı sahipleri, Almanya&apos;da uzun vadeli
                çalışma ve yaşama imkanına sahip olurken, aile birleşimi ve eğitim fırsatlarından da
                yararlanabilirler.
              </p>

              <p className="mt-4">
                Fırsat Kartı, Almanya&apos;ya göç etmek isteyen nitelikli kişiler için birçok avantaj
                sunmaktadır. Bu kart, puan bazlı bir sistemle başvuru sürecini daha şeffaf ve hızlı
                hale getirirken, Almanya&apos;da farklı sektörlerde ve mesleklerde iş bulma şansı
                sunmaktadır.
              </p>

              <p className="mt-4">
                Bu blog yazısında, Almanya Fırsat Kartı hakkında en güncel bilgileri, başvuru
                sürecini ve avantajlarını detaylı bir şekilde ele aldık. Almanya&apos;ya göç etmeyi
                planlayanlar için bu fırsatı değerlendirmek, kariyerlerini ve yaşamlarını yeniden
                şekillendirmek için önemli bir adım olabilir.
              </p>
            </article>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}

