"use client";

import type * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LoadingGridSkeleton,
  LoadingHeroSkeleton,
  Skeleton,
} from "@/components/ui/loading-state";

export function LoadingCategoryPageSkeleton(): React.JSX.Element {
  return (
    <div className="page-shell">
      <LoadingHeroSkeleton />
      <section className="space-y-4">
        <div className="flex flex-col gap-2 border-b border-border-muted pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <LoadingGridSkeleton items={4} />
      </section>
    </div>
  );
}

export function LoadingCatalogSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-border-muted bg-white">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-border-muted pb-6 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full sm:w-64" />
          </div>
          <LoadingGridSkeleton items={8} />
        </div>
      </div>
    </div>
  );
}

export function LoadingPublicPageSkeleton(): React.JSX.Element {
  return (
    <div className="page-shell">
      <LoadingHeroSkeleton />
      <section className="space-y-4">
        <div className="flex flex-col gap-2 border-b border-border-muted pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-52" />
          </div>
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <LoadingGridSkeleton items={4} />
      </section>
    </div>
  );
}

export function LoadingWishlistSkeleton(): React.JSX.Element {
  return (
    <div className="page-shell">
      <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-16 w-full max-w-[38rem]" />
        </div>
        <Card className="bg-white/85">
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </section>
      <div className="flex items-center justify-between border-b border-border-muted pb-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-56" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <LoadingGridSkeleton items={4} columnsClassName="lg:grid-cols-2" />
    </div>
  );
}

export function LoadingAuthSkeleton(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-surface-container-lowest lg:flex">
      <div className="hidden lg:block lg:w-1/2">
        <Card className="h-full overflow-hidden rounded-none border-0">
          <div className="relative h-full min-h-screen">
            <Skeleton className="absolute inset-0 rounded-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-10">
              <div className="space-y-4 text-white">
                <Skeleton className="h-14 w-72 bg-white/30" />
                <Skeleton className="h-4 w-full max-w-md bg-white/25" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:w-1/2 lg:px-10 lg:py-12">
        <div className="w-full max-w-[560px] space-y-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Skeleton className="h-11 w-11 rounded-sm" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <Skeleton className="h-12 w-12 rounded-sm" />
              <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="mx-auto h-4 w-full max-w-xl lg:mx-0" />
            <Skeleton className="mx-auto h-4 w-5/6 max-w-lg lg:mx-0" />
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full rounded-sm" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-10 w-full rounded-sm" />
            </div>
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-12 w-full rounded-sm" />
            <div className="flex items-center gap-4 py-1">
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-px flex-1" />
            </div>
            <Skeleton className="h-12 w-full rounded-sm" />
            <Skeleton className="h-5 w-72" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingDashboardSkeleton(): React.JSX.Element {
  return (
    <div className="page-shell">
      <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-16 w-full max-w-[42rem]" />
        </div>
        <Card className="bg-white/80">
          <CardContent className="grid gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </section>
      <div className="kpi-grid">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LoadingWarehouseSkeleton(): React.JSX.Element {
  return (
    <div className="page-shell">
      <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-14 w-full max-w-[38rem]" />
        </div>
        <Card className="bg-white/80">
          <CardContent className="grid gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </section>
      <div className="kpi-grid">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Card>
        <CardContent className="space-y-3 p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function LoadingCustomerPageSkeleton(): React.JSX.Element {
  return (
    <div className="page-shell">
      <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-14 w-full max-w-[40rem]" />
        </div>
        <Card className="bg-white/80">
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LoadingFormPageSkeleton(): React.JSX.Element {
  return (
    <div className="page-shell">
      <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-14 w-full max-w-[42rem]" />
        </div>
        <Card className="bg-white/80">
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full md:col-span-2" />
            <Skeleton className="h-12 w-full md:col-span-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoadingOrderDetailSkeleton(): React.JSX.Element {
  return (
    <div className="page-shell">
      <section className="space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="space-y-4 p-6 sm:p-8">
            <Skeleton className="h-5 w-40" />
            <div className="grid gap-6 md:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-6 sm:p-8">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6 sm:p-8">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function LoadingTablePageSkeleton({ rows = 6 }: { rows?: number }): React.JSX.Element {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { LoadingGridSkeleton, LoadingHeroSkeleton, LoadingSpinner, Skeleton } from "@/components/ui/loading-state";
export { LoadingProductDetailSkeleton } from "@/components/ui/loading-state";
