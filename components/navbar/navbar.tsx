"use client";
import Image from "next/image";
import MobileNavbar from "./mobile-navbar";
import { LogIn, Search, ShoppingCart } from "lucide-react";
import { CButton } from "../custom/button/CButton";
import { menuItems } from "./menu-items";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathName = usePathname();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathName === "/";
    }

    return pathName?.startsWith(url);
  };

  return (
    <div className="h-16 min-w-screen flex justify-between items-center align-middle  p-4 md:px-6 text-black shadow-md border-black bg-white">
      <div className="block md:hidden w-fit h-fit">
        <MobileNavbar />
      </div>
      <div>
        <Link href={"/"}>
          <Image
            src={"/images/logo/logo.png"}
            alt="logo"
            width={120}
            height={120}
            quality={100}
          />
        </Link>
      </div>

      <ul className="hidden md:flex gap-6 items-center justify-center m-0">
        {menuItems.map((item) => {
          const active = isActive(item.url);
          return (
            <li key={item.title} className={`m-0 `}>
              <Link
                href={item.url}
                className={`text-primary-400 hover:text-primary-600 no-underline ${
                  active && "text-primary-600"
                }`}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-center items-center gap-3">
        <CButton type="button" variant={"ghost"} btnSmall={true}>
          <Search className="size-5" />
        </CButton>

        <CButton type="button" btnSmall={true} variant={"ghost"}>
          <ShoppingCart className="size-5" />
        </CButton>
        <CButton type="button" btnSmall={true} variant={"ghost"}>
          <LogIn className="size-5" />
        </CButton>
      </div>
    </div>
  );
};
export default Navbar;
