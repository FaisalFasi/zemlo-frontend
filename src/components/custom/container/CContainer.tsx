import { cn } from "@/src/lib/utils";
import React from "react";

type CContinerProps = {
  children: React.ReactNode;
  className?: string;
};

export const CContainer = ({ children, className }: CContinerProps) => {
  return (
    <div className={cn(`w-full h-full md:px-10 lg:px-15 xl:px-25`, className)}>
      {children}
    </div>
  );
};
