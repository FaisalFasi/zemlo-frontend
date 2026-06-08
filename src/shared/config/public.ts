import { appConfig } from "./app";
import { defaultMarket } from "./markets";

export const publicConfig = Object.freeze({
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? appConfig.name,
  description: appConfig.description,
  siteUrl: appConfig.siteUrl,

  defaultMarket:
    process.env.NEXT_PUBLIC_DEFAULT_MARKET ?? appConfig.defaultMarket,
  country: process.env.NEXT_PUBLIC_APP_COUNTRY ?? defaultMarket.countryCode,
  currency: process.env.NEXT_PUBLIC_APP_CURRENCY ?? defaultMarket.currency,
  locale: process.env.NEXT_PUBLIC_APP_LOCALE ?? defaultMarket.locale,
} as const);

export type PublicConfig = typeof publicConfig;
