/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Shop ka data-loader — ab ek specific PAGE ke products
 * backend se aate hain (search/category/sort/page sab backend-side),
 * poora catalog nahi. Category counts ke liye poori catalog ki ek
 * alag, chhoti fetch (public /categories endpoint per-category count
 * nahi deta — ye ek jaana-bujha tradeoff hai, is store ke scale par
 * sasta hai aur ISR se cached rehta hai).
 * REASON: Backend ne 2026-08-17 ko real pagination ship ki (GET
 * /products ab {items,total,page,limit,pageCount} deta hai) — pehle
 * poora catalog fetch ho kar server-render mein filter/sort hota tha,
 * jo scale nahi karta tha (Phase 5B, ROADMAP.md).
 * RISK: Zero — demo-catalog fallback (catalog khaali + flag on) wohi
 * purana client-side filter/sort/paginate logic use karta hai, kyunke
 * demo data ek chhota local array hai, backend se nahi aata.
 * ═════════════════════════════════════════════════════════════════
 */
import "server-only";

import {
  getAllCatalogProducts,
  getCatalogCategories,
  getCatalogProductsPage,
} from "@/features/catalog/api/catalog-api";
import { serverConfig } from "@/shared/config/server";

import { demoShopProducts } from "../data/demo-shop-products";
import { filterAndSortShopProducts } from "./shop-filters";
import {
  createShopCategoriesFromProducts,
  mapCatalogCategoriesToShopCategories,
  mapCatalogProductToShopProduct,
} from "./shop-product-mappers";
import type { ResolvedShopSearchParams } from "../types/shop.types";

export const SHOP_PAGE_SIZE = 24;

function shouldUseDemoCatalog() {
  return serverConfig.demoCatalogEnabled;
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;

  return items.slice(start, start + pageSize);
}

function buildDemoResult(params: ResolvedShopSearchParams) {
  const visible = filterAndSortShopProducts(demoShopProducts, params);

  return {
    products: paginate(visible, params.page, SHOP_PAGE_SIZE),
    total: visible.length,
    pageCount: Math.max(1, Math.ceil(visible.length / SHOP_PAGE_SIZE)),
    categories: createShopCategoriesFromProducts(demoShopProducts),
    isDemoCatalog: true,
  };
}

export async function getShopPageData(params: ResolvedShopSearchParams) {
  try {
    const [page, categoriesResult, allProducts] = await Promise.all([
      getCatalogProductsPage({
        page: params.page,
        limit: SHOP_PAGE_SIZE,
        search: params.q || undefined,
        category: params.category || undefined,
        sort: params.sort,
      }),
      getCatalogCategories(),
      getAllCatalogProducts(),
    ]);

    if (allProducts.length === 0 && shouldUseDemoCatalog()) {
      return buildDemoResult(params);
    }

    const productsForCategoryCounts = allProducts.map(
      mapCatalogProductToShopProduct,
    );

    return {
      products: page.items.map(mapCatalogProductToShopProduct),
      total: page.total,
      pageCount: Math.max(1, page.pageCount),
      categories: mapCatalogCategoriesToShopCategories(
        categoriesResult,
        productsForCategoryCounts,
      ),
      isDemoCatalog: false,
    };
  } catch {
    if (!shouldUseDemoCatalog()) {
      return {
        products: [],
        total: 0,
        pageCount: 1,
        categories: [],
        isDemoCatalog: false,
      };
    }

    return buildDemoResult(params);
  }
}
