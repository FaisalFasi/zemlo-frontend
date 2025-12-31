import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type ButtonProps = React.ComponentProps<typeof ShadcnButton>;

type CButtonProps = ButtonProps & {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hoverAffect?: boolean;
};

export const CButton = ({
  className,
  children,
  isLoading,
  loadingText = "Loading ...!",
  leftIcon,
  rightIcon,
  hoverAffect = true,
  ...props
}: CButtonProps) => {
  return (
    <ShadcnButton
      className={cn(
        `w-full max-w-111.25 h-14 transition-all duration-200 hover:cursor-pointer ${
          hoverAffect && " hover:bg-[#2e2b2b] focus:bg-[#3e3e3e]"
        } `,
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
        <div className="flex gap-2 justify-center items-center">
          {leftIcon && <span>{leftIcon}</span>}
          <>{children}</>
          {rightIcon && <span>{rightIcon}</span>}
        </div>
      )}
    </ShadcnButton>
  );
};
