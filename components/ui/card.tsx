"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps): React.JSX.Element {
  return <div className={cn("section-surface overflow-hidden", className)} {...props} />;
}

export function CardHeader({ className, ...props }: CardProps): React.JSX.Element {
  return <div className={cn("border-b border-border bg-white px-4 py-4 sm:px-5", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps): React.JSX.Element {
  return <div className={cn("px-4 py-4 sm:px-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  return <h3 className={cn("text-sm font-semibold tracking-tight text-slate-950 sm:text-base", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>): React.JSX.Element {
  return <p className={cn("text-sm text-fg-muted", className)} {...props} />;
}
