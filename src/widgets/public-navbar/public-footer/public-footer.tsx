import Link from "next/link";

import { appConfig } from "@/shared/config/app";
import { defaultMarket } from "@/shared/config/markets";
import { footerNavigationGroups } from "@/shared/navigation";
import { routes } from "@/shared/config/routes";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-5">
            <Link
              href={routes.home}
              className="inline-flex items-center gap-3 text-lg font-semibold tracking-[-0.03em] text-foreground"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                Z
              </span>
              {appConfig.name}
            </Link>

            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {appConfig.description} Germany-first, EU-ready, and structured
              for future multi-market expansion.
            </p>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1">
                Market: {defaultMarket.label}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                Currency: {defaultMarket.currency}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                Locale: {defaultMarket.locale}
              </span>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {footerNavigationGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">
                  {group.title}
                </h2>

                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={`${group.title}-${item.href}`}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {appConfig.name}. All rights reserved.
          </p>

          <p>
            Legal pages are placeholders until final Germany/EU launch review.
          </p>
        </div>
      </div>
    </footer>
  );
}
