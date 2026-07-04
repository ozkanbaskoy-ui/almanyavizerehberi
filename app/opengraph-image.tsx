import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #0d1b2a 0%, #14365d 55%, #09111d 100%)',
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08), transparent 25%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 18,
            background: '#d6774f',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px 56px 88px',
            width: '72%',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              padding: '10px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.16)',
              fontSize: 22,
              letterSpacing: 0.5,
              fontWeight: 700,
            }}
          >
            ALMANYA VIZE REHBERI
          </div>

          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                fontSize: 74,
                lineHeight: 1.02,
                fontWeight: 800,
                marginBottom: 22,
              }}
            >
              Almanya
              <br />
              Göç ve Vize
            </div>
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.84)',
                maxWidth: 700,
              }}
            >
              Calisma vizesi, Mavi Kart, Firsat Karti ve goc sonrasi islemler
              icin profesyonel rehberlik.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              marginTop: 16,
            }}
          >
            {['Calisma Vizesi', 'Mavi Kart', 'Firsat Karti'].map((label) => (
              <div
                key={label}
                style={{
                  padding: '11px 16px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            width: '28%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '56px 48px 60px 0',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: '100%',
              borderRadius: 28,
              background: 'rgba(255,255,255,0.09)',
              border: '1px solid rgba(255,255,255,0.14)',
              padding: 28,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 18,
                color: '#f3f7fb',
              }}
            >
              odak alanlari
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                fontSize: 22,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              <span>Almanya calisma vizesi</span>
              <span>Almanya goc rehberi</span>
              <span>Firsat Karti ve Mavi Kart</span>
              <span>Goc sonrasi islemler</span>
            </div>
            <div
              style={{
                marginTop: 28,
                fontSize: 18,
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              almanyavizerehberi.com
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
