"use client";

import type * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }): React.JSX.Element {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950",
        className,
      )}
    />
  );
}

export function Skeleton({ className }: { className?: string }): React.JSX.Element {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-none bg-slate-200", className)} />;
}

export function LoadingState({ label = "Memuat data..." }: { label?: string }): React.JSX.Element {
  return (
    <Card className="border-border-muted bg-white">
      <CardContent className="flex items-center gap-4 py-8 text-sm text-fg-muted">
        <LoadingSpinner className="shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-sm font-medium text-fg">{label}</p>
          <div className="grid gap-2">
            <Skeleton className="h-2.5 w-full max-w-[16rem]" />
            <Skeleton className="h-2.5 w-5/6 max-w-[13rem]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingGridSkeleton({
  items = 4,
  columnsClassName = "sm:grid-cols-2 xl:grid-cols-4",
}: {
  items?: number;
  columnsClassName?: string;
}): React.JSX.Element {
  return (
    <div className={`grid gap-4 ${columnsClassName}`}>
      {Array.from({ length: items }).map((_, index) => (
        <LoadingCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function LoadingCardSkeleton(): React.JSX.Element {
  return (
    <Card className="overflow-hidden border-border-muted bg-white">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <CardContent className="space-y-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingHeroSkeleton(): React.JSX.Element {
  return (
    <Card className="overflow-hidden border-border-muted bg-white">
      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <div className="space-y-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-full max-w-[18rem]" />
          <Skeleton className="h-10 w-5/6" />
          <Skeleton className="h-20 w-full" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-12 w-full sm:w-36" />
            <Skeleton className="h-12 w-full sm:w-36" />
          </div>
        </div>
        <div className="grid gap-4">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function LoadingProductDetailSkeleton(): React.JSX.Element {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
        </div>
      </div>
      <div className="space-y-6 lg:col-span-5">
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-10 w-1/3" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
        <Skeleton className="h-14 w-full" />
        <div className="grid gap-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
