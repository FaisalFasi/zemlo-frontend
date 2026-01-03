import React from "react";

type CContinerProps = {
  children: React.ReactNode;
};

export const CContainer = ({ children }: CContinerProps) => {
  return (
    <div className="w-full h-full min-h-[calc(100dvh-120px)] md:px-10 lg:px-15 xl:px-20">
      {children}
    </div>
  );
};
