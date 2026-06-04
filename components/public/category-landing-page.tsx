"use client";

import type * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/features/products/components/ProductCard";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";

type CategoryLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  accentClassName: string;
  stats: Array<{ label: string; value: string }>;
  products: Product[];
  sectionTitle: string;
  sectionSubtitle: string;
  heroCtaHref?: string;
  heroCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  tags?: string[];
  productLimit?: number;
};

export function CategoryLandingPage({
  eyebrow,
  title,
  description,
  heroImage,
  heroImageAlt,
  accentClassName,
  stats,
  products,
  sectionTitle,
  sectionSubtitle,
  heroCtaHref = "/products",
  heroCtaLabel = "Browse Products",
  secondaryCtaHref = "/wishlist",
  secondaryCtaLabel = "Open Wishlist",
  tags = [],
  productLimit = 4,
}: CategoryLandingPageProps): React.JSX.Element {
  const visibleProducts = products.slice(0, productLimit);

  return (
    <div className="page-shell">
      <section className={`hero-panel overflow-hidden ${accentClassName}`}>
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="page-eyebrow">{eyebrow}</p>
              <h1 className="max-w-[12ch] text-[clamp(2.2rem,9vw,4.5rem)] font-black tracking-[-0.08em] text-slate-950 sm:text-[clamp(2.5rem,4vw,4.5rem)]">
                {title}
              </h1>
              <p className="page-description max-w-[56ch]">{description}</p>
            </div>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} tone="default" className="rounded-none border-border-muted bg-white/80 text-slate-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={heroCtaHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-none bg-slate-950 px-6 text-[13px] font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 sm:text-[14px]"
              >
                {heroCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryCtaHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-none border border-border-strong bg-white px-6 text-[13px] font-bold uppercase tracking-wide text-slate-950 transition hover:bg-slate-50 sm:text-[14px]"
              >
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden rounded-none border-border-muted bg-white">
              <div className="relative aspect-[4/5] bg-slate-100 sm:aspect-[4/5]">
                <Image
                  src={heroImage}
                  alt={heroImageAlt}
                  fill
                  unoptimized
                  className="object-cover object-center mix-blend-multiply"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  priority
                />
              </div>
            </Card>
            <Card className="border-border-muted bg-white/90">
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <StatTile key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 border-b border-border-muted pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="page-eyebrow">Featured</p>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2rem]">{sectionTitle}</h2>
          </div>
          <p className="hidden max-w-[420px] text-sm text-slate-500 sm:block">{sectionSubtitle}</p>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="rounded-none border border-border-muted bg-white p-6 text-sm text-slate-500">
            No products available for this selection.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-none border border-border-muted bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function CountLabel({ label, value }: { label: string; value: number }): React.JSX.Element {
  return (
    <div className="rounded-none border border-border-muted bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function formatStatCurrency(value: number): string {
  return formatCurrency(value);
}
