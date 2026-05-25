"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { menuItems } from "./menu-items";

type AppSidebarProps = {
  onNavigate?: () => void;
};

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <SheetContent
      side="left"
      className="w-[min(92vw,24rem)] overflow-y-auto border-r border-border bg-background p-0"
    >
      <div className="flex min-h-svh flex-col">
        <div className="border-b border-border px-5 py-5">
          <SheetHeader className="space-y-2 text-left">
            <SheetTitle asChild>
              <Link
                href="/"
                onClick={onNavigate}
                className="inline-flex items-center gap-2 no-underline"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  Z
                </span>

                <span className="font-display text-xl font-medium uppercase tracking-[0.22em] text-foreground">
                  Zemlo
                </span>
              </Link>
            </SheetTitle>

            <SheetDescription className="max-w-xs text-sm leading-6 text-muted-foreground">
              Premium minimal essentials for modern everyday living.
            </SheetDescription>
          </SheetHeader>
        </div>

        <nav aria-label="Mobile navigation" className="flex-1 px-3 py-4">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl px-3 py-3 no-underline transition-zemlo",
                    active
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : "text-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  />

                  <span className="grid gap-1">
                    <span className="text-sm font-medium leading-none">
                      {item.title}
                    </span>

                    <span
                      className={cn(
                        "text-xs leading-5",
                        active
                          ? "text-primary-foreground/75"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <div className="grid grid-cols-3 gap-2">
            <Button asChild variant="secondary" className="h-12 rounded-2xl">
              <Link
                href="/search"
                onClick={onNavigate}
                aria-label="Search products"
              >
                <Search className="size-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" className="h-12 rounded-2xl">
              <Link href="/login" onClick={onNavigate} aria-label="Sign in">
                <UserRound className="size-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" className="h-12 rounded-2xl">
              <Link href="/cart" onClick={onNavigate} aria-label="Open cart">
                <ShoppingBag className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}
