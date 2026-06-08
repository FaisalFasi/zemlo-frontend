import type { HomeCategoryRail, HomeProduct } from "./home-page-data";

export const demoFeaturedDeals: HomeProduct[] = [
  {
    id: "demo-noise-canceling-headphones",
    name: "Noise Canceling Headphones",
    slug: "noise-canceling-headphones",
    brand: "SoundCore",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    price: 89,
    compareAtPrice: 129,
    rating: 4.7,
    reviewCount: 1248,
    badge: "Demo",
  },
  {
    id: "demo-minimal-backpack",
    name: "Everyday Minimal Backpack",
    slug: "minimal-backpack",
    brand: "Zemlo",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
    price: 54,
    compareAtPrice: 72,
    rating: 4.6,
    reviewCount: 842,
    badge: "Demo",
  },
  {
    id: "demo-smart-desk-lamp",
    name: "Smart Desk Lamp",
    slug: "smart-desk-lamp",
    brand: "Luma",
    category: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop",
    price: 38,
    compareAtPrice: 49,
    rating: 4.5,
    reviewCount: 391,
    badge: "Demo",
  },
  {
    id: "demo-wireless-keyboard",
    name: "Wireless Slim Keyboard",
    slug: "wireless-slim-keyboard",
    brand: "Keylab",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop",
    price: 42,
    compareAtPrice: 59,
    rating: 4.4,
    reviewCount: 674,
    badge: "Demo",
  },
  {
    id: "demo-travel-organizer",
    name: "Travel Organizer Set",
    slug: "travel-organizer-set",
    brand: "Nomad",
    category: "Travel",
    image:
      "https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1000&auto=format&fit=crop",
    price: 29,
    compareAtPrice: 44,
    rating: 4.6,
    reviewCount: 318,
    badge: "Demo",
  },
  {
    id: "demo-smart-watch-band",
    name: "Smart Watch Band",
    slug: "smart-watch-band",
    brand: "Wearly",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop",
    price: 18,
    compareAtPrice: 25,
    rating: 4.3,
    reviewCount: 221,
    badge: "Demo",
  },
];

export const demoPopularProducts: HomeProduct[] = [
  {
    id: "demo-daily-sneaker",
    name: "Daily Comfort Sneaker",
    slug: "daily-comfort-sneaker",
    brand: "UrbanStep",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    price: 76,
    rating: 4.8,
    reviewCount: 2140,
    badge: "Demo",
  },
  {
    id: "demo-ceramic-mug-set",
    name: "Ceramic Mug Set",
    slug: "ceramic-mug-set",
    brand: "Casa",
    category: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop",
    price: 24,
    rating: 4.6,
    reviewCount: 534,
    badge: "Demo",
  },
  {
    id: "demo-skin-care-kit",
    name: "Daily Skin Care Kit",
    slug: "daily-skin-care-kit",
    brand: "GlowLab",
    category: "Beauty & Care",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
    price: 39,
    rating: 4.7,
    reviewCount: 981,
    badge: "Demo",
  },
  {
    id: "demo-portable-speaker",
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    brand: "SoundCore",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop",
    price: 46,
    rating: 4.5,
    reviewCount: 756,
    badge: "Demo",
  },
  {
    id: "demo-desk-mat",
    name: "Premium Desk Mat",
    slug: "premium-desk-mat",
    brand: "Workly",
    category: "Office",
    image:
      "https://images.unsplash.com/photo-1616627985595-908efb9c28b4?q=80&w=1000&auto=format&fit=crop",
    price: 32,
    rating: 4.6,
    reviewCount: 442,
    badge: "Demo",
  },
  {
    id: "demo-water-bottle",
    name: "Insulated Water Bottle",
    slug: "insulated-water-bottle",
    brand: "Hydra",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop",
    price: 28,
    rating: 4.7,
    reviewCount: 893,
    badge: "Demo",
  },
];

export const demoCategoryRails: HomeCategoryRail[] = [
  {
    id: "demo-electronics-picks",
    eyebrow: "Electronics picks",
    title: "Smart tech for everyday use.",
    description:
      "Demo products for audio, accessories, desk gear, and portable essentials.",
    href: "/shop?category=electronics",
    products: demoFeaturedDeals.filter(
      (product) => product.category === "Electronics",
    ),
  },
  {
    id: "demo-home-essentials",
    eyebrow: "Home essentials",
    title: "Useful finds for better spaces.",
    description:
      "Demo products for kitchen, desk, storage, lighting, and everyday routines.",
    href: "/shop?category=home-living",
    products: demoPopularProducts.filter(
      (product) => product.category === "Home & Living",
    ),
  },
  {
    id: "demo-beauty-care",
    eyebrow: "Beauty & care",
    title: "Daily care without the noise.",
    description:
      "Demo products for personal care, grooming, wellness, and clean routines.",
    href: "/shop?category=beauty-care",
    products: demoPopularProducts.filter(
      (product) => product.category === "Beauty & Care",
    ),
  },
];
