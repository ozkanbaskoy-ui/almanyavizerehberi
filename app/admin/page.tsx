import Link from 'next/link';

export const metadata = {
  title: 'Yönetim Paneli',
};

export default function AdminLandingPage() {
  const primaryCards = [
    {
      href: '/admin/dashboard',
      title: 'Dashboard',
      body: 'Toplam başvuru, aktif lead, ödeme bekleyen kayıt ve durum dağılımını görün.',
    },
    {
      href: '/crm/leads',
      title: 'Başvurular / Lead CRM',
      body: 'Siteden gelen başvuruları, iletişim bilgilerini, vize türünü ve zaman tünelini takip edin.',
    },
    {
      href: '/admin/customers',
      title: 'Müşteriler',
      body: 'Müşteri hesabı oluşturun, ödeme linklerini kaydedin ve müşteri paneli erişimini yönetin.',
    },
    {
      href: '/admin/finance',
      title: 'Finans & Randevu',
      body: 'Ödeme ve randevu kayıtlarını operasyon ekranından kontrol edin.',
    },
    {
      href: '/crm',
      title: 'CRM Çalışma Alanı',
      body: 'Lead havuzu, evrak kuyruğu, görevler, randevular ve raporlar için ayrı CRM ekranını açın.',
    },
    {
      href: '/admin/users',
      title: 'CRM Kullanıcıları',
      body: 'İç ekip kullanıcılarını oluşturun, rollerini ve erişim durumlarını yönetin.',
    },
    {
      href: '/admin/roles',
      title: 'Roller & İzinler',
      body: 'Admin ve CRM rollerinin yetki kapsamını ve RLS karşılıklarını kontrol edin.',
    },
    {
      href: '/admin/audit-logs',
      title: 'Audit Log',
      body: 'Başvuru, CRM ve sistem tarafındaki kritik değişiklik kayıtlarını izleyin.',
    },
    {
      href: '/admin/email-logs',
      title: 'E-posta Logları',
      body: 'Yeni başvuru ve yönetici bildirimlerinin gönderim sonucunu takip edin.',
    },
  ];

  const contentCards = [
    {
      href: '/admin/site',
      title: 'Site Genel Ayarları',
      body: 'İletişim bilgileri, WhatsApp numarası, sosyal medya linkleri ve randevu URL bilgisini yönetin.',
    },
    {
      href: '/admin/home',
      title: 'Ana Sayfa Metinleri',
      body: 'Hero başlığı, açıklamalar ve ana sayfa bloklarını güncelleyin.',
    },
    {
      href: '/admin/cms/visas',
      title: 'Vize Sayfaları',
      body: 'Çalışma vizesi, Mavi Kart, Fırsat Kartı ve diğer vize içeriklerini düzenleyin.',
    },
    {
      href: '/admin/cms/blog',
      title: 'Blog Yazıları',
      body: 'SEO içeriklerini ve blog yazılarını panelden yönetin.',
    },
    {
      href: '/admin/marketing',
      title: 'SEO & Sosyal Otomasyon',
      body: 'Çalışma vizesi, Mavi Kart ve Fırsat Kart için hazır sosyal medya paketleri oluşturun.',
    },
    {
      href: '/admin/settings',
      title: 'E-posta Ayarları',
      body: 'Başvuru bildirimleri, yönetici e-postaları ve şablon metinlerini düzenleyin.',
    },
    {
      href: '/admin/system',
      title: 'Sistem Sağlığı',
      body: 'Supabase, SMTP, Stripe ve güvenlik ortam değişkenlerini kontrol edin.',
    },
  ];

  return (
    <main className="admin-page py-10">
      <h1 className="admin-page-title text-3xl">
        Yönetim Paneli
      </h1>
      <p className="admin-page-subtitle mt-3">
        Siteden gelen lead başvurularını, müşteri kayıtlarını, ödeme/randevu
        operasyonunu ve içerik ayarlarını buradan yönetin.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Operasyon
        </h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {primaryCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group panel p-5 transition hover:border-brand-base hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {card.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          İçerik ve Site
        </h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {contentCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group panel p-5 transition hover:border-brand-base hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {card.body}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
