import { notFound } from "next/navigation";

import { getCatalogProductBySlug } from "@/features/catalog/api/catalog-api";
import { getDemoProductDetailBySlug } from "@/features/product-detail/lib/product-detail-mappers";

import ProductDetailPage from "@/features/product-detail/ProductDetailPage";
import { mapCatalogProductToProductDetail } from "@/features/product-detail/data/demo-product-details";
import { serverConfig } from "@/config/server";

type ProductRoutePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function shouldUseDemoCatalog() {
  return serverConfig.demoCatalogEnabled;
}

async function getSafeProductDetail(slug: string) {
  try {
    const product = await getCatalogProductBySlug(slug);
    return mapCatalogProductToProductDetail(product);
  } catch {
    if (shouldUseDemoCatalog()) {
      return getDemoProductDetailBySlug(slug);
    }

    return null;
  }
}

export default async function ProductRoutePage({
  params,
}: ProductRoutePageProps) {
  const { slug } = await params;
  const product = await getSafeProductDetail(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
