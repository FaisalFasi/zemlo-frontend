/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Shop ka data-loader — products + categories backend se
 * lana, aur API fail/khali hone par demo-catalog fallback. Ye logic
 * pehle shop/page.tsx ke andar private thi; ab yahan shared hai.
 * REASON: Category pages (/categories/[slug]) ko bhi yehi data chahiye.
 * Copy-paste karte to do jagah maintain karna parta — "ek logic, ek
 * jagah" rule.
 * RISK: Zero — code as-is move hua hai, behaviour identical.
 * ═════════════════════════════════════════════════════════════════
 */
import "server-only";

import {
  getAllCatalogProducts,
  getCatalogCategories,
} from "@/features/catalog/api/catalog-api";
import { serverConfig } from "@/shared/config/server";

import { demoShopProducts } from "../data/demo-shop-products";
import {
  createShopCategoriesFromProducts,
  mapCatalogCategoriesToShopCategories,
  mapCatalogProductToShopProduct,
} from "./shop-product-mappers";

function shouldUseDemoCatalog() {
  return serverConfig.demoCatalogEnabled;
}

export async function getSafeShopData() {
  try {
    const [productsResult, categoriesResult] = await Promise.all([
      getAllCatalogProducts(),
      getCatalogCategories(),
    ]);

    const realProducts = productsResult.map(mapCatalogProductToShopProduct);
    const useDemoCatalog = realProducts.length === 0 && shouldUseDemoCatalog();
    const products = useDemoCatalog ? demoShopProducts : realProducts;

    const categories =
      realProducts.length > 0
        ? mapCatalogCategoriesToShopCategories(categoriesResult, products)
        : createShopCategoriesFromProducts(products);

    return {
      products,
      categories,
      isDemoCatalog: useDemoCatalog,
    };
  } catch {
    if (!shouldUseDemoCatalog()) {
      return {
        products: [],
        categories: [],
        isDemoCatalog: false,
      };
    }

    return {
      products: demoShopProducts,
      categories: createShopCategoriesFromProducts(demoShopProducts),
      isDemoCatalog: true,
    };
  }
}
