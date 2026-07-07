export type ProductImage = {
  id: string;
  url: string;
  alt: string;
};

export type ProductBrand = {
  name: string;
  slug: string;
  description?: string | null;
};

export type ProductCategory = {
  name: string;
  slug: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string | null;
  options: unknown;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categorySlug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  stock?: number;
  isFeatured?: boolean;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku?: string | null;
  brand?: ProductBrand | null;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  stock: number;
  hasVariants: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  specs: ProductSpec[];
  badge?: string;
  isDemo?: boolean;
};

export type ProductCategoryFilter = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};
