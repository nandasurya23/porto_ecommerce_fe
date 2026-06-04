"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

export function Table({ className, ...props }: TableProps): React.JSX.Element {
  return <table className={cn("w-full border-collapse text-sm", className)} {...props} />;
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return (
    <thead
      className={cn("border-b border-border bg-muted/70 text-left text-[11px] uppercase tracking-[0.12em] text-fg-muted", className)}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function Tr({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>): React.JSX.Element {
  return <tr className={cn("hover:bg-muted/50", className)} {...props} />;
}

export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return <th className={cn("px-4 py-3 font-semibold", className)} {...props} />;
}

export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return <td className={cn("px-4 py-3 align-top", className)} {...props} />;
}
