import {
  BadgePercent,
  Gamepad2,
  Headphones,
  Home,
  Laptop,
  Shirt,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type HomeCategory = {
  id: string;
  name: string;
  description: string;
  href: string;
  image: string;
  icon: LucideIcon;
};

export type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  badge?: string;
};

export type HomeBrand = {
  id: string;
  name: string;
  description: string;
  href: string;
  logoLabel: string;
};

export type TrustItem = {
  title: string;
  description: string;
};
export type HomeCategoryRail = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  products: HomeProduct[];
};

export const heroHighlights: string[] = [
  "Multi-category shopping",
  "Trusted brands",
  "Fast checkout",
];

export const homeCategories: HomeCategory[] = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Phones, audio, accessories, and smart essentials.",
    href: "/shop?category=electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop",
    icon: Laptop,
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Everyday style, footwear, bags, and accessories.",
    href: "/shop?category=fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
    icon: Shirt,
  },
  {
    id: "home-living",
    name: "Home & Living",
    description: "Useful products for better spaces and daily routines.",
    href: "/shop?category=home-living",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
    icon: Home,
  },
  {
    id: "beauty-care",
    name: "Beauty & Care",
    description: "Personal care, grooming, wellness, and daily essentials.",
    href: "/shop?category=beauty-care",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop",
    icon: Sparkles,
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Gear, accessories, and entertainment picks.",
    href: "/shop?category=gaming",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop",
    icon: Gamepad2,
  },
  {
    id: "deals",
    name: "Deals",
    description: "Limited-time offers across popular categories.",
    href: "/shop?sort=deals",
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1200&auto=format&fit=crop",
    icon: BadgePercent,
  },
];

export const featuredDeals: HomeProduct[] = [
  {
    id: "noise-canceling-headphones",
    name: "Noise Canceling Headphones",
    slug: "noise-canceling-headphones",
    brand: "SoundCore",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    price: 89,
    compareAtPrice: 129,
    rating: 4.7,
    reviewCount: 1248,
    badge: "Deal",
  },
  {
    id: "minimal-backpack",
    name: "Everyday Minimal Backpack",
    slug: "minimal-backpack",
    brand: "Zemlo",
    category: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
    price: 54,
    compareAtPrice: 72,
    rating: 4.6,
    reviewCount: 842,
    badge: "Popular",
  },
  {
    id: "smart-desk-lamp",
    name: "Smart Desk Lamp",
    slug: "smart-desk-lamp",
    brand: "Luma",
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop",
    price: 38,
    compareAtPrice: 49,
    rating: 4.5,
    reviewCount: 391,
    badge: "Save 22%",
  },
  {
    id: "wireless-keyboard",
    name: "Wireless Slim Keyboard",
    slug: "wireless-slim-keyboard",
    brand: "Keylab",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop",
    price: 42,
    compareAtPrice: 59,
    rating: 4.4,
    reviewCount: 674,
    badge: "New",
  },
  {
    id: "travel-organizer",
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
    badge: "Save 34%",
  },
  {
    id: "smart-watch-band",
    name: "Smart Watch Band",
    slug: "smart-watch-band",
    brand: "Wearly",
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop",
    price: 18,
    compareAtPrice: 25,
    rating: 4.3,
    reviewCount: 221,
    badge: "Deal",
  },
];

export const popularProducts: HomeProduct[] = [
  {
    id: "daily-sneaker",
    name: "Daily Comfort Sneaker",
    slug: "daily-comfort-sneaker",
    brand: "UrbanStep",
    category: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    price: 76,
    rating: 4.8,
    reviewCount: 2140,
  },
  {
    id: "ceramic-mug-set",
    name: "Ceramic Mug Set",
    slug: "ceramic-mug-set",
    brand: "Casa",
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop",
    price: 24,
    rating: 4.6,
    reviewCount: 534,
  },
  {
    id: "skin-care-kit",
    name: "Daily Skin Care Kit",
    slug: "daily-skin-care-kit",
    brand: "GlowLab",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
    price: 39,
    rating: 4.7,
    reviewCount: 981,
  },
  {
    id: "portable-speaker",
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    brand: "SoundCore",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop",
    price: 46,
    rating: 4.5,
    reviewCount: 756,
  },
  {
    id: "desk-mat",
    name: "Premium Desk Mat",
    slug: "premium-desk-mat",
    brand: "Workly",
    category: "Office",
    image:
      "https://images.unsplash.com/photo-1616627985595-908efb9c28b4?q=80&w=1000&auto=format&fit=crop",
    price: 32,
    rating: 4.6,
    reviewCount: 442,
  },
  {
    id: "water-bottle",
    name: "Insulated Water Bottle",
    slug: "insulated-water-bottle",
    brand: "Hydra",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop",
    price: 28,
    rating: 4.7,
    reviewCount: 893,
  },
];

