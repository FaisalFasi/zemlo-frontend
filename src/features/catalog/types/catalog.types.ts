export type CatalogImage = {
  id: string;
  url: string;
  altText: string | null;
  position: number;
  isDefault: boolean;
};

export type CatalogCategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogBrandSummary = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};

export type CatalogProductVariant = {
  id: string;
  name: string;
  sku: string | null;
  price: string | number;
  compareAtPrice: string | number | null;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  image: string | null;
  options: unknown;
};

export type CatalogProductListItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: string | number;
  compareAtPrice: string | number | null;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  hasVariants: boolean;
  isFeatured: boolean;
  keywords: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  category: CatalogCategorySummary;
  brand: CatalogBrandSummary | null;
  images: CatalogImage[];
  variants: CatalogProductVariant[];
};

export type CatalogProductDetail = CatalogProductListItem & {
  description: string | null;
  sku: string | null;
  weight: string | number | null;
  length: string | number | null;
  width: string | number | null;
  height: string | number | null;
  brand:
    | (CatalogBrandSummary & {
        description: string | null;
        website: string | null;
      })
    | null;
};

export type CatalogCategoryChild = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
};

export type CatalogCategory = CatalogCategoryChild & {
  children: CatalogCategoryChild[];
};

export type CatalogBrand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
};
