import { demoShopProducts } from "@/features/shop/data/demo-shop-products";

import type { ProductDetail } from "../types/product-detail.types";

export function getDemoProductDetailBySlug(slug: string): ProductDetail | null {
  const product = demoShopProducts.find((item) => item.slug === slug);

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description:
      "This is a demo product used while the admin dashboard and real product catalog are being prepared. The layout is production-ready, but this item is not a real purchasable product yet.",
    shortDescription:
      "Demo catalog item for previewing the product detail experience.",
    brand: {
      name: product.brand,
      slug: product.brand.toLowerCase().replaceAll(" ", "-"),
      description: null,
    },
    category: {
      name: product.category,
      slug: product.categorySlug,
    },
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: 12,
    hasVariants: false,
    images: [
      {
        id: `${product.id}-main`,
        url: product.image,
        alt: product.name,
      },
      {
        id: `${product.id}-secondary`,
        url: product.image,
        alt: `${product.name} alternate view`,
      },
    ],
    variants: [],
    specs: [
      {
        label: "Catalog mode",
        value: "Demo product",
      },
      {
        label: "Category",
        value: product.category,
      },
      {
        label: "Brand",
        value: product.brand,
      },
    ],
    badge: product.badge ?? "Demo",
    isDemo: true,
  };
}
