"use client";

type CalendlyEmbedProps = {
  url: string;
};

// Bu bileşen artık Calendly yerine Google Takvim randevu takvimini sayfanın
// içinde gösteriyor. URL admin panelindeki "Calendly URL" alanından okunur;
// oraya Google appointments (gv=true) linkini yapıştırabilirsiniz.
export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  return (
    <div className="mt-10 overflow-hidden rounded-[2.5rem] border border-border-subtle bg-surface-main shadow-[0_30px_90px_rgba(15,23,42,0.45)]">
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
