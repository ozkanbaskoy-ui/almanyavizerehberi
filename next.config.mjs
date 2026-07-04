/** @type {import('next').NextConfig} */
const fixedPaymentSlugs = [
  '500',
  '750',
  '1000',
  '1250',
  '1500',
  '1750',
  '2000',
  '2500',
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [
      {
        pathname: '/assets/img/**',
      },
    ],
  },
  async redirects() {
    const paymentRedirects = [
      ...fixedPaymentSlugs.map((slug) => ({
        source: `/${slug}`,
        destination: `/odeme/${slug}`,
        permanent: true,
      })),
      ...fixedPaymentSlugs.map((slug) => ({
        source: `/${slug}/sonuc`,
        destination: `/odeme/${slug}/sonuc`,
        permanent: true,
      })),
    ];

    return [
      ...paymentRedirects,

      // Temel sayfalar
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/hakkimizda.php', destination: '/hakkimizda', permanent: true },
      { source: '/sss.php', destination: '/sss', permanent: true },
      { source: '/blog.php', destination: '/blog', permanent: true },
      { source: '/iletisim.php', destination: '/iletisim', permanent: true },
      { source: '/basvuru.php', destination: '/basvuru', permanent: true },

      // Blog detayları (blog-yazi.php?l=...)
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '1' }],
        destination: '/blog/blog-1',
        permanent: true,
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '2' }],
        destination: '/blog/blog-2',
        permanent: true,
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '3' }],
        destination: '/blog/blog-3',
        permanent: true,
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '4' }],
        destination: '/blog/blog-4',
        permanent: true,
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '5' }],
        destination: '/blog/blog-5',
        permanent: true,
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '6' }],
        destination: '/blog/blog-6',
        permanent: true,
      },

      // Hizmetler (vize türleri)
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '1' }],
        destination: '/hizmetler/calisma-vizesi',
        permanent: true,
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '2' }],
        destination: '/hizmetler/mavi-kart-vizesi',
        permanent: true,
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '3' }],
        destination: '/hizmetler/firsat-karti',
        permanent: true,
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '5' }],
        destination: '/hizmetler/mesleki-egitim-vizesi',
        permanent: true,
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '7' }],
        destination: '/hizmetler/aile-birlesimi-vizesi',
        permanent: true,
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '9' }],
        destination: '/hizmetler/yuksekogrenim-vizesi',
        permanent: true,
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '10' }],
        destination: '/hizmetler/dil-kursu-vizesi',
        permanent: true,
      },
      {
        source: '/hizmetler.php',
        destination: '/hizmetler/calisma-vizesi',
        permanent: true,
      },

      // Göç sonrası hizmetler
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '1' }],
        destination: '/servisler/oturum-izni-basvurusu-ve-yenilenmesi',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '2' }],
        destination: '/servisler/yabancilar-dairesi-islemleri',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '3' }],
        destination: '/servisler/calisma-izni',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '4' }],
        destination: '/servisler/sigorta-ve-sosyal-guvenlik',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '5' }],
        destination: '/servisler/vergi-islemleri',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '6' }],
        destination: '/servisler/dil-egitimi-ve-entegrasyon-kurslari',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '7' }],
        destination: '/servisler/barinma-ve-emlak-islemleri',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '8' }],
        destination: '/servisler/egitim-ve-cocuklarin-egitimi',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '9' }],
        destination: '/servisler/hukuki-danismanlik-ve-haklar',
        permanent: true,
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '10' }],
        destination: '/servisler/kulturel-ve-sosyal-rehberlik',
        permanent: true,
      },
      {
        source: '/servisler.php',
        destination: '/servisler/oturum-izni-basvurusu-ve-yenilenmesi',
        permanent: true,
      },

      // Ödeme sayfası
      { source: '/odeme.php', destination: '/odeme', permanent: true },

      // Hukuki sayfalar
      { source: '/cerezler.php', destination: '/cerezler', permanent: true },
      { source: '/kullanim-sartlari.php', destination: '/kullanim-sartlari', permanent: true },
      { source: '/kvkk.php', destination: '/kvkk', permanent: true },
      { source: '/sorumluluk-reddi.php', destination: '/sorumluluk-reddi', permanent: true },
      { source: '/gdpr.php', destination: '/gdpr', permanent: true },
    ];
  },
};

export default nextConfig;
