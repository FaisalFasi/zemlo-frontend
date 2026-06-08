export const routes = Object.freeze({
  home: "/",
  shop: "/shop",
  cart: "/cart",
  checkout: "/checkout",

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

// export const routes = Object.freeze({
//   home: "/",
//   shop: "/shop",
//   cart: "/cart",
//   checkout: "/checkout",

//   admin: {
//     root: "/admin",
//     login: "/admin/login",
//     products: "/admin/products",
//     createProduct: "/admin/products/new",
//     editProduct: (productId: string) => `/admin/products/${productId}/edit`,
//   },

//   productDetail: (slug: string) => `/products/${slug}`,
// } as const);
