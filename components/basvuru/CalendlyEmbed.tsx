'use client';

type CalendlyEmbedProps = {
  url: string;
};

// Bu bileşen artik Calendly yerine Google Takvim randevu iframe'ini gosteriyor.
// URL admin panelindeki "Calendly URL" alanindan okunuyor; oraya Google Takvim
// embed adresini yapistirabilirsiniz.
export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  return (
    <div className="mt-10 overflow-hidden rounded-[2.5rem] border border-border-subtle bg-surface-main shadow-[0_30px_90px_rgba(15,23,42,0.45)]">
      <iframe
        src={url}
        style={{ border: 0 }}
        width="100%"
        height={600}
        // eslint-disable-next-line react/no-unknown-property
        frameBorder={0}
        loading="lazy"
      />
    </div>
  );
}
