export type MarketCode = "de" | "eu" | "pk";

export type MarketConfig = {
  code: MarketCode;
  label: string;
  countryCode: string;
  locale: string;
  currency: string;
  currencyDisplay: "symbol" | "code";
  pricesIncludeTax: boolean;
  enabled: boolean;
};

export const markets = Object.freeze({
  de: {
    code: "de",
    label: "Germany",
    countryCode: "DE",
    locale: "de-DE",
    currency: "EUR",
    currencyDisplay: "symbol",
    pricesIncludeTax: true,
    enabled: true,
  },
  eu: {
    code: "eu",
    label: "European Union",
    countryCode: "EU",
    locale: "en-IE",
    currency: "EUR",
    currencyDisplay: "symbol",
    pricesIncludeTax: true,
    enabled: false,
  },
  pk: {
    code: "pk",
    label: "Pakistan",
    countryCode: "PK",
    locale: "en-PK",
    currency: "PKR",
    currencyDisplay: "code",
    pricesIncludeTax: false,
    enabled: false,
  },
} as const satisfies Record<MarketCode, MarketConfig>);

export const defaultMarket = markets.de;

export function getMarketByCode(code?: string | null): MarketConfig {
  if (!code) {
    return defaultMarket;
  }

  return markets[code as MarketCode] ?? defaultMarket;
}
