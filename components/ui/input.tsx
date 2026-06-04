"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps): React.JSX.Element {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-sm border border-border bg-white px-3 text-sm outline-none transition-colors placeholder:text-fg-muted focus:border-primary focus:ring-0",
        className,
      )}
      {...props}
    />
  );
}
