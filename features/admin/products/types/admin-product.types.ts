export type AdminProductStatus = "DRAFT" | "ACTIVE";

export type CreateAdminProductImageInput = {
  url: string;
  altText?: string;
  position?: number;
  isDefault?: boolean;
};

export type CreateAdminProductInput = {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock?: number;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  hasVariants?: boolean;
  status?: AdminProductStatus;
  isFeatured?: boolean;
  categoryId: string;
  brandId?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  keywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  images?: CreateAdminProductImageInput[];
};

export type CreatedAdminProduct = {
  id: string;
  name: string;
  slug: string;
  status: string;
  price: string | number;
  stock: number;
};
