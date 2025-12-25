import type { Metadata } from 'next';

import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { Breadcrumb } from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Almanya’da Yaşam Maliyetleri - Almanya Vize Rehberi',
  description:
    'Almanya’da konaklama, ulaşım, gıda, eğitim ve sağlık gibi temel kalemler üzerinden yaşam maliyetlerini anlatan rehber yazı.',
};

export default function Blog4Page() {
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
                { label: 'Almanya’da Yaşam Maliyetleri' },
              ]}
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 md:text-sm">
              Blog Yazısı
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Almanya’da Yaşam Maliyetleri
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-surface-main/80 md:text-base">
              Almanya, yüksek yaşam standartları ve güçlü ekonomisiyle,
              uluslararası öğrencilerden profesyonellere kadar geniş bir kitle
              için cazip bir destinasyon haline gelmiştir. Ancak, Almanya&apos;da
              yaşamak belirli maliyetleri de beraberinde getirir. Bu yazıda,
              Almanya’daki yaşam maliyetlerini konaklama, ulaşım, gıda, eğitim ve
              sağlık gibi temel başlıklar altında inceliyoruz.
            </p>
            <p className="mt-3 text-xs text-surface-main/70 md:text-sm">
              Yayın tarihi:{' '}
              <time dateTime="2024-06-25 14:45:42">2024-06-25 14:45:42</time>
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
                Almanya, yüksek yaşam standartları ve güçlü ekonomisiyle,
                uluslararası öğrencilerden profesyonellere kadar geniş bir kitle
                için cazip bir destinasyon haline gelmiştir. Ancak, Almanya&apos;da
                yaşamak belirli maliyetleri de beraberinde getirir. Bu blog
                yazısında, Almanya’daki yaşam maliyetlerini konaklama, ulaşım,
                gıda, eğitim ve sağlık gibi temel başlıklar altında detaylı
                olarak ele alacağız.
              </p>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                1. Konaklama Maliyetleri
              </h2>
              <p className="mt-3">
                Konaklama, Almanya&apos;da yaşam maliyetlerinin en büyük
                kalemlerinden biridir. Konaklama maliyetleri, şehirden şehire
                önemli ölçüde farklılık gösterebilir. Özellikle Münih, Frankfurt,
                Stuttgart ve Hamburg gibi büyük şehirlerde kiralar oldukça
                yüksektir. Daha küçük şehirlerde ve kırsal bölgelerde ise kiralar
                daha uygun olabilir.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Münih:</strong> Şehir merkezinde 1 odalı bir dairenin
                  kirası 1.200–1.500 Euro arasında değişebilir. Şehir merkezinin
                  dışında ise bu maliyet 900–1.200 Euro arasına düşer.
                </li>
                <li>
                  <strong>Berlin:</strong> Berlin, diğer büyük şehirlere kıyasla
                  daha uygun fiyatlıdır. Şehir merkezinde 1 odalı bir dairenin
                  kirası 900–1.300 Euro arasında, şehir dışında ise 700–1.000
                  Euro civarındadır.
                </li>
                <li>
                  <strong>Köln:</strong> Şehir merkezinde kiralar 900–1.200 Euro
                  arasında değişirken, şehir dışında bu rakam 700–900 Euro’ya
                  düşebilir.
                </li>
              </ul>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                2. Ulaşım Maliyetleri
              </h2>
              <p className="mt-3">
                Almanya’da ulaşım sistemi oldukça gelişmiştir ve toplu taşıma
                yaygın olarak kullanılır. Toplu taşıma maliyetleri şehirden
                şehire değişiklik gösterse de, aylık toplu taşıma bileti
                genellikle 60–100 Euro arasında değişir. 2023 yılında tanıtılan
                Deutschland Ticket ile aylık 49 Euro karşılığında tüm Almanya’da
                geçerli olan bir bilet kullanabilirsiniz. Bu, Almanya içinde
                şehirlerarası ulaşımı da kapsayan oldukça ekonomik bir
                seçenektir.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Toplu Taşıma Kartı (Deutschland Ticket):</strong> Aylık
                  49 Euro.
                </li>
                <li>
                  <strong>Bisiklet kullanımı:</strong> Almanya’da bisiklet
                  kullanımı oldukça yaygındır. İyi bir ikinci el bisiklet
                  100–300 Euro arasında satın alınabilir.
                </li>
                <li>
                  <strong>Araba kullanımı:</strong> Almanya’da araba sahiplenmenin
                  maliyeti, yakıt fiyatları ve sigorta masraflarıyla birlikte
                  düşünüldüğünde yıllık ortalama 1.000–2.000 Euro arasında
                  değişir.
                </li>
              </ul>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                3. Gıda ve Market Alışverişi
              </h2>
              <p className="mt-3">
                Gıda maliyetleri Almanya&apos;da genellikle uygun seviyededir.
                Market alışverişleri için Lidl, Aldi ve Netto gibi indirimli
                market zincirleri popülerdir. Aylık gıda masrafı, yaşam tarzına
                bağlı olarak 150–350 Euro arasında değişebilir. Restoranlarda
                yemek yeme maliyeti ise daha pahalıdır; özellikle büyük
                şehirlerde bir restoranda yemek yemek kişi başı 10–30 Euro
                arasında olabilir.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Market alışverişi:</strong> Aylık 150–350 Euro.
                </li>
                <li>
                  <strong>Restoranlarda yemek:</strong> Kişi başı 10–30 Euro.
                </li>
                <li>
                  <strong>Yerel ürünler:</strong> Market alışverişinde yerel ve
                  mevsimsel ürünler tercih ederek maliyetlerinizi
                  düşürebilirsiniz.
                </li>
              </ul>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                4. Eğitim Maliyetleri
              </h2>
              <p className="mt-3">
                Almanya, yüksek kaliteli ve genellikle ücretsiz üniversite
                eğitimi sunmasıyla tanınır. Almanya’daki devlet üniversitelerinde
                öğrenim harçları yoktur veya çok düşüktür. Ancak her dönem
                alınan harç (Semesterbeitrag) ücretleri, öğrencilere toplu
                taşıma biletini de kapsayan 150–350 Euro arasında değişen bir
                maliyet getirebilir. Özel üniversiteler ise daha pahalıdır;
                yıllık öğrenim ücretleri 10.000 Euro’ya kadar çıkabilir.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Devlet üniversiteleri:</strong> Dönemlik harç
                  150–350 Euro.
                </li>
                <li>
                  <strong>Özel üniversiteler:</strong> Yıllık 10.000 Euro’ya
                  kadar öğrenim ücreti.
                </li>
                <li>
                  <strong>Dil kursları:</strong> Almanya’da Almanca dil
                  kursları için aylık 200–500 Euro arasında bir bütçe ayırmanız
                  gerekebilir.
                </li>
              </ul>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                5. Sağlık Sigortası
              </h2>
              <p className="mt-3">
                Almanya’da herkesin sağlık sigortası yaptırması zorunludur.
                Devlet sağlık sigortası (GKV) sistemi oldukça yaygındır ve
                özellikle öğrenciler için aylık yaklaşık 110 Euro gibi bir
                maliyet söz konusudur. Çalışanlar için ise bu primler, brüt
                maaşın %14,6’sı kadar olup, işverenle paylaşılan bir
                maliyettir. Özel sağlık sigortası seçenekleri de mevcuttur ve
                bu seçenekler daha esnek planlar sunabilir; ancak maliyetleri
                daha yüksek olabilir.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Öğrenci sağlık sigortası:</strong> Aylık yaklaşık
                  110 Euro.
                </li>
                <li>
                  <strong>Çalışanlar için sigorta primleri:</strong> Brüt
                  maaşın %14,6’sı.
                </li>
                <li>
                  <strong>Özel sağlık sigortası:</strong> Bireysel
                  ihtiyaçlara göre değişken maliyetler.
                </li>
              </ul>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                6. Diğer Yaşam Maliyetleri
              </h2>
              <p className="mt-3">
                Almanya&apos;daki diğer yaşam maliyetleri arasında iletişim,
                internet, eğlence ve spor gibi masraflar da yer alır. İnternet
                ve mobil telefon hattı için aylık ortalama 30–50 Euro arasında
                bir bütçe ayırmanız gerekebilir. Spor salonu üyeliği için ise
                aylık 20–50 Euro ödemeniz gerekebilir. Ayrıca, sinema bileti,
                konser gibi etkinlikler için de ayda 50–100 Euro arasında bir
                harcama yapabilirsiniz.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>İnternet ve telefon:</strong> Aylık 30–50 Euro.
                </li>
                <li>
                  <strong>Spor salonu üyeliği:</strong> Aylık 20–50 Euro.
                </li>
                <li>
                  <strong>Eğlence ve kültürel etkinlikler:</strong> Aylık
                  50–100 Euro.
                </li>
              </ul>

              <h2 className="mt-8 text-xl font-semibold text-brand-dark">
                Genel Değerlendirme
              </h2>
              <p className="mt-3">
                Almanya’da yaşam maliyetleri, genel olarak Avrupa’nın diğer
                ülkelerine kıyasla orta seviyede kabul edilir. Konaklama,
                ulaşım, gıda, eğitim ve sağlık gibi temel giderler, kişisel
                tercihlere ve yaşam tarzına bağlı olarak değişiklik
                gösterebilir. Ancak planlı bir bütçe ile Almanya’da yaşamak
                oldukça rahat ve keyifli olabilir. Almanya’nın sunduğu yüksek
                yaşam standartları ve geniş kariyer fırsatları, bu maliyetleri
                dengeleyen önemli faktörlerdir.
              </p>
            </article>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}

