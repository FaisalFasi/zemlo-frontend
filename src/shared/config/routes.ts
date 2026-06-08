export const routes = Object.freeze({
  home: "/",
  shop: "/shop",
  cart: "/cart",
  checkout: "/checkout",
  checkoutSuccess: "/checkout/success",
  checkoutFailure: "/checkout/failure",

  legal: {
    impressum: "/impressum",
    privacy: "/privacy",
    terms: "/terms",
    returns: "/returns",
    shipping: "/shipping",
  },

  auth: {
    login: "/login",
    register: "/register",
  },

  admin: {
    root: "/admin",
    login: "/admin/login",
    products: "/admin/products",
    createProduct: "/admin/products/new",
    editProduct: (productId: string) => `/admin/products/${productId}/edit`,
  },

  productDetail: (slug: string) => `/products/${slug}`,
  categoryDetail: (slug: string) => `/categories/${slug}`,
} as const);
