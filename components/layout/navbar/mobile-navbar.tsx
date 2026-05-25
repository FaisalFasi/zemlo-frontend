"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { AppSidebar } from "./app-sidebar";

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="rounded-full text-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <AppSidebar onNavigate={() => setOpen(false)} />
    </Sheet>
  );
};

export default MobileNavbar;
