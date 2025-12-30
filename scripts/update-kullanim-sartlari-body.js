const fs = require('fs');
const path = require('path');

// Kullanım Şartları metnini modern, sade HTML'e çevirir.
const newBodyHtml = `
<h2>Kullanım Şartları</h2>

<p>
  Bu Kullanım Şartları, AVR Global Oy’ye ait olan ve
  <a href="https://almanyavizerehberi.com" target="_blank" rel="noreferrer">
    https://almanyavizerehberi.com
  </a>
  internet sitesi üzerinden hizmet veren Almanya Vize Rehberi'nin
  kullanım koşullarını belirlemektedir. Bu siteye erişim sağlayarak
  veya siteyi kullanarak aşağıdaki şartları kabul etmiş olursunuz.
</p>

<h3>1. Kapsam</h3>

<p>
  Bu şartlar, Almanya Vize Rehberi web sitesinin tüm kullanıcıları
  için geçerlidir. Web sitesini kullanarak, bu şartları kabul etmiş
  sayılırsınız. Bu şartları kabul etmiyorsanız, lütfen web sitemizi
  kullanmayınız.
</p>

<h3>2. Hizmetler</h3>

<p>
  Almanya Vize Rehberi, Almanya'ya vize başvurusu yapmak isteyen
  kişilere danışmanlık hizmetleri sunar. Bu hizmetler; danışmanlık,
  bilgi sağlama ve başvuru süreçlerinde rehberlik gibi çeşitli
  hizmetleri kapsar.
</p>

<h3>3. Kullanıcı Yükümlülükleri</h3>

<ul>
  <li>
    Kullanıcılar, web sitesini yalnızca yasal amaçlarla kullanmayı
    kabul eder.
  </li>
  <li>
    Web sitesine zarar verebilecek, işleyişini kesintiye uğratabilecek
    veya diğer kullanıcıların siteyi kullanmasını engelleyebilecek
    herhangi bir faaliyet içinde bulunmamakla yükümlüsünüz.
  </li>
  <li>
    Web sitesinde yer alan bilgileri, AVR Global Oy’nin yazılı izni
    olmadan kopyalamamak, dağıtmamak veya ticari amaçla kullanmamakla
    yükümlüsünüz.
  </li>
  <li>
    Web sitesi aracılığıyla sağladığınız tüm bilgilerin doğru, güncel
    ve eksiksiz olduğunu kabul edersiniz.
  </li>
</ul>

<h3>4. Fikri Mülkiyet Hakları</h3>

<p>
  Web sitesinde yer alan tüm içerik, tasarımlar, grafikler, logolar,
  metinler, görseller ve diğer materyaller AVR Global Oy’ye aittir ve
  telif hakkı ve diğer fikri mülkiyet yasaları tarafından
  korunmaktadır. Bu materyalleri, AVR Global Oy’nin yazılı izni
  olmadan kullanamaz, kopyalayamaz veya dağıtamazsınız.
</p>

<h3>5. Üçüncü Taraf Bağlantıları</h3>

<p>
  Web sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir.
  AVR Global Oy, bu üçüncü taraf sitelerin içerikleri veya gizlilik
  politikaları üzerinde herhangi bir kontrol sahibi değildir ve bu
  sitelerin kullanımından doğabilecek zararlardan sorumlu değildir.
  Üçüncü taraf sitelere erişim sağlarken, ilgili sitelerin kullanım
  şartlarını ve gizlilik politikalarını gözden geçirmenizi öneririz.
</p>

<h3>6. Sorumluluk Reddi</h3>

<p>
  Almanya Vize Rehberi, web sitesindeki bilgilerin doğruluğunu ve
  güncelliğini sağlamak için çaba göstermektedir. Ancak, web
  sitesinde yer alan bilgilerin hatasız veya eksiksiz olduğunu
  garanti etmeyiz. Web sitesinin kullanımından doğabilecek doğrudan,
  dolaylı, tesadüfi, özel veya sonuç olarak ortaya çıkan zararlardan
  dolayı sorumluluk kabul etmeyiz.
</p>

<h3>7. Değişiklikler</h3>

<p>
  AVR Global Oy, bu Kullanım Şartları’nı herhangi bir zamanda
  değiştirme hakkını saklı tutar. Şartlarda yapılan değişiklikler
  web sitemizde yayınlanacak ve kullanıcılarımız güncellenen
  şartlar hakkında bilgilendirilecektir. Kullanım şartlarımızı
  düzenli olarak gözden geçirmenizi öneririz.
</p>

<h3>8. Uygulanabilir Hukuk ve Yargı Yetkisi</h3>

<p>
  Bu Kullanım Şartları, Estonya yasalarına tabi olacaktır. Bu
  şartlardan doğabilecek her türlü uyuşmazlık, Estonya
  mahkemelerinin münhasır yargı yetkisine tabidir.
</p>

<h3>9. İletişim Bilgileri</h3>

<p>
  Bu Kullanım Şartları ile ilgili herhangi bir sorunuz varsa, lütfen
  bizimle
  <a href="mailto:info@almanyavizerehberi.com">
    info@almanyavizerehberi.com
  </a>
  adresi üzerinden iletişime geçin.
</p>
`.trim();

function updateKullanimSartlariBody() {
  const filePath = path.join(
    process.cwd(),
    'content',
    'pages',
    'kullanim-sartlari.json',
  );
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  json.bodyHtml = newBodyHtml;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log('Updated bodyHtml for kullanim-sartlari.json');
}

updateKullanimSartlariBody();

