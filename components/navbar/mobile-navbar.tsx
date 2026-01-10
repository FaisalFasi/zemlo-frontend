"use client";
import { TextAlignJustify } from "lucide-react";
import { SidebarProvider, useSidebar } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { cn } from "@/lib/utils";

type CustomSidebarTriggerProps = {
  className?: string;
  children?: React.ReactNode;
};

const MobileNavbar = () => {
  return (
    <div>
      <SidebarProvider className="min-h-fit">
        <AppSidebar />
        <CustomSidebarTrigger />
      </SidebarProvider>
    </div>
  );
};
export default MobileNavbar;

const CustomSidebarTrigger = ({
  className,
  children,
}: CustomSidebarTriggerProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className={cn("hover:text-primary-300 hover:cursor-pointer", className)}
      onClick={() => toggleSidebar()}
    >
      <TextAlignJustify className=" stroke-[2.5px] size-6" />
      {children && <>children</>}
    </button>
  );
};
