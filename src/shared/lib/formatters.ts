import { defaultMarket, getMarketByCode } from "@/shared/config/markets";

type FormatMoneyInput = {
  amount: number | string | null | undefined;
  marketCode?: string | null;
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
};

// Exported so anything that needs to do MATH on a money value (not just
// display it) — e.g. summing order totals for a dashboard stat — coerces
// the same way `formatMoney` does. A backend that serializes Decimal
// fields as strings would otherwise silently turn a raw `+`/`reduce` into
// string concatenation instead of a numeric sum.
export function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
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
  maximumFractionDigits,
}: FormatMoneyInput) {
  const market = getMarketByCode(marketCode);

  return new Intl.NumberFormat(locale ?? market.locale, {
    style: "currency",
    currency: currency ?? market.currency,
    currencyDisplay: market.currencyDisplay,
    maximumFractionDigits,
  }).format(toNumber(amount));
}

export function formatDefaultMoney(amount: number | string | null | undefined) {
  return formatMoney({
    amount,
    marketCode: defaultMarket.code,
  });
}

// Formats an ISO date string (e.g. "2026-07-12T18:03:00.000Z") in the
// default market's locale — "12. Juli 2026" for de-DE. Returns "" for
// missing/invalid input so callers never render "Invalid Date".
export function formatDefaultDate(isoDate: string | null | undefined) {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(defaultMarket.locale, {
    dateStyle: "medium",
  }).format(date);
}
