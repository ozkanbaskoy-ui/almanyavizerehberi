'use client';

import { InlineWidget } from 'react-calendly';

type CalendlyEmbedProps = {
  url: string;
};

export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  return (
    <div className="mt-10 overflow-hidden rounded-[2.5rem] border border-border-subtle bg-surface-main shadow-[0_30px_90px_rgba(15,23,42,0.45)]">
      <InlineWidget
        url={url}
        styles={{
          height: '820px',
          minWidth: '320px',
          width: '100%',
        }}
      />
    </div>
  );
}
