/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Shop ki search/filter/sort logic ke unit tests, nakli
 * products (fixtures) ke sath.
 * REASON: Search/filter customer ka roz ka raasta hai. Aur Phase 5B
 * mein ye logic server-side jayegi — ye tests tab regression-safety
 * denge (naya code purane jaisa behave karta hai ya nahi).
 * RISK: Zero — test file.
 * ═════════════════════════════════════════════════════════════════
 */
import { describe, expect, it } from "vitest";

import type { ShopProduct } from "../types/shop.types";
import {
  filterAndSortShopProducts,
  resolveShopSearchParams,
} from "./shop-filters";

function makeProduct(overrides: Partial<ShopProduct>): ShopProduct {
  return {
    id: "p1",
    name: "Product",
    slug: "product",
    brand: "Zemlo",
    category: "Home",
    categorySlug: "home",
    image: "/images/product-placeholder.png",
    price: 10,
    ...overrides,
  };
}

const candle = makeProduct({
  id: "p1",
  name: "Scented Candle",
  brand: "Lumo",
  category: "Home Decor",
  categorySlug: "home-decor",
  price: 20,
});

const mug = makeProduct({
  id: "p2",
  name: "Coffee Mug",
  brand: "Zemlo",
  category: "Kitchen",
  categorySlug: "kitchen",
  price: 12,
});

const featuredVase = makeProduct({
  id: "p3",
  name: "Ceramic Vase",
  brand: "Lumo",
  category: "Home Decor",
  categorySlug: "home-decor",
  price: 35,
  isFeatured: true,
});

const products = [candle, mug, featuredVase];

const baseParams = { q: "", category: "", sort: "featured" as const };

describe("filterAndSortShopProducts", () => {
  it("matches search text against name, brand and category", () => {
    expect(
      filterAndSortShopProducts(products, { ...baseParams, q: "candle" }),
    ).toEqual([candle]);

    expect(
      filterAndSortShopProducts(products, { ...baseParams, q: "lumo" }),
    ).toHaveLength(2);

    expect(
      filterAndSortShopProducts(products, { ...baseParams, q: "kitchen" }),
    ).toEqual([mug]);
  });

  it("filters by category slug", () => {
    const result = filterAndSortShopProducts(products, {
      ...baseParams,
      category: "home-decor",
    });

    expect(result.map((p) => p.id).sort()).toEqual(["p1", "p3"]);
  });

  it("sorts by price both ways", () => {
    const asc = filterAndSortShopProducts(products, {
      ...baseParams,
      sort: "price-asc",
    });
    const desc = filterAndSortShopProducts(products, {
      ...baseParams,
      sort: "price-desc",
    });

    expect(asc.map((p) => p.price)).toEqual([12, 20, 35]);
    expect(desc.map((p) => p.price)).toEqual([35, 20, 12]);
  });

  it("puts featured products first in the default sort", () => {
    const result = filterAndSortShopProducts(products, baseParams);

    expect(result[0]).toBe(featuredVase);
  });

  it("returns an empty list when nothing matches", () => {
    expect(
      filterAndSortShopProducts(products, { ...baseParams, q: "xyz-nahi-hai" }),
    ).toEqual([]);
  });
});

describe("resolveShopSearchParams", () => {
  it("trims text params and defaults invalid sort to featured", () => {
    expect(
      resolveShopSearchParams({ q: "  mug ", sort: "not-a-sort" }),
    ).toEqual({ q: "mug", category: "", sort: "featured" });
  });

  it("keeps valid sort options", () => {
    expect(resolveShopSearchParams({ sort: "price-asc" }).sort).toBe(
      "price-asc",
    );
  });
});
