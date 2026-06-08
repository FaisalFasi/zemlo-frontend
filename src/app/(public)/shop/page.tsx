import type { Metadata } from "next";

import { serverConfig } from "@/shared/config/server";
import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";

import {
  getCatalogCategories,
  getCatalogProducts,
} from "@/features/catalog/api/catalog-api";
import { demoShopProducts } from "@/features/shop/data/demo-shop-products";
import { resolveShopSearchParams } from "@/features/shop/lib/shop-filters";
import {
  createShopCategoriesFromProducts,
  mapCatalogCategoriesToShopCategories,
  mapCatalogProductToShopProduct,
} from "@/features/shop/lib/shop-prodct-mappers";
import ShopPage from "@/features/shop/ShopPage";
import type { ShopSearchParams } from "@/features/shop/types/shop.types";

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: "Shop",
  description:
    "Explore Zemlo products across curated categories, brands, and everyday essentials.",
  path: routes.shop,
});

type ShopRoutePageProps = {
  searchParams: Promise<ShopSearchParams>;
};

function shouldUseDemoCatalog() {
  return serverConfig.demoCatalogEnabled;
}

async function getSafeShopData() {
  try {
    const [productsResult, categoriesResult] = await Promise.all([
      getCatalogProducts(),
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

export default async function ShopRoutePage({
  searchParams,
}: ShopRoutePageProps) {
  const resolvedSearchParams = await searchParams;
  const params = resolveShopSearchParams(resolvedSearchParams);
  const shopData = await getSafeShopData();

  return (
    <ShopPage
      products={shopData.products}
      categories={shopData.categories}
      params={params}
      isDemoCatalog={shopData.isDemoCatalog}
    />
  );
}
