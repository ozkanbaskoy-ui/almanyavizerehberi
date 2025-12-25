import type { Metadata } from 'next';

import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { Breadcrumb } from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Almanya AB Mavi Kart Nedir ve Nasıl Alınır? - Almanya Vize Rehberi',
  description:
    "Almanya AB Mavi Kart’ın ne olduğunu, kimlerin başvurabileceğini, başvuru şartlarını ve sağladığı oturma, çalışma ve uzun vadeli ikamet avantajlarını açıklıyoruz.",
};

export default function Blog2Page() {
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
                { label: 'Almanya AB Mavi Kart Nedir ve Nasıl Alınır?' },
              ]}
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 md:text-sm">
              Blog Yazısı
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Almanya AB Mavi Kart Nedir ve Nasıl Alınır?
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-surface-main/80 md:text-base">
              AB Mavi Kart, Avrupa Birliği tarafından yüksek vasıflı göçmenlerin
              AB ülkelerinde çalışmasını teşvik eden bir oturma ve çalışma
              iznidir. Özellikle Almanya, bu kartla nitelikli iş gücünü
              çekmeyi hedeflemektedir. Mavi Kart, başta mühendislik, bilişim,
              sağlık ve bilim alanlarında uzmanlaşmış profesyonellere
              yöneliktir ve Almanya’da uzun vadeli bir kariyer ve yaşam
              fırsatı sunar.
            </p>
            <p className="mt-3 text-xs text-surface-main/70 md:text-sm">
              Yayın tarihi:{' '}
              <time dateTime="2024-05-17 13:28:06">2024-05-17 13:28:06</time>
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* İçerik */}
      <section className="bg-surface-soft py-12">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll>
            <article className="rounded-3xl border border-border-subtle bg-surface-main p-6 text-sm leading-relaxed text-slate-800 shadow-soft md:p-8 md:text-base">
              <h2 className="text-xl font-semibold text-brand-dark">
                Mavi Kart Nedir?
              </h2>
              <p className="mt-3">
                AB Mavi Kart, yüksek vasıflı göçmenlerin Avrupa’da çalışmasını
                sağlayan bir oturma ve çalışma iznidir. 2012 yılında yürürlüğe
                giren bu kart, Almanya gibi AB ülkelerinde nitelikli iş
                gücünün serbest dolaşımını teşvik eder. Mavi Kart sahipleri,
                belirli şartları yerine getirdiklerinde, Almanya’da ve diğer AB
                ülkelerinde çalışma hakkı kazanır.
              </p>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                Kimler Başvurabilir?
              </h2>
              <p className="mt-3">
                Mavi Kart’a başvurmak isteyenlerin belirli kriterleri
                karşılaması gerekmektedir:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Yükseköğrenim diploması:</strong> Almanya tarafından
                  tanınan bir yükseköğrenim diplomasına sahip olmalısınız.
                  Diplomalarınızın denkliğini ANABIN veritabanından kontrol
                  edebilirsiniz.
                </li>
                <li>
                  <strong>İş teklifi:</strong> Almanya’da bir işverenden
                  alınmış iş teklifi ve belirli bir asgari maaş (2024 yılı
                  itibarıyla brüt 58.400 Euro) gereklidir. Mühendislik, bilişim
                  ve tıp gibi meslekler için bu asgari maaş 45.552 Euro’dur.
                </li>
                <li>
                  <strong>Mesleki deneyim:</strong> İlgili alanda iş deneyimi
                  önemli bir kriterdir.
                </li>
                <li>
                  <strong>Dil yeterliliği:</strong> Almanca veya İngilizce dil
                  yeterliliği, iş bulma ve Almanya’da yaşama süreçlerinde büyük
                  avantaj sağlar.
                </li>
              </ul>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                Mavi Kartın Avantajları
              </h2>
              <p className="mt-3">
                Mavi Kart sahiplerine sunulan başlıca avantajlar şunlardır:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Oturma ve çalışma izni:</strong> Almanya’da yaşama ve
                  çalışma hakkı.
                </li>
                <li>
                  <strong>Aile birleşimi:</strong> Eş ve çocukların Almanya’ya
                  gelme ve çalışma hakkı. Eşlerden dil yeterliliği istenmez.
                </li>
                <li>
                  <strong>Uzun vadeli ikamet:</strong> 33 ay sonra süresiz
                  oturma izni başvurusunda bulunma hakkı. Almanca B1 seviyesinde
                  dil bilgisine sahip olanlar için bu süre 21 aya iner.
                </li>
                <li>
                  <strong>AB ülkelerinde hareketlilik:</strong> Diğer AB
                  ülkelerinde çalışma ve yaşama imkanı.
                </li>
                <li>
                  <strong>Sosyal güvence:</strong> Sağlık sigortası,
                  emeklilik ve işsizlik sigortası gibi sosyal haklardan
                  faydalanma imkanı.
                </li>
              </ul>

              <p className="mt-4">
                AB Mavi Kart, yüksek vasıflı profesyonellerin Almanya’da kariyer
                yapmalarını ve yeni bir yaşam kurmalarını sağlayan önemli bir
                fırsattır. Bu kart, Almanya’nın ihtiyaç duyduğu nitelikli iş
                gücünü çekmeyi hedeflerken, göçmenlere de Avrupa’nın kalbinde
                yeni bir hayat sunar.
              </p>
            </article>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}

