"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CButton } from "../../custom/button/CButton";
import { menuItems } from "./menu-items";
import { X } from "lucide-react";

export function AppSidebar() {
  const pathName = usePathname();

  const { toggleSidebar } = useSidebar();

  const isActive = (url: string) => {
    if (url == "/") {
      return pathName === "/";
    }
    return pathName?.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold my-4 ">
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2">
                <Image
                  src={"/images/logo/icon.png"}
                  alt="logo"
                  className="object-contain"
                  height={30}
                  width={30}
                />
                <h3>Zemlo</h3>
              </div>
              <CButton
                type="button"
                btnSmall={true}
                variant="ghost"
                hoverAffect={false}
                onClick={toggleSidebar}
              >
                <X className="size-6!" />
              </CButton>
            </div>
          </SidebarGroupLabel>
          <hr />
          <SidebarGroupContent className="mt-6">
            <SidebarMenu>
              {menuItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={` ${
                          active && "text-primary-600"
                        } h-full w-full text-primary-300 no-underline `}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-[1rem]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
