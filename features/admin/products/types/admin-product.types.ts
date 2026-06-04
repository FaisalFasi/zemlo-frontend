export type AdminProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

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

export type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: string | number;
  compareAtPrice: string | number | null;
  stock: number;
  status: AdminProductStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: {
    id: string;
    url: string;
    altText: string | null;
    position: number;
    isDefault: boolean;
  }[];
};

export type AdminProductDetail = AdminProductListItem & {
  description: string | null;
  shortDescription: string | null;
  costPrice: string | number | null;
  trackInventory: boolean;
  allowBackorder: boolean;
  hasVariants: boolean;
  weight: string | number | null;
  length: string | number | null;
  width: string | number | null;
  height: string | number | null;
  keywords: string[];
  metaTitle: string | null;
  metaDescription: string | null;
};

export type UpdateAdminProductInput = Partial<CreateAdminProductInput>;
export type CreatedAdminProduct = AdminProductListItem;

export type ArchiveAdminProductResponse = {
  message: string;
};
