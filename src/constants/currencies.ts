export const currencies = ["USDC", "WETH"] as const;
export type Currencies = typeof currencies;
export type Currency = Currencies[number];

export function isCurrency(currency: string): currency is Currency {
  return currencies.includes(currency);
}
