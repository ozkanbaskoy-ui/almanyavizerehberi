const fs = require('fs');
const path = require('path');

// Yeni KVKK icerigini modern tasarima uygun, sade HTML olarak tanimla.
// Bu icerik app/kvkk/page.tsx icindeki <article class="prose ..."> alaninda gosterilecek.
const newBodyHtml = `
<h2>Kişisel Verilerin Korunması Hakkında Aydınlatma</h2>

<p>
  AVR Global Oy’ye aktarılan kişisel verilerin korunmasına yönelik temel bilgileri
  bu bölümde bulabilirsiniz. AVR Global Oy, 6698 sayılı Kişisel Verilerin Korunması
  Kanunu ("KVKK") madde 10 ve Kişisel Sağlık Verilerinin İşlenmesi ve Mahremiyetinin
  Sağlanması Hakkında Yönetmelik’in 5. maddesi kapsamında aydınlatma yükümlülüğünü
  yerine getirmek amacıyla aşağıdaki açıklamaları müşterilerine ve web sitemizi
  kullanan üçüncü kişilere sunar.
</p>

<h3>1. AVR Global Oy’nin kişisel verileri toplamasının yasal dayanağı nedir?</h3>

<p>
  Kişisel verileriniz KVKK’nın 5/1 ve 5/2 maddelerine dayanarak işlenmektedir.
</p>

<h3>2. AVR Global Oy kişisel verilerin toplanmasında hangi yöntemleri kullanıyor?</h3>

<p>
  Kişisel verileriniz, çağrı merkezimiz ve elektronik ortamda (randevu talep formu,
  iletişim formu vb.) işlem yapan müşterilerimiz tarafından sağlanan veriler
  doğrultusunda, müşterilerimizin rızaları ve mevzuat hükümleri uyarınca
  işlenmektedir.
</p>

<p>
  Belirtmek isteriz ki, AVR Global Oy’ye ait
  <a href="https://almanyavizerehberi.com" target="_blank" rel="noreferrer">
    https://almanyavizerehberi.com
  </a>
  internet sitesi çerez (cookie) kullanmaktadır. Çerez, kullanılan cihazın internet
  tarayıcısına veya sabit diskine depolanarak cihazın tanınmasına olanak tanıyan,
  genellikle harf ve sayılardan oluşan bir dosyadır. Web sitemizde kullanılan
  çerezlerle ilgili detaylı açıklamaları ana sayfamızda bulabilirsiniz.
</p>

<p>
  AVR Global Oy ile paylaşılan kişisel verilerin, doğrudan hizmet alan tarafından
  açık irade ile paylaşılması esastır.
</p>

<h3>3. AVR Global Oy kişisel verileri hangi amaçlarla kullanıyor?</h3>

<p>
  AVR Global Oy, mevzuatın izin verdiği durumlarda ve ölçüde kişisel bilgilerinizi
  kaydedebilir, saklayabilir, güncelleyebilir, üçüncü kişilere açıklayabilir,
  devredebilir, sınıflandırabilir ve işleyebilir.
</p>

<p>Kişisel verileriniz şu amaçlarla kullanılmaktadır:</p>

<ul>
  <li>İşlem yapanın/yaptıranın kimlik bilgilerini doğrulamak,</li>
  <li>İletişim için adres ve diğer gerekli bilgileri kaydetmek,</li>
  <li>
    Hizmet sözleşmesinin şartları veya güncel durumu hakkında
    müşterilerimizle iletişim kurmak,
  </li>
  <li>Sözleşmede meydana gelen değişiklikler hakkında müşterilerimizi bilgilendirmek,</li>
  <li>
    Elektronik (internet/mobil vb.) veya kâğıt ortamında işleme dayanak olacak
    tüm kayıt ve belgeleri düzenlemek,
  </li>
  <li>
    Hizmet sözleşmesi uyarınca üstlenilen yükümlülükleri yerine getirmek,
  </li>
  <li>
    Çalışanlarına (sağlık) sigortası yaptıran kuruluşlara çalışanlarının sigorta
    kullanım bilgilerini iletmek,
  </li>
</ul>

<p>
  Açık rızası bulunan müşterilerimize özel kampanya ve diğer avantajları sunmak,
  her türlü ticari elektronik ve yazılı iletiyi gönderebilmek, elde edilen veriler
  doğrultusunda müşteri segmentasyonu yapmak, anket ve tele satış uygulamaları ile
  veri madenciliği ve diğer istatistiksel analizleri gerçekleştirmek, müşteri veri
  kalitesini artırmak, müşteri yönetimine yönelik sadakat aksiyonları ile çapraz
  satış ve kaybedilen müşteriyi tekrar kazanma aksiyonlarını tasarlamak ve yönetmek
  ve müşterilerimizin bilgileri (demografik, özlük, alışveriş, ziyaret, teklif,
  anket cevapları, sosyal medyadaki bilgileri, sitelerde gezinme, mobil
  uygulamalardaki hareket ve konum bilgileri gibi kanallar aracılığıyla
  toplanacak diğer bilgileri) kullanarak ürün ve hizmetlerimizle ilgili fayda
  ve satış teklifleri sunmak için müşterilerimizle telefon, kısa mesaj, multi mesaj
  (MMS), e-posta, mektup, faks, çerezler aracılığıyla web sayfalarında gösterilen
  mesajlar, mobil uygulamalardaki konum bilgisi ve gönderilen anlık bildirimler
  ve otomatik arama makineleri gibi araçlarla iletişime geçmek,
</p>

<p>
  Ürün ve hizmetlerimiz ile ilgili müşteri şikayet ve önerilerini değerlendirmek,
</p>

<p>
  KVKK’dan doğan yükümlülüklerimizi yerine getirmek ve mevzuattan doğan haklarımızı
  kullanmak.
</p>

<h3>4. AVR Global Oy kişisel verilerinizi nasıl koruyor?</h3>

<p>
  AVR Global Oy ile paylaşılan kişisel veriler, AVR Global Oy’nin gözetimi ve
  kontrolü altındadır. AVR Global Oy, yürürlükteki ilgili mevzuat hükümleri
  gereğince bilginin gizliliğini ve bütünlüğünü koruma amacıyla gerekli
  organizasyonu kurmak ve teknik önlemleri almak konusunda veri sorumlusu
  sıfatıyla sorumludur. Bu yükümlülüğümüzün bilincinde olarak, veri gizliliğini
  konu alan uluslararası ve ulusal teknik standartlara uygun surette veri
  işleme politikalarımızı sürekli güncel tuttuğumuzu bilginize sunarız.
</p>

<h3>5. AVR Global Oy kişisel verilerinizi paylaşıyor mu?</h3>

<p>
  Müşterilerimize ait kişisel verilerin üçüncü kişilerle paylaşımı, müşterilerin
  izni doğrultusunda gerçekleşmekte ve kural olarak müşterinin onayı olmaksızın
  kişisel veriler üçüncü kişilere aktarılmamaktadır.
</p>

<p>
  Ancak, yasal yükümlülüklerimiz çerçevesinde ve bunlarla sınırlı olmak üzere
  mahkemeler ve diğer kamu kurumları ile kişisel veriler paylaşılmaktadır.
  Ayrıca, taahhüt ettiğimiz hizmetleri sağlayabilmek ve verilen hizmetlerin
  kalite kontrolünü yapabilmek amacıyla anlaşmalı üçüncü kişilere kişisel
  veri aktarımı yapılmaktadır.
</p>

<p>
  Üçüncü kişilere veri aktarımı sırasında hak ihlallerini önlemek için gerekli
  teknik ve hukuki önlemler alınmaktadır. Ancak, kişisel verileri alan üçüncü
  kişilerin veri koruma politikaları nedeniyle ve üçüncü kişilerin
  sorumluluğundaki risk alanında meydana gelen ihlallerden AVR Global Oy
  sorumlu değildir.
</p>

<h3>6. AVR Global Oy kişisel verilerinizi yurtdışındaki üçüncü kişilerle paylaşıyor mu?</h3>

<p>
  Kişisel verileriniz AVR Global Oy (AVR Global Oy ve/veya bağlı kuruluşlarını,
  iştiraklerini, ortak teşebbüslerini ve bunların tüm şubeleri ile ofislerini
  ifade eder), vize ve pasaport hizmeti faaliyetlerini yürütebilmek amacıyla
  işbirliği yaptığımız program ortağı kurum ve kuruluşlarla, yurtiçi ve
  yurtdışındaki reasürans şirketleriyle, verilerin bulut ortamında saklanması
  hizmeti aldığımız yurtiçi/yurtdışı kişi ve kurumlarla, müşterilerimize
  gönderdiğimiz ticari elektronik iletilerin gönderilmesi konusunda anlaşmalı
  olduğumuz yurtiçi/yurtdışındaki kuruluşlarla ve sizlere daha iyi hizmet
  sunabilmek ve müşteri memnuniyetini sağlamak amacıyla çeşitli pazarlama
  faaliyetleri kapsamında sigorta şirketleriyle ve yurtiçi/yurtdışı diğer
  üçüncü kişilerle paylaşılabilmektedir.
</p>

<h3>7. Kişisel Verilerin Korunması Kanunu’ndan doğan haklarınız nelerdir?</h3>

<p>
  KVKK uyarınca kişisel verilerinizin:
</p>

<ul>
  <li><strong>a-</strong> İşlenip işlenmediğini öğrenme,</li>
  <li><strong>b-</strong> İşlenmişse bilgi talep etme,</li>
  <li><strong>c-</strong> İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
  <li><strong>d-</strong> Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
  <li><strong>e-</strong> Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
  <li>
    <strong>f-</strong> KVKK’nın 7. maddesinde öngörülen şartlar çerçevesinde
    silinmesini/yok edilmesini isteme,
  </li>
  <li>
    <strong>g-</strong> Aktarıldığı üçüncü kişilere yukarıda sayılan (d) ve (e)
    bentleri uyarınca yapılan işlemlerin bildirilmesini isteme,
  </li>
  <li>
    <strong>h-</strong> Münhasıran otomatik sistemler ile analiz edilmesi
    nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,
  </li>
  <li>
    <strong>i-</strong> KVKK’ya aykırı olarak işlenmesi sebebiyle zarara
    uğramanız hâlinde zararın giderilmesini talep etme
    haklarına sahip olduğunuzu hatırlatmak isteriz.
  </li>
</ul>

<h3>8. Kişisel verilerle ilgili mevzuat değişikliklerinden nasıl haberdar olabilirim?</h3>

<p>
  KVKK uyarınca sahip olduğunuz haklar AVR Global Oy’nin yükümlülükleridir.
  Kişisel verilerinizi bu bilinçle ve mevzuatın gerektirdiği ölçüde işlediğimizi,
  yasal değişikliklerin olması durumunda sayfamızda yer alan bu bilgileri yeni
  mevzuata uygun şekilde güncelleyeceğimizi, yapılan güncellemeleri bu sayfa
  üzerinden her zaman kolaylıkla takip edebileceğinizi size bildirmek isteriz.
</p>

<h3>9. Verinin güncel ve doğru tutulduğundan nasıl emin olabilirim?</h3>

<p>
  KVKK’nın 4. maddesi uyarınca AVR Global Oy’nin kişisel verilerinizi doğru ve
  güncel tutma yükümlülüğü bulunmaktadır. Bu kapsamda AVR Global Oy’nin
  yürürlükteki mevzuattan doğan yükümlülüklerini yerine getirebilmesi için
  müşterilerimizin AVR Global Oy ile doğru ve güncel verilerini paylaşması
  gerekmektedir. Verilerinizin herhangi bir şekilde değişmesi durumunda
  aşağıda belirtilen iletişim kanallarından bizimle iletişime geçerek
  verilerinizi güncellemenizi rica ederiz.
</p>

<h3>10. AVR Global Oy’ye kişisel verilerinizle ilgili soru sormak ister misiniz?</h3>

<p>
  KVKK kapsamında haklarınız ile ilgili başvurularınızı web sitemizde
  "<a href="/iletisim">İletişim</a>" bölümünde yer alan
  <a href="mailto:info@almanyavizerehberi.com">info@almanyavizerehberi.com</a>
  adresine "KVKK Başvuru" başlığı ile e-posta göndererek yapabilirsiniz.
</p>
`.trim();

function updateKvkkBody() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'kvkk.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  json.bodyHtml = newBodyHtml;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log('Updated bodyHtml for kvkk.json');
}

updateKvkkBody();

