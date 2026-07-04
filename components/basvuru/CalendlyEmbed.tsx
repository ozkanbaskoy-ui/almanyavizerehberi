"use client";

type CalendlyEmbedProps = {
  url: string;
};

// Bu bileşen Google Takvim randevu takvimini sayfanın içinde gösterir.
// Alan adı geriye dönük uyumluluk için calendlyUrl olarak kalıyor.
export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-border-subtle bg-surface-main shadow-[0_24px_70px_rgba(15,23,42,0.35)]">
      <iframe
        src={url}
        style={{ border: 0 }}
        width="100%"
        height={720}
        // eslint-disable-next-line react/no-unknown-property
        frameBorder={0}
        loading="lazy"
      />
    </div>
  );
}
