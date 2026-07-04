export const DEFAULT_WHATSAPP_MESSAGE =
  'Merhaba, Siteniz üzerinden size ulaşıyorum bilgi almak isterim';

export function createWhatsAppHref(
  phoneNumber?: string | null,
  options: { defaultCountryCode?: string; message?: string } = {},
) {
  const raw = phoneNumber?.trim();
  if (!raw) return undefined;

  const defaultCountryCode = options.defaultCountryCode ?? '90';
  let digits = raw.replace(/\D/g, '');
  if (!digits) return undefined;

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  } else if (!raw.startsWith('+')) {
    if (digits.startsWith('0')) {
      digits = `${defaultCountryCode}${digits.replace(/^0+/, '')}`;
    } else if (digits.length === 10 && digits.startsWith('5')) {
      digits = `${defaultCountryCode}${digits}`;
    }
  }

  const url = new URL(`https://wa.me/${digits}`);
  if (options.message) {
    url.searchParams.set('text', options.message);
  }

  return url.toString();
}
