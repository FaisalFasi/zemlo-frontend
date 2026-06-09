import type { LucideIcon } from "lucide-react";

import { mainNavigationItems } from "@/shared/config/navigation";

export type NavbarMenuItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const menuItems: NavbarMenuItem[] = mainNavigationItems.map((item) => ({
  title: item.title,
  href: item.href,
  description: item.description ?? "",
  icon: item.icon as LucideIcon,
}));
