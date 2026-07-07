import { defaultMarket, getMarketByCode } from "@/shared/config/markets";

type FormatMoneyInput = {
  amount: number | string | null | undefined;
  marketCode?: string | null;
  currency?: string;
  locale?: string;
};

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
}

export function formatMoney({
  amount,
  marketCode,
  currency,
  locale,
}: FormatMoneyInput) {
  const market = getMarketByCode(marketCode);

  return new Intl.NumberFormat(locale ?? market.locale, {
    style: "currency",
    currency: currency ?? market.currency,
    currencyDisplay: market.currencyDisplay,
  }).format(toNumber(amount));
}

export function formatDefaultMoney(amount: number | string | null | undefined) {
  return formatMoney({
    amount,
    marketCode: defaultMarket.code,
  });
}
