const fs = require('fs');
const path = require('path');

// Sorumluluk Reddi metnini modern, sade HTML'e çevirir.
const newBodyHtml = `
<h2>Sorumluluk Reddi</h2>

<p>
  Bu Sorumluluk Reddi, AVR Global Oy’ye ait olan ve
  <a href="https://almanyavizerehberi.com" target="_blank" rel="noreferrer">
    https://almanyavizerehberi.com
  </a>
  internet sitesi üzerinden hizmet veren Almanya Vize Rehberi için geçerlidir.
  Web sitemizi kullanarak, aşağıdaki şartları kabul etmiş olursunuz.
</p>

<h3>1. Genel Bilgiler</h3>

<p>
  Almanya Vize Rehberi, Almanya'ya vize başvurusu yapmak isteyen kişilere
  bilgi ve danışmanlık hizmetleri sunar. Web sitemizde yer alan bilgiler,
  genel bilgilendirme amacı taşımaktadır ve hukuki, mali veya profesyonel
  tavsiye niteliği taşımaz.
</p>

<h3>2. Bilgilerin Doğruluğu ve Güncelliği</h3>

<p>
  Web sitemizde sunulan bilgilerin doğruluğunu ve güncelliğini sağlamak için
  çaba gösteriyoruz. Ancak, web sitemizdeki bilgilerin hatasız, eksiksiz veya
  güncel olduğunu garanti etmiyoruz. Almanya Vize Rehberi, web sitesinde yer
  alan bilgilerin kullanımından doğabilecek herhangi bir zarardan sorumlu
  değildir.
</p>

<h3>3. Üçüncü Taraf Bağlantıları</h3>

<p>
  Web sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu
  bağlantılar, kullanıcılarımıza kolaylık sağlamak amacıyla sunulmaktadır.
  AVR Global Oy, bu üçüncü taraf sitelerin içerikleri veya gizlilik politikaları
  üzerinde herhangi bir kontrol sahibi değildir ve bu sitelerin kullanımından
  doğabilecek zararlardan sorumlu değildir. Üçüncü taraf sitelere erişim
  sağlarken, ilgili sitelerin kullanım şartlarını ve gizlilik politikalarını
  gözden geçirmenizi öneririz.
</p>

<h3>4. Hizmetlerin Sorumluluğu</h3>

<p>
  Almanya Vize Rehberi, sunduğu hizmetlerin doğruluğu ve güvenilirliği
  konusunda azami özeni göstermektedir. Ancak, verilen hizmetlerin
  kullanımından doğabilecek herhangi bir zarar veya kayıptan sorumlu
  değildir. Kullanıcılar, hizmetleri kendi sorumlulukları dahilinde
  kullanmaktadır.
</p>

<h3>5. Teknik Sorunlar</h3>

<p>
  Web sitemizin kesintisiz ve hatasız çalışması için çaba sarf ediyoruz.
  Ancak, teknik sorunlar, bakım çalışmaları veya internet bağlantısından
  kaynaklanabilecek kesintiler nedeniyle web sitemizin kullanımında
  aksaklıklar yaşanabilir. AVR Global Oy, web sitesinin kesintisiz
  çalışmasını garanti etmez ve bu tür kesintilerden doğabilecek
  zararlardan sorumlu değildir.
</p>

<h3>6. Yasal Sorumluluk</h3>

<p>
  Web sitemizi kullanarak, bu Sorumluluk Reddi'ni kabul etmiş olursunuz.
  Almanya Vize Rehberi ve AVR Global Oy, yasaların izin verdiği en geniş
  ölçüde, web sitesinin kullanımından doğabilecek doğrudan, dolaylı,
  tesadüfi, özel veya sonuç olarak ortaya çıkan zararlar için sorumluluk
  kabul etmez.
</p>

<h3>7. Değişiklikler</h3>

<p>
  AVR Global Oy, bu Sorumluluk Reddi'ni herhangi bir zamanda değiştirme
  hakkını saklı tutar. Değişiklikler web sitemizde yayınlanacak ve
  kullanıcılarımız güncellenen metin hakkında bilgilendirilecektir.
  Sorumluluk Reddi metnimizi düzenli olarak gözden geçirmenizi öneririz.
</p>

<h3>8. İletişim Bilgileri</h3>

<p>
  Bu Sorumluluk Reddi ile ilgili herhangi bir sorunuz varsa, lütfen
  bizimle
  <a href="mailto:info@almanyavizerehberi.com">
    info@almanyavizerehberi.com
  </a>
  adresi üzerinden iletişime geçin.
</p>
`.trim();

function updateSorumlulukReddiBody() {
  const filePath = path.join(
    process.cwd(),
    'content',
    'pages',
    'sorumluluk-reddi.json',
  );
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  json.bodyHtml = newBodyHtml;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log('Updated bodyHtml for sorumluluk-reddi.json');
}

updateSorumlulukReddiBody();

