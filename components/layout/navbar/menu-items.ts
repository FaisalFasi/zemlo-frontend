import {
  BookOpen,
  Contact,
  Home,
  Newspaper,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export type NavbarMenuItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const menuItems: NavbarMenuItem[] = [
  {
    title: "Home",
    href: "/",
    description: "Return to the Zemlo homepage.",
    icon: Home,
  },
  {
    title: "Shop",
    href: "/shop",
    description: "Explore products and collections.",
    icon: ShoppingBag,
  },
  {
    title: "Our Story",
    href: "/story",
    description: "Learn more about Zemlo.",
    icon: BookOpen,
  },
  {
    title: "Journal",
    href: "/blog",
    description: "Style notes and updates.",
    icon: Newspaper,
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch with us.",
    icon: Contact,
  },
];
