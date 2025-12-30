import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LeafIcon, Loader2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React from "react";

type ButtonProps = React.ComponentProps<typeof ShadcnButton>;

type CButtonProps = ButtonProps & {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const CButton = ({
  className,
  children,
  isLoading,
  loadingText = "Loading ...!",
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: CButtonProps) => {
  return (
    <ShadcnButton
      className={cn(
        "w-full transition-all duration-200 hover:cursor-pointer hover:bg-[#2e2b2b] focus:bg-[#3e3e3e]",
        className
      )}
      variant={"default"}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <div className="flex gap-4">
          {leftIcon && <span>{leftIcon}</span>}
          <>{children}</>
          {rightIcon && <span>{rightIcon}</span>}
        </div>
      )}
    </ShadcnButton>
  );
};
