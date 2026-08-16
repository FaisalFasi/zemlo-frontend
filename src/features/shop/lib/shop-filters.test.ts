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
  createShopHref,
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

const baseParams = {
  q: "",
  category: "",
  sort: "featured" as const,
  page: 1,
};

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
    ).toEqual({ q: "mug", category: "", sort: "featured", page: 1 });
  });

  it("keeps valid sort options", () => {
    expect(resolveShopSearchParams({ sort: "price-asc" }).sort).toBe(
      "price-asc",
    );
  });

  it("defaults page to 1 when missing, invalid, zero, or negative", () => {
    expect(resolveShopSearchParams({}).page).toBe(1);
    expect(resolveShopSearchParams({ page: "not-a-number" }).page).toBe(1);
    expect(resolveShopSearchParams({ page: "0" }).page).toBe(1);
    expect(resolveShopSearchParams({ page: "-3" }).page).toBe(1);
  });

  it("parses a valid page number", () => {
    expect(resolveShopSearchParams({ page: "4" }).page).toBe(4);
  });
});

describe("createShopHref", () => {
  it("resets to page 1 when a filter changes", () => {
    const onPageThree = { ...baseParams, page: 3 };

    expect(createShopHref(onPageThree, { category: "kitchen" })).toBe(
      "/shop?category=kitchen",
    );
  });

  it("carries an explicit page number forward", () => {
    expect(createShopHref(baseParams, { page: 2 })).toBe("/shop?page=2");
  });

  it("omits page from the URL when it's 1", () => {
    expect(createShopHref(baseParams, { page: 1 })).toBe("/shop");
  });

  it("uses a custom base path (category pages)", () => {
    expect(
      createShopHref(baseParams, { page: 2 }, "/categories/kitchen"),
    ).toBe("/categories/kitchen?page=2");
  });
});
