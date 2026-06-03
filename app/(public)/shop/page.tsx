import { serverConfig } from "@/config/server";
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

type ShopRoutePageProps = {
  searchParams: Promise<ShopSearchParams>;
};

function shouldUseDemoCatalog() {
  return serverConfig.demoCatalogEnabled;
}

async function getSafeShopData() {
  const [productsResult, categoriesResult] = await Promise.allSettled([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);

  const backendProducts =
    productsResult.status === "fulfilled" ? productsResult.value : [];

  const backendCategories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  const realProducts = backendProducts.map(mapCatalogProductToShopProduct);
  const useDemoCatalog = realProducts.length === 0 && shouldUseDemoCatalog();

  const products = useDemoCatalog ? demoShopProducts : realProducts;

  const categories =
    realProducts.length > 0
      ? mapCatalogCategoriesToShopCategories(backendCategories, products)
      : createShopCategoriesFromProducts(products);

  return {
    products,
    categories,
    isDemoCatalog: useDemoCatalog,
  };
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
