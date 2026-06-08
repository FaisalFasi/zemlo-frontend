import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCatalogProductBySlug } from "@/features/catalog/api/catalog-api";
import { mapCatalogProductToProductDetail } from "@/features/product-detail/data/demo-product-details";
import {
  createProductJsonLd,
  createProductMetadata,
} from "@/features/product-detail/lib/product-seo";
import { getDemoProductDetailBySlug } from "@/features/product-detail/lib/product-detail-mappers";
import ProductDetailPage from "@/features/product-detail/ProductDetailPage";
import { serverConfig } from "@/shared/config/server";
import { safeJsonLd } from "@/shared/lib/seo";

export const revalidate = 300;

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

export async function generateMetadata({
  params,
}: ProductRoutePageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSafeProductDetail(slug);

  if (!product) {
    return {
      title: "Product not found | Zemlo",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return createProductMetadata(product);
}

export default async function ProductRoutePage({
  params,
}: ProductRoutePageProps) {
  const { slug } = await params;
  const product = await getSafeProductDetail(slug);

  if (!product) {
    notFound();
  }

  const productJsonLd = createProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(productJsonLd),
        }}
      />

      <ProductDetailPage product={product} />
    </>
  );
}
