"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, UserRound } from "lucide-react";

import { Button } from "@/shared/ui/button";

import MobileNavbar from "./mobile-navbar";
import { menuItems } from "./menu-items";
import { useCartBadgeQuantity } from "@/features/cart/hooks/use-cart";
import { useCurrentCustomerQuery } from "@/features/auth/hooks/use-customer-auth";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const { totalQuantity } = useCartBadgeQuantity();
  const currentUserQuery = useCurrentCustomerQuery();
  const isSignedIn = Boolean(currentUserQuery.data);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Mobile / Tablet navbar */}
        <div className="flex h-[var(--navbar-height)] w-full items-center justify-between gap-3 lg:hidden">
          <div className="flex flex-1 items-center justify-start">
            <MobileNavbar />
          </div>

          <Link
            href="/"
            aria-label="Zemlo home"
            className="focus-ring flex flex-1 items-center justify-center rounded-full"
          >
            <span className="truncate font-display text-lg font-medium uppercase tracking-[0.2em] text-foreground sm:text-xl">
              Zemlo
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-1.5">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden rounded-full text-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              {/* EXPLANATION: /search page exist nahi karta tha (404) —
                  search box /shop par hai, wahin bhejte hain. */}
              <Link href="/shop" aria-label="Search products">
                <Search className="size-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative rounded-full text-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href="/cart" aria-label="Open cart">
                <ShoppingBag className="size-5" />
                {totalQuantity > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium leading-none text-primary-foreground">
                    {totalQuantity > 9 ? "9+" : totalQuantity}
                  </span>
                ) : null}
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop navbar */}
        <div className="hidden h-[var(--navbar-height)] w-full items-center justify-between gap-8 lg:flex">
          <Link
            href="/"
            aria-label="Zemlo home"
            className="focus-ring group inline-flex shrink-0 items-center gap-2 rounded-full"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-zemlo group-hover:scale-95">
              Z
            </span>

            <span className="font-display text-xl font-medium uppercase tracking-[0.22em] text-foreground">
              Zemlo
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex min-w-0 flex-1 items-center justify-center gap-2"
          >
            {menuItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium no-underline transition-zemlo",
                    active
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full text-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href="/shop" aria-label="Search products">
                <Search className="size-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative rounded-full text-foreground hover:bg-muted hover:text-foreground"
            >
              <Link
                href={isSignedIn ? "/account" : "/login"}
                aria-label={isSignedIn ? "Your account" : "Sign in"}
              >
                <UserRound className="size-5" />
                {isSignedIn ? (
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary" />
                ) : null}
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative rounded-full text-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href="/cart" aria-label="Open cart">
                <ShoppingBag className="size-5" />
                {totalQuantity > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium leading-none text-primary-foreground">
                    {totalQuantity > 9 ? "9+" : totalQuantity}
                  </span>
                ) : null}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
