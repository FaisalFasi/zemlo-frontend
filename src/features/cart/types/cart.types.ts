export type CartProductImage = {
  id: string;
  url: string;
  altText: string | null;
  position: number;
  isDefault: boolean;
};

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  hasVariants: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  } | null;
  images: CartProductImage[];
};

export type CartVariant = {
  id: string;
  name: string;
  sku: string | null;
  price: number | null;
  compareAtPrice: number | null;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  image: string | null;
  options: unknown;
};

export type CartItem = {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  variantId: string | null;
  variantKey: string;
  addedAt: string;
  updatedAt: string;
  unitPrice: number;
  lineTotal: number;
  product: CartProduct;
  variant: CartVariant | null;
};

export type Cart = {
  id: string;
  userId: string | null;
  guestId: string | null;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
};

export type AddCartItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type UpdateCartItemInput = {
  quantity: number;
};
