export type FixedPaymentOption = {
  slug: string;
  label: string;
  description: string;
  amount: number;
  currency: 'eur';
};

export const FIXED_PAYMENT_OPTIONS: FixedPaymentOption[] = [
  {
    slug: 'odeme1',
    label: '1000 Euro Odeme',
    description: 'AVR Global danismanlik hizmeti odemesi',
    amount: 1000,
    currency: 'eur',
  },
  {
    slug: 'odeme2',
    label: '2000 Euro Odeme',
    description: 'AVR Global danismanlik hizmeti odemesi',
    amount: 2000,
    currency: 'eur',
  },
  {
    slug: 'odeme3',
    label: '5 Euro Test Odeme',
    description: 'AVR Global test odemesi',
    amount: 5,
    currency: 'eur',
  },
];

export function getFixedPaymentOption(slug: string) {
  return FIXED_PAYMENT_OPTIONS.find((option) => option.slug === slug) ?? null;
}
