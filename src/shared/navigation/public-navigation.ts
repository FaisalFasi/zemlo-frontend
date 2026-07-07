import {
  BookOpen,
  Contact,
  Home,
  Newspaper,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

import { routes } from "@/shared/config/routes";

export type NavigationItem = {
  title: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

export const mainNavigationItems = [
  {
    title: "Home",
    href: routes.home,
    description: "Return to the Zemlo homepage.",
    icon: Home,
  },
  {
    title: "Shop",
    href: routes.shop,
    description: "Explore products and collections.",
    icon: ShoppingBag,
  },
  {
    title: "Our Story",
    href: routes.company.story,
    description: "Learn more about Zemlo.",
    icon: BookOpen,
  },
  {
    title: "Journal",
    href: routes.company.blog,
    description: "Guides, updates, and product stories.",
    icon: Newspaper,
  },
  {
    title: "Contact",
    href: routes.company.contact,
    description: "Get in touch with us.",
    icon: Contact,
  },
] as const satisfies NavigationItem[];

export const footerNavigationGroups = [
  {
    title: "Shop",
    items: [
      {
        title: "All products",
        href: routes.shop,
      },
      {
        title: "Cart",
        href: routes.cart,
      },
      {
        title: "Checkout",
        href: routes.checkout,
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        title: "Our Story",
        href: routes.company.story,
      },
      {
        title: "Journal",
        href: routes.company.blog,
      },
      {
        title: "Contact",
        href: routes.company.contact,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Shipping",
        href: routes.legal.shipping,
      },
      {
        title: "Returns",
        href: routes.legal.returns,
      },
      {
        title: "Privacy",
        href: routes.legal.privacy,
      },
    ],
  },
  {
    title: "Legal",
    items: [
      {
        title: "Impressum",
        href: routes.legal.impressum,
      },
      {
        title: "Terms",
        href: routes.legal.terms,
      },
      {
        title: "Privacy Policy",
        href: routes.legal.privacy,
      },
    ],
  },
] as const satisfies NavigationGroup[];
