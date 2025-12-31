import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

type InputProps = React.ComponentProps<typeof Input>;

type CInputProps = InputProps & {
  type: string;
  placeholder?: string;
  id?: string;
  label?: string;
};

export const CInput = ({
  //   children,
  className,
  type = "text",
  placeholder = "Text",
  id = "text",
  label,
  ...props
}: CInputProps) => {
  return (
    <div className="flex flex-col">
      {type != "checkbox" ? (
        <>
          {label && (
            <label className="mb-0.5" htmlFor={id}>
              {label}
            </label>
          )}
          <Input
            className={cn(
              "w-full h-14 rounded-[10px] border border-black hover:shadow-primary-600 focus-visible:ring-[.3px] focus-visible:ring-primary-600 focus-visible:border-black",
              className
            )}
            id={id}
            type={type}
            placeholder={placeholder}
            {...props}
          />
        </>
      ) : (
        <div className="flex gap-4 items-middle">
          <Checkbox className={cn("w-4 h-4 hover:cursor-pointer", className)} />
          {label && (
            <label className="text-sm md:text-[1rem] mb-0.5" htmlFor={id}>
              {label}
            </label>
          )}
        </div>
      )}
    </div>
  );
};
