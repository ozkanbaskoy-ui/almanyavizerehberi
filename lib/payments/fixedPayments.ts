export type FixedPaymentOption = {
  slug: string;
  label: string;
  description: string;
  amount: number;
  currency: 'eur';
};

const FIXED_PAYMENT_AMOUNTS = [
  500,
  750,
  1000,
  1250,
  1500,
  1750,
  2000,
  2500,
] as const;

export const FIXED_PAYMENT_OPTIONS: FixedPaymentOption[] =
  FIXED_PAYMENT_AMOUNTS.map((amount) => ({
    slug: String(amount),
    label: `${amount.toLocaleString('tr-TR')} Euro Ödeme`,
    description: 'AVR Global danışmanlık hizmeti ödemesi',
    amount,
    currency: 'eur',
  }));

export function getFixedPaymentOption(slug: string) {
  return FIXED_PAYMENT_OPTIONS.find((option) => option.slug === slug) ?? null;
}
