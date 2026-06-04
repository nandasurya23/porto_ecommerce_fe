"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const toneStyles = {
  default: "bg-muted text-fg",
  accent: "bg-slate-950 text-white",
  info: "bg-blue-50 text-blue-800",
  success: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-red-50 text-red-800",
} as const;

export type BadgeTone = keyof typeof toneStyles;

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "default", ...props }: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-transparent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
