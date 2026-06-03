export const productFieldHelp = {
  name: {
    title: "Product name",
    description:
      "The public name customers will see on product cards, product detail page, cart, and checkout.",
    example: "Wireless Noise Canceling Headphones",
  },
  slug: {
    title: "Slug",
    description:
      "The URL-friendly version of the product name. If you leave it empty, backend can generate it from the product name.",
    example: "wireless-noise-canceling-headphones",
  },
  sku: {
    title: "SKU",
    description:
      "Internal stock keeping unit. It helps you identify and manage products in inventory, orders, and reports.",
    example: "WH-001-BLK",
  },
  categoryId: {
    title: "Category",
    description:
      "The main group this product belongs to. Customers use categories to browse and filter products.",
    example: "Electronics, Fashion, Home & Living",
  },
  brandId: {
    title: "Brand",
    description:
      "The brand or manufacturer of the product. Use this if you sell products from multiple brands.",
    example: "Zemlo, SoundCore, Nike, Samsung",
  },
  shortDescription: {
    title: "Short description",
    description:
      "A quick summary shown on product cards, product previews, and sometimes search results.",
    example: "Lightweight wireless headphones with long battery life.",
  },
  description: {
    title: "Description",
    description:
      "Full product details shown on the product page. Explain features, benefits, material, usage, and what is included.",
  },
  price: {
    title: "Price",
    description:
      "The actual selling price customers pay at checkout before tax, shipping, or discounts.",
    example: "49.99",
  },
  compareAtPrice: {
    title: "Compare at price",
    description:
      "The old or original price shown crossed out. Use it to show a sale or discount.",
    example: "Original price 69.99, selling price 49.99",
  },
  costPrice: {
    title: "Cost price",
    description:
      "Your internal cost to buy or produce this product. Customers do not see this. It helps calculate profit later.",
    example: "If you buy it for 25 and sell for 49.99, cost price is 25.",
  },
  stock: {
    title: "Stock",
    description:
      "How many units are available. Cart and checkout should use this to prevent overselling.",
    example: "10",
  },
  status: {
    title: "Status",
    description:
      "Active products are visible in the store. Draft products stay hidden until you are ready to publish them.",
    example: "Use Active for testing shop, product page, cart, and checkout.",
  },
  isFeatured: {
    title: "Featured product",
    description:
      "Marks this product as important. It can be used for homepage sections, featured rails, or promotions.",
  },
  trackInventory: {
    title: "Track inventory",
    description:
      "When enabled, the system tracks stock quantity and can block checkout if stock is unavailable.",
  },
  allowBackorder: {
    title: "Allow backorder",
    description:
      "Allows customers to order even when stock is 0. Use carefully, only if you can fulfill later.",
  },
  imageUrl: {
    title: "Image URL",
    description:
      "The product image link. For now we use URL input. Later this can be replaced with Cloudinary upload.",
    example: "https://example.com/headphones.jpg",
  },
  imageAlt: {
    title: "Image alt text",
    description:
      "Describes the image for accessibility and SEO. It should clearly explain what is shown.",
    example: "Black wireless headphones on white background",
  },
  keywords: {
    title: "Keywords",
    description:
      "Comma-separated search terms related to this product. These can help search and SEO later.",
    example: "audio, headphones, wireless, bluetooth",
  },
  metaTitle: {
    title: "Meta title",
    description:
      "SEO title shown in browser/search engines. Keep it short and clear.",
    example: "Wireless Headphones | Zemlo",
  },
  metaDescription: {
    title: "Meta description",
    description:
      "SEO description for search engines. Summarize the product in one or two useful sentences.",
  },
  weight: {
    title: "Weight",
    description:
      "Product weight used later for shipping calculations, labels, or delivery rules.",
    example: "0.5",
  },
  length: {
    title: "Length",
    description:
      "Product package length. Useful for shipping calculations later.",
  },
  width: {
    title: "Width",
    description:
      "Product package width. Useful for shipping calculations later.",
  },
  height: {
    title: "Height",
    description:
      "Product package height. Useful for shipping calculations later.",
  },
} as const;

export type ProductFieldHelpKey = keyof typeof productFieldHelp;
