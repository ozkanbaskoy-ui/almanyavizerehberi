/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '2b.almanyavizerehberi.com',
      },
    ],
  },
  async rewrites() {
    return [
      // Temel sayfalar
      { source: '/index.php', destination: '/' },
      { source: '/hakkimizda.php', destination: '/hakkimizda' },
      { source: '/sss.php', destination: '/sss' },
      { source: '/blog.php', destination: '/blog' },
      { source: '/iletisim.php', destination: '/iletisim' },
      { source: '/basvuru.php', destination: '/basvuru' },

      // Blog detayları (blog-yazi.php?l=...)
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '1' }],
        destination: '/blog/blog-1',
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '2' }],
        destination: '/blog/blog-2',
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '3' }],
        destination: '/blog/blog-3',
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '4' }],
        destination: '/blog/blog-4',
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '5' }],
        destination: '/blog/blog-5',
      },
      {
        source: '/blog-yazi.php',
        has: [{ type: 'query', key: 'l', value: '6' }],
        destination: '/blog/blog-6',
      },

      // Hizmetler (vize türleri)
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '1' }],
        destination: '/hizmetler/calisma-vizesi',
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '2' }],
        destination: '/hizmetler/mavi-kart-vizesi',
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '3' }],
        destination: '/hizmetler/firsat-karti',
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '5' }],
        destination: '/hizmetler/mesleki-egitim-vizesi',
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '7' }],
        destination: '/hizmetler/aile-birlesimi-vizesi',
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '9' }],
        destination: '/hizmetler/yuksekogrenim-vizesi',
      },
      {
        source: '/hizmetler.php',
        has: [{ type: 'query', key: 'l', value: '10' }],
        destination: '/hizmetler/dil-kursu-vizesi',
      },
      // l parametresi olmadan gelen istekleri Çalışma Vizesi'ne yönlendir
      {
        source: '/hizmetler.php',
        destination: '/hizmetler/calisma-vizesi',
      },

      // Göç sonrası hizmetler
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '1' }],
        destination: '/servisler/oturum-izni-basvurusu-ve-yenilenmesi',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '2' }],
        destination: '/servisler/yabancilar-dairesi-islemleri',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '3' }],
        destination: '/servisler/calisma-izni',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '4' }],
        destination: '/servisler/sigorta-ve-sosyal-guvenlik',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '5' }],
        destination: '/servisler/vergi-islemleri',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '6' }],
        destination: '/servisler/dil-egitimi-ve-entegrasyon-kurslari',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '7' }],
        destination: '/servisler/barinma-ve-emlak-islemleri',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '8' }],
        destination: '/servisler/egitim-ve-cocuklarin-egitimi',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '9' }],
        destination: '/servisler/hukuki-danismanlik-ve-haklar',
      },
      {
        source: '/servisler.php',
        has: [{ type: 'query', key: 'l', value: '10' }],
        destination: '/servisler/kulturel-ve-sosyal-rehberlik',
      },
      // l parametresi olmadan gelen istekleri Oturum İzni hizmetine yönlendir
      {
        source: '/servisler.php',
        destination: '/servisler/oturum-izni-basvurusu-ve-yenilenmesi',
      },

      // Odeme sayfasi
      { source: '/odeme.php', destination: '/odeme' },

      // Hukuki sayfalar
      { source: '/cerezler.php', destination: '/cerezler' },
      { source: '/kullanim-sartlari.php', destination: '/kullanim-sartlari' },
      { source: '/kvkk.php', destination: '/kvkk' },
      { source: '/sorumluluk-reddi.php', destination: '/sorumluluk-reddi' },
      { source: '/gdpr.php', destination: '/gdpr' },
    ];
  },
};

export default nextConfig;
