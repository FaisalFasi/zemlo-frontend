import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { heroHighlights, heroQuickLinks } from "../data/home-page-data";

export default function MarketplaceHeroSection() {
  return (
    <section className="bg-background text-foreground">
      <div className="container-page grid min-h-[calc(100svh-var(--navbar-height))] items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
        <div className="max-w-2xl">
          <p className="text-eyebrow text-muted-foreground">
            Zemlo Marketplace
          </p>

          <h1 className="mt-5 text-hero text-balance">
            Shop smarter across brands, categories, and everyday essentials.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            Discover products from Zemlo and trusted brands across electronics,
            fashion, home, beauty, accessories, and more.
          </p>

          <form
            action="/shop"
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card p-2 shadow-card"
          >
            <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />

            <input
              name="q"
              type="search"
              placeholder="Search products, brands, categories..."
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            <Button type="submit" className="rounded-full px-5">
              Search
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {heroQuickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground no-underline transition-zemlo hover:border-foreground"
                >
                  <Icon className="size-4 text-muted-foreground" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {heroHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative min-h-[24rem] overflow-hidden rounded-[2rem] bg-muted sm:min-h-[34rem]">
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1400&auto=format&fit=crop"
              alt="Shopping bags and marketplace products"
              fill
              priority
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="object-cover image-muted"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
              <p className="text-eyebrow text-white/70">Today&apos;s picks</p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight">
                Discover what&apos;s trending.
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            <Link
              href="/shop?sort=deals"
              className="group flex min-h-[16rem] flex-col justify-between rounded-[2rem] bg-primary p-6 text-primary-foreground no-underline"
            >
              <div>
                <p className="text-eyebrow text-primary-foreground/70">Deals</p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight">
                  Save across popular categories.
                </h2>
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-medium">
                View deals
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/shop"
              className="group flex min-h-[16rem] flex-col justify-between rounded-[2rem] border border-border bg-card p-6 text-foreground no-underline"
            >
              <div>
                <p className="text-eyebrow text-muted-foreground">
                  All products
                </p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight">
                  One store. Many categories.
                </h2>
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-medium">
                Browse catalog
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
