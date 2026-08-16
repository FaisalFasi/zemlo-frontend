"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

import AdminNavLinks, { type AdminNavItem } from "./AdminNavLinks";

type AdminMobileNavProps = {
  items: AdminNavItem[];
};

// Below `lg` the desktop `<aside>` sidebar is hidden — this is its
// replacement: a hamburger button that opens the same nav list in a
// drawer, so a mobile admin isn't forced to scroll past 6 nav links
// above the fold on every single page.
export default function AdminMobileNav({ items }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open admin menu"
          className="rounded-full text-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[min(85vw,20rem)] p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Zemlo Admin</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <AdminNavLinks items={items} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
