import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  muted?: boolean;
};

type AdminNavLinksProps = {
  items: AdminNavItem[];
  onNavigate?: () => void;
};

// The ONE list of admin sidebar links, rendered both by the always-visible
// desktop `<aside>` and the mobile Sheet drawer (`AdminMobileNav`) — one
// place to add/remove a link instead of keeping two copies in sync.
export default function AdminNavLinks({ items, onNavigate }: AdminNavLinksProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium no-underline hover:bg-muted",
            item.muted
              ? "text-muted-foreground hover:text-foreground"
              : "text-foreground",
          )}
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
