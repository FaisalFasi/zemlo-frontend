import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type ButtonProps = React.ComponentProps<typeof ShadcnButton>;

type CButtonProps = ButtonProps & {
  type?: string;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hoverAffect?: boolean;
  btnSmall?: boolean;
};

export const CButton = ({
  type = "button",
  className,
  children,
  isLoading,
  loadingText = "Loading ...!",
  leftIcon,
  rightIcon,
  hoverAffect = false,
  btnSmall = false,
  ...props
}: CButtonProps) => {
  return (
    <ShadcnButton
      className={cn(
        `transition-all duration-200 hover:cursor-pointer ${
          hoverAffect && " hover:bg-[#2e2b2b] focus:bg-[#3e3e3e]"
        }   ${btnSmall ? "w-fit h-fit p-0" : "w-fit h-full max-w-111.25 "} `,
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
      ) : btnSmall ? (
        <>
          {children && (
            <span className="w-fit h-fit p-0 hover:bg-none hover:text-primary-300">
              {children}
            </span>
          )}
        </>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children && (
            <span className="w-full h-full flex items-center justify-center">
              {children}
            </span>
          )}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </ShadcnButton>
  );
};
