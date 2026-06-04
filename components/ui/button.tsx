"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-white hover:bg-slate-800",
        secondary: "border-border bg-white text-fg hover:bg-muted",
        ghost: "border-transparent bg-transparent hover:bg-muted",
        danger: "border-danger bg-danger text-white hover:opacity-95",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps): React.JSX.Element {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
