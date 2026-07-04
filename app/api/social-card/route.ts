import { createElement } from 'react';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1080,
  height: 1080,
};

export const contentType = 'image/png';

const h = createElement;

function clampTextSize(title: string) {
  if (title.length > 48) return 56;
  if (title.length > 34) return 64;
  if (title.length > 24) return 72;
  return 82;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title =
    url.searchParams.get('title')?.trim() || 'Almanya Göç Rehberi';
  const keyword =
    url.searchParams.get('keyword')?.trim() || 'Almanya çalışma vizesi';
  const channel =
    url.searchParams.get('channel')?.trim() || 'Sosyal paylaşım';
  const cta =
    url.searchParams.get('cta')?.trim() || 'Ön değerlendirme formunu doldurun';

  const titleSize = clampTextSize(title);

  return new ImageResponse(
    h(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '66px 70px',
          background:
            'linear-gradient(135deg, #0d1b2a 0%, #163c66 54%, #08111c 100%)',
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
      },
      h('div', {
        style: {
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.14), transparent 26%), radial-gradient(circle at 84% 10%, rgba(255,255,255,0.09), transparent 22%), radial-gradient(circle at 76% 78%, rgba(214,119,79,0.18), transparent 20%)',
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 18,
          background: '#d6774f',
        },
      }),
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            zIndex: 1,
          },
        },
        h(
          'div',
          {
            style: {
              alignSelf: 'flex-start',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.12)',
              padding: '10px 18px',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 0.4,
            },
          },
          'ALMANYA VIZE REHBERI',
        ),
        h(
          'div',
          { style: { maxWidth: 820 } },
          h(
            'div',
            {
              style: {
                fontSize: titleSize,
                lineHeight: 1.01,
                fontWeight: 800,
                whiteSpace: 'pre-wrap',
              },
            },
            title,
          ),
          h(
            'div',
            {
              style: {
                marginTop: 18,
                fontSize: 31,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.85)',
                maxWidth: 820,
              },
            },
            keyword,
          ),
        ),
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 24,
            zIndex: 1,
          },
        },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
          h(
            'div',
            {
              style: {
                display: 'inline-flex',
                alignSelf: 'flex-start',
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.1)',
                padding: '12px 18px',
                fontSize: 24,
                fontWeight: 700,
              },
            },
            cta,
          ),
          h(
            'div',
            {
              style: {
                fontSize: 18,
                color: 'rgba(255,255,255,0.72)',
                letterSpacing: 0.2,
              },
            },
            channel,
          ),
        ),
        h(
          'div',
          {
            style: {
              textAlign: 'right',
              fontSize: 20,
              color: 'rgba(255,255,255,0.76)',
            },
          },
          'almanyavizerehberi.com',
        ),
      ),
    ),
    size,
  );
}
