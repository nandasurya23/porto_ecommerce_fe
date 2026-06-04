"use client";

import type * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }): React.JSX.Element {
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  const colors = [...new Set(product.variants.map((variant) => variant.color))];
  const sizes = [...new Set(product.variants.map((variant) => variant.size))];
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden rounded-none border-border-muted bg-white transition-colors duration-200 hover:border-border-strong">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              unoptimized
              className="object-cover mix-blend-multiply transition duration-500 group-hover:scale-105"
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.16em] text-fg-muted">
              No image
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge tone={totalStock <= 5 ? "warning" : "default"} className="rounded-sm border border-border-muted bg-white text-slate-950">
              {totalStock === 0 ? "Out of stock" : totalStock <= 5 ? "Low stock" : "New"}
            </Badge>
          </div>
          <div className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100">
            <WishlistButton product={product} className="backdrop-blur-sm" />
          </div>
          {totalStock === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/30">
              <span className="border border-border-muted bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Out of stock
              </span>
            </div>
          ) : null}
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`truncate text-[1.05rem] font-semibold tracking-tight ${totalStock === 0 ? "text-slate-500" : "text-slate-950"}`}>
                {product.name}
              </h3>
              <p className="text-[15px] text-slate-600">{product.category}</p>
            </div>
            <p className={`shrink-0 text-[1.05rem] font-semibold tracking-tight ${totalStock === 0 ? "text-slate-500" : "text-slate-950"}`}>
              {formatCurrency(product.basePrice)}
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
              <span className="rounded-sm border border-border-muted bg-white px-2 py-1">{colors.length} colors</span>
              <span className="rounded-sm border border-border-muted bg-white px-2 py-1">{sizes.length} sizes</span>
              <StockBadge stock={totalStock} />
            </div>
            <div className="flex items-center gap-2 text-[15px] text-slate-600">
              <span
                className={`inline-block h-3 w-3 rounded-full ${
                  totalStock === 0 ? "bg-red-500" : totalStock <= 5 ? "bg-amber-600" : "bg-emerald-600"
                }`}
              />
              <span>{totalStock === 0 ? "Out of Stock (0)" : totalStock <= 5 ? `Low Stock (${totalStock})` : `In Stock (${totalStock})`}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
