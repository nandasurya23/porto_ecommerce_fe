"use client";

import type * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/format";
import { useWishlistStore } from "@/stores/wishlist-store";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='400' viewBox='0 0 320 400'%3E%3Crect width='320' height='400' fill='%23e5e7eb'/%3E%3Cpath d='M72 250h176l24-48H96L72 250Z' fill='%23cbd5e1'/%3E%3C/svg%3E";

export default function WishlistPage(): React.JSX.Element {
  const items = useWishlistStore((state) => state.items);
  const remove = useWishlistStore((state) => state.remove);
  const clear = useWishlistStore((state) => state.clear);

  return (
    <div className="container-shell py-8">
      <div className="page-shell">
        <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <p className="page-eyebrow">Saved Items</p>
            <h1 className="page-title uppercase">Wishlist</h1>
            <p className="page-description">
              Save products for later, compare styles, and return to them anytime from this device.
            </p>
          </div>
          <Card className="bg-white/85">
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <MiniStat label="Saved" value={String(items.length)} />
              <MiniStat label="Ready now" value={String(items.filter((item) => item.stock > 0).length)} />
              <MiniStat label="Out of stock" value={String(items.filter((item) => item.stock === 0).length)} />
            </CardContent>
          </Card>
        </section>

        {items.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Save products you love so you can compare them later."
            actionLabel="Browse products"
            onAction={() => {
              window.location.href = "/products";
            }}
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border-muted pb-4">
              <div>
                <p className="page-eyebrow">Wishlist</p>
                <h2 className="text-[1.4rem] font-black tracking-[-0.06em] text-slate-950">Saved for later</h2>
              </div>
              <Button variant="secondary" size="sm" onClick={() => clear()}>
                Clear all
              </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden rounded-none border-border-muted bg-white">
                  <div className="grid gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 md:aspect-auto">
                      <Image
                        src={item.image || PLACEHOLDER_IMAGE}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover mix-blend-multiply"
                        sizes="(min-width: 768px) 180px, 100vw"
                      />
                    </div>

                    <CardContent className="space-y-4 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{item.category}</p>
                          <h3 className="mt-1 truncate text-[1.25rem] font-semibold tracking-tight text-slate-950">{item.name}</h3>
                          <p className="mt-2 text-sm text-slate-600">
                            {item.colorCount} colors · {item.sizeCount} sizes
                          </p>
                        </div>
                        <WishlistButton
                          product={{
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            category: item.category,
                            description: "",
                            basePrice: item.price,
                            status: "PUBLISHED",
                            images: item.image ? [item.image] : [],
                            variants: [],
                            createdAt: item.addedAt,
                          }}
                          compact
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Price</p>
                          <p className="text-[1.4rem] font-black tracking-[-0.05em] text-slate-950">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Availability</p>
                          <p className={`text-sm font-semibold ${item.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                            {item.stock > 0 ? `In Stock (${item.stock})` : "Out of Stock"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/products/${item.slug}`}
                          className="inline-flex h-9 items-center gap-2 border border-slate-950 bg-slate-950 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
                        >
                          View product
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center gap-2 border border-border-muted px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
                          onClick={() => remove(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-none border border-border bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
