import { cn } from "@/lib/utils";
import React from "react";

type CContinerProps = {
  children: React.ReactNode;
  className?: string;
};

export const CContainer = ({ children, className }: CContinerProps) => {
  return (
    <div className={cn(`w-full h-full md:px-10 lg:px-15 xl:px-20`, className)}>
      {children}
    </div>
  );
};