export const featuredBrands: HomeBrand[] = [
  {
    id: "zemlo",
    name: "Zemlo",
    description: "Our own essentials, designed for everyday use.",
    href: "/brands/zemlo",
    logoLabel: "ZM",
  },
  {
    id: "soundcore",
    name: "SoundCore",
    description: "Audio gear for work, travel, and entertainment.",
    href: "/brands/soundcore",
    logoLabel: "SC",
  },
  {
    id: "glowlab",
    name: "GlowLab",
    description: "Personal care picks for simple daily routines.",
    href: "/brands/glowlab",
    logoLabel: "GL",
  },
  {
    id: "casa",
    name: "Casa",
    description: "Home and kitchen products with a clean feel.",
    href: "/brands/casa",
    logoLabel: "CA",
  },
];

export const trustItems: TrustItem[] = [
  {
    title: "Curated marketplace",
    description: "A flexible store for multiple brands and categories.",
  },
  {
    title: "Simple checkout",
    description: "Built to support cart, guest checkout, and Stripe payments.",
  },
  {
    title: "Product-first experience",
    description: "Reusable sections ready for real backend catalog data.",
  },
];

export const heroQuickLinks = [
  {
    label: "Shop electronics",
    href: "/shop?category=electronics",
    icon: Headphones,
  },
  {
    label: "Explore fashion",
    href: "/shop?category=fashion",
    icon: Shirt,
  },
  {
    label: "View deals",
    href: "/shop?sort=deals",
    icon: BadgePercent,
  },
  {
    label: "All products",
    href: "/shop",
    icon: ShoppingBag,
  },
];

