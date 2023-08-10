export const currencies = ["USDC", "WETH"] as const;
export type Currencies = typeof currencies;
export type Currency = Currencies[number];
