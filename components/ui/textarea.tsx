"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps): React.JSX.Element {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-sm border border-border bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-fg-muted focus:border-primary focus:ring-0",
        className,
      )}
      {...props}
    />
  );
}
