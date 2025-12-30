const fs = require('fs');
const path = require('path');

// Yeni Çerez Politikası içeriğini modern tasarıma uygun sade HTML olarak tanımlar.
// Bu içerik app/cerezler/page.tsx içindeki <article className="prose ..."> alanında gösterilecek.
const newBodyHtml = `
<h2>Çerez Politikası</h2>

<p>
  Bu Çerez Politikası, AVR Global Oy’ye ait olan ve
  <a href="https://almanyavizerehberi.com" target="_blank" rel="noreferrer">
    https://almanyavizerehberi.com
  </a>
  internet sitesi üzerinden hizmet veren Almanya Vize Rehberi'nin çerez
  kullanımına ilişkin bilgilerini içermektedir. Bu politika, hangi tür
  çerezlerin kullanıldığını, bu çerezlerin nasıl kullanıldığını ve
  kullanıcıların çerez tercihlerini nasıl yönetebileceğini açıklar.
</p>

<h3>1. Çerez Nedir?</h3>

<p>
  Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız tarafından
  bilgisayarınıza veya mobil cihazınıza depolanan küçük metin dosyalarıdır.
  Çerezler, web sitesinde gezinme deneyiminizi iyileştirmek, siteyi daha
  verimli hale getirmek ve belirli işlevsellikleri sağlamak için kullanılır.
</p>

<h3>2. Hangi Tür Çerezler Kullanılmaktadır?</h3>

<ul>
  <li>
    <strong>a. Zorunlu Çerezler:</strong>
    Bu çerezler, web sitesinin düzgün çalışabilmesi için gereklidir ve
    sistemlerimizde kapatılamaz. Genellikle yalnızca gizlilik tercihlerinizi
    ayarlamak, oturum açmak veya formları doldurmak gibi hizmet taleplerinize
    yanıt vermek amacıyla ayarlanır.
  </li>
  <li>
    <strong>b. Performans Çerezleri:</strong>
    Bu çerezler, ziyaretçilerin web sitemizi nasıl kullandıkları hakkında
    bilgi toplar. Örneğin, hangi sayfaların en sık ziyaret edildiğini ve
    ziyaretçilerin web sayfalarından hata mesajları alıp almadıklarını
    anlamamıza yardımcı olur. Bu çerezler, web sitemizin performansını
    analiz etmemize ve iyileştirmeler yapmamıza katkı sağlar.
  </li>
  <li>
    <strong>c. Fonksiyonel Çerezler:</strong>
    Bu çerezler, web sitemizin gelişmiş işlevsellik ve kişiselleştirme
    sağlaması için kullanılır. Bu çerezler bizim tarafımızdan veya
    hizmetlerimizi sayfalarımıza eklediğimiz üçüncü taraf sağlayıcılar
    tarafından ayarlanabilir.
  </li>
  <li>
    <strong>d. Hedefleme / Reklam Çerezleri:</strong>
    Bu çerezler, ilgi alanlarınıza daha uygun reklamlar sunmak amacıyla
    kullanılır. Reklam verenlerin, bir kullanıcının belirli bir reklamı
    görme sayısını sınırlamasına ve reklam kampanyalarının etkinliğini
    ölçmesine olanak tanır. Bu çerezler genellikle, web sitesi
    operatörünün izniyle reklam ağları tarafından yerleştirilir.
  </li>
</ul>

<h3>3. Çerezler Nasıl Kullanılmaktadır?</h3>

<p>Çerezler, aşağıdaki amaçlarla kullanılmaktadır:</p>

<ul>
  <li>Web sitesinin temel işlevlerini gerçekleştirmek,</li>
  <li>Web sitesinin performansını analiz etmek ve iyileştirmek,</li>
  <li>Kullanıcı deneyimini geliştirmek ve kişiselleştirmek,</li>
  <li>
    İlgi alanlarına yönelik reklamlar sunmak ve reklam kampanyalarının
    etkinliğini ölçmek.
  </li>
</ul>

<h3>4. Çerez Tercihleri Nasıl Yönetilir?</h3>

<p>
  Çoğu web tarayıcısı, çerezleri otomatik olarak kabul eder. Ancak,
  tarayıcınızın ayarlarını değiştirerek çerezleri devre dışı bırakabilir
  veya çerezler kaydedilmeden önce uyarı alabilirsiniz. Çerez ayarlarınızı
  değiştirmek için tarayıcınızın yardım menüsüne başvurabilirsiniz.
</p>

<p>
  Çerezleri devre dışı bırakmanız durumunda, web sitemizin bazı
  işlevlerinin düzgün çalışmayabileceğini lütfen unutmayın.
</p>

<h3>5. Üçüncü Taraf Çerezleri</h3>

<p>
  Web sitemizde, üçüncü taraf hizmet sağlayıcılar tarafından yerleştirilen
  çerezler de kullanılabilir. Bu çerezler, ilgili üçüncü tarafların
  gizlilik politikalarına tabi olup, AVR Global Oy’nin bu çerezler
  üzerinde herhangi bir kontrolü bulunmamaktadır. Üçüncü taraf çerezleri
  hakkında daha fazla bilgi edinmek için ilgili üçüncü tarafın çerez
  politikalarını incelemenizi öneririz.
</p>

<h3>6. Çerez Politikası Güncellemeleri</h3>

<p>
  AVR Global Oy, bu Çerez Politikasını herhangi bir zamanda
  güncelleme hakkını saklı tutar. Politika üzerinde yapılan
  değişiklikler web sitemizde yayınlanacak ve kullanıcılarımız
  güncellemeler hakkında bilgilendirilecektir. Bu nedenle,
  çerez politikamızı düzenli olarak gözden geçirmenizi öneririz.
</p>

<h3>İletişim</h3>

<p>
  Çerez politikamız ile ilgili herhangi bir sorunuz varsa,
  lütfen bizimle
  <a href="mailto:info@almanyavizerehberi.com">
    info@almanyavizerehberi.com
  </a>
  adresi üzerinden iletişime geçin.
</p>
`.trim();

function updateCerezlerBody() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'cerezler.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  json.bodyHtml = newBodyHtml;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log('Updated bodyHtml for cerezler.json');
}

updateCerezlerBody();

