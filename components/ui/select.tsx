"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps): React.JSX.Element {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-sm border border-border bg-white px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-0",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
