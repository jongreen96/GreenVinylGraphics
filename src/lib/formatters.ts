const CURRENCY_FORMATTER = new Intl.NumberFormat('en-GB', {
  currency: 'GBP',
  style: 'currency',
  minimumFractionDigits: 2,
});

export const formatCurrency = (amount: number) =>
  CURRENCY_FORMATTER.format(amount);

const NUMBER_FORMATTER = new Intl.NumberFormat('en-GB');

export const formatNumber = (number: number) => NUMBER_FORMATTER.format(number);
