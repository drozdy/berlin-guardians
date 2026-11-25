const CURRENCY_SYMBOL = '€';
const CENTS_IN_UNIT = 100;

export function formatPrice(priceCents: number): string {
  if (priceCents === 0) {
    return 'Free';
  }

  return `${CURRENCY_SYMBOL}${(priceCents / CENTS_IN_UNIT).toFixed(2)}`;
}

export function formatCoins(priceCents: number): string {
  return priceCents.toLocaleString('en-US');
}
