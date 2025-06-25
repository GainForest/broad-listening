import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  children,
  className,
  outerClassName,
  ...props
}: {
  children: React.ReactNode;
  outerClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex flex-col items-center", outerClassName)}>
      <div
        className={cn("w-full max-w-6xl px-2 md:px-4", className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
