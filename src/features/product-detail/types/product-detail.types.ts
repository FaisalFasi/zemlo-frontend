export type ProductDetailImage = {
  id: string;
  url: string;
  alt: string;
};

export type ProductDetailVariant = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string | null;
  options: unknown;
};

export type ProductDetailSpec = {
  label: string;
  value: string;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku?: string | null;
  brand?: {
    name: string;
    slug: string;
    description?: string | null;
  } | null;
  category: {
    name: string;
    slug: string;
  };
  price: number;
  compareAtPrice?: number;
  stock: number;
  hasVariants: boolean;
  images: ProductDetailImage[];
  variants: ProductDetailVariant[];
  specs: ProductDetailSpec[];
  badge?: string;
  isDemo?: boolean;
};