export const categoryRails: HomeCategoryRail[] = [
  {
    id: "electronics-picks",
    eyebrow: "Electronics picks",
    title: "Smart tech for everyday use.",
    description:
      "Audio, accessories, desk gear, and portable essentials for work and entertainment.",
    href: "/shop?category=electronics",
    products: [
      {
        id: "noise-canceling-headphones-rail",
        name: "Noise Canceling Headphones",
        slug: "noise-canceling-headphones",
        brand: "SoundCore",
        category: "Audio",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        price: 89,
        compareAtPrice: 129,
        rating: 4.7,
        reviewCount: 1248,
        badge: "Deal",
      },
      {
        id: "portable-speaker-rail",
        name: "Portable Bluetooth Speaker",
        slug: "portable-bluetooth-speaker",
        brand: "SoundCore",
        category: "Audio",
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop",
        price: 46,
        rating: 4.5,
        reviewCount: 756,
      },
      {
        id: "wireless-keyboard-rail",
        name: "Wireless Slim Keyboard",
        slug: "wireless-slim-keyboard",
        brand: "Keylab",
        category: "Accessories",
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop",
        price: 42,
        compareAtPrice: 59,
        rating: 4.4,
        reviewCount: 674,
        badge: "New",
      },
      {
        id: "desk-mat-rail",
        name: "Premium Desk Mat",
        slug: "premium-desk-mat",
        brand: "Workly",
        category: "Office",
        image:
          "https://images.unsplash.com/photo-1616627985595-908efb9c28b4?q=80&w=1000&auto=format&fit=crop",
        price: 32,
        rating: 4.6,
        reviewCount: 442,
      },
      {
        id: "smart-watch-band-rail",
        name: "Smart Watch Band",
        slug: "smart-watch-band",
        brand: "Wearly",
        category: "Wearables",
        image:
          "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop",
        price: 18,
        compareAtPrice: 25,
        rating: 4.3,
        reviewCount: 221,
        badge: "Deal",
      },
      {
        id: "tablet-stand-rail",
        name: "Adjustable Tablet Stand",
        slug: "adjustable-tablet-stand",
        brand: "Deskly",
        category: "Accessories",
        image:
          "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?q=80&w=1000&auto=format&fit=crop",
        price: 26,
        rating: 4.4,
        reviewCount: 309,
      },
    ],
  },
  {
    id: "home-essentials",
    eyebrow: "Home essentials",
    title: "Useful finds for better spaces.",
    description:
      "Simple products for kitchen, desk, storage, lighting, and everyday routines.",
    href: "/shop?category=home-living",
    products: [
      {
        id: "ceramic-mug-set-rail",
        name: "Ceramic Mug Set",
        slug: "ceramic-mug-set",
        brand: "Casa",
        category: "Kitchen",
        image:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop",
        price: 24,
        rating: 4.6,
        reviewCount: 534,
      },
      {
        id: "smart-desk-lamp-rail",
        name: "Smart Desk Lamp",
        slug: "smart-desk-lamp",
        brand: "Luma",
        category: "Home",
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop",
        price: 38,
        compareAtPrice: 49,
        rating: 4.5,
        reviewCount: 391,
        badge: "Save 22%",
      },
      {
        id: "storage-basket-rail",
        name: "Woven Storage Basket",
        slug: "woven-storage-basket",
        brand: "Casa",
        category: "Storage",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop",
        price: 34,
        rating: 4.4,
        reviewCount: 286,
      },
      {
        id: "glass-food-containers-rail",
        name: "Glass Food Containers",
        slug: "glass-food-containers",
        brand: "Kitchenly",
        category: "Kitchen",
        image:
          "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=1000&auto=format&fit=crop",
        price: 31,
        rating: 4.5,
        reviewCount: 492,
      },
      {
        id: "linen-throw-rail",
        name: "Soft Linen Throw",
        slug: "soft-linen-throw",
        brand: "Casa",
        category: "Living",
        image:
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop",
        price: 44,
        rating: 4.6,
        reviewCount: 365,
      },
      {
        id: "minimal-wall-clock-rail",
        name: "Minimal Wall Clock",
        slug: "minimal-wall-clock",
        brand: "Roomly",
        category: "Decor",
        image:
          "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1000&auto=format&fit=crop",
        price: 28,
        rating: 4.3,
        reviewCount: 178,
      },
    ],
  },
  {
    id: "beauty-care",
    eyebrow: "Beauty & care",
    title: "Daily care without the noise.",
    description:
      "Personal care, grooming, wellness, and clean routine essentials.",
    href: "/shop?category=beauty-care",
    products: [
      {
        id: "skin-care-kit-rail",
        name: "Daily Skin Care Kit",
        slug: "daily-skin-care-kit",
        brand: "GlowLab",
        category: "Beauty",
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
        price: 39,
        rating: 4.7,
        reviewCount: 981,
      },
      {
        id: "body-wash-set-rail",
        name: "Body Wash Set",
        slug: "body-wash-set",
        brand: "GlowLab",
        category: "Care",
        image:
          "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop",
        price: 22,
        rating: 4.5,
        reviewCount: 318,
      },
      {
        id: "grooming-kit-rail",
        name: "Travel Grooming Kit",
        slug: "travel-grooming-kit",
        brand: "Carely",
        category: "Grooming",
        image:
          "https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=1000&auto=format&fit=crop",
        price: 36,
        compareAtPrice: 48,
        rating: 4.4,
        reviewCount: 264,
        badge: "Deal",
      },
      {
        id: "aroma-diffuser-rail",
        name: "Aroma Diffuser",
        slug: "aroma-diffuser",
        brand: "Calm",
        category: "Wellness",
        image:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop",
        price: 41,
        rating: 4.6,
        reviewCount: 507,
      },
      {
        id: "hand-cream-duo-rail",
        name: "Hand Cream Duo",
        slug: "hand-cream-duo",
        brand: "GlowLab",
        category: "Care",
        image:
          "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1000&auto=format&fit=crop",
        price: 18,
        rating: 4.5,
        reviewCount: 201,
      },
      {
        id: "wellness-towel-set-rail",
        name: "Wellness Towel Set",
        slug: "wellness-towel-set",
        brand: "Casa",
        category: "Wellness",
        image:
          "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?q=80&w=1000&auto=format&fit=crop",
        price: 35,
        rating: 4.3,
        reviewCount: 156,
      },
    ],
  },
];
