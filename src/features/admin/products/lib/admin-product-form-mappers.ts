import type {
  CreateAdminProductFormInput,
  CreateAdminProductFormValues,
} from "../schemas/create-admin-product.schema";
import type {
  AdminProductDetail,
  CreateAdminProductInput,
  UpdateAdminProductInput,
} from "../types/admin-product.types";

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function getKeywords(value?: string) {
  if (!value) return undefined;

  const keywords = value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return keywords.length > 0 ? keywords : undefined;
}

export function productFormValuesToCreateInput(
  values: CreateAdminProductFormValues,
): CreateAdminProductInput {
  return {
    name: values.name,
    slug: values.slug || undefined,
    sku: values.sku || undefined,
    categoryId: values.categoryId,
    brandId: values.brandId || undefined,
    shortDescription: values.shortDescription || undefined,
    description: values.description || undefined,
    price: values.price,
    compareAtPrice: values.compareAtPrice,
    costPrice: values.costPrice,
    stock: values.stock,
    trackInventory: values.trackInventory,
    allowBackorder: values.allowBackorder,
    // EXPLANATION: hasVariants yahan se hata diya — backend isay khud
    // manage karta hai (variant add/delete par recalculate). Yahan se
    // false bhejna variants wale products ko tor deta tha.
    status: values.status,
    isFeatured: values.isFeatured,
    weight: values.weight,
    length: values.length,
    width: values.width,
    height: values.height,
    keywords: getKeywords(values.keywordsText),
    metaTitle: values.metaTitle || undefined,
    metaDescription: values.metaDescription || undefined,
    images: [
      {
        url: values.imageUrl,
        altText: values.imageAlt || values.name,
        position: 0,
        isDefault: true,
      },
    ],
  };
}

export function productFormValuesToUpdateInput(
  values: CreateAdminProductFormValues,
): UpdateAdminProductInput {
  return productFormValuesToCreateInput(values);
}

export function adminProductDetailToFormInput(
  product: AdminProductDetail,
): CreateAdminProductFormInput {
  const defaultImage =
    product.images.find((image) => image.isDefault) ?? product.images[0];

  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? "",
    categoryId: product.category.id,
    brandId: product.brand?.id ?? "",
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    price: toNumber(product.price) ?? 0,
    compareAtPrice: toNumber(product.compareAtPrice),
    costPrice: toNumber(product.costPrice),
    stock: product.stock,
    // EXPLANATION: pehle ARCHIVED ko chupke se DRAFT bana deta tha —
    // ab asal status form mein aata hai (select mein ARCHIVED option bhi hai).
    status: product.status,
    isFeatured: product.isFeatured,
    trackInventory: product.trackInventory,
    allowBackorder: product.allowBackorder,
    imageUrl: defaultImage?.url ?? "",
    imageAlt: defaultImage?.altText ?? product.name,
    keywordsText: product.keywords?.join(", ") ?? "",
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
    weight: toNumber(product.weight),
    length: toNumber(product.length),
    width: toNumber(product.width),
    height: toNumber(product.height),
  };
}
