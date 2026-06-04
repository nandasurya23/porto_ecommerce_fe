"use client";

import type * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatCurrency } from "@/lib/format";
import { useCartQuery } from "@/features/cart/queries";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/features/cart/mutations";
import { Minus, Plus, ArrowRight, Lock, Trash2 } from "lucide-react";

export default function CartPage(): React.JSX.Element {
  const query = useCartQuery();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();
  const items = query.data ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length ? 25000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="container-shell py-8">
      <div className="page-shell">
      <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="page-eyebrow">Shopping Cart</p>
          <h1 className="page-title uppercase">Shopping Cart</h1>
          <p className="page-description">Confirm sizes, colors, quantities, and totals before proceeding to checkout.</p>
        </div>
        <Card className="bg-white/85">
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <MiniStat label="Items" value={String(items.length)} />
            <MiniStat label="Subtotal" value={formatCurrency(subtotal)} />
            <MiniStat label="Shipping" value={formatCurrency(shipping)} />
          </CardContent>
        </Card>
      </section>

      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat cart." onRetry={() => void query.refetch()} /> : null}
      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Start exploring footwear products."
          actionLabel="Browse products"
          onAction={() => (window.location.href = "/products")}
        />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-0 lg:col-span-8">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 border-b border-border-muted py-6 sm:flex-row sm:items-center">
              <div className="h-28 w-28 flex-shrink-0 overflow-hidden border border-border-muted bg-slate-100">
                <Image
                  src={item.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23e5e7eb'/%3E%3C/svg%3E"}
                  alt={item.productName}
                  width={112}
                  height={112}
                  unoptimized
                  className="h-full w-full object-cover object-center mix-blend-multiply"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-[1rem] uppercase tracking-wide">{item.productName}</CardTitle>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-text-muted">
                      Color: {item.color} | Size: {item.size}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-slate-950">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <QuantityControl
                    value={item.quantity}
                    max={item.stock}
                    onDecrease={() =>
                      updateMutation.mutate({
                        itemId: item.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    onIncrease={() =>
                      updateMutation.mutate({
                        itemId: item.id,
                        quantity: Math.min(item.stock || 1, item.quantity + 1),
                      })
                    }
                  />
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted transition hover:text-error"
                    onClick={() => removeMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Card className="rounded-none border border-border-strong bg-white">
            <CardContent className="space-y-5 p-6">
              <div className="border-b border-border-muted pb-3">
                <p className="page-eyebrow">Order Summary</p>
                <h2 className="text-[1.15rem] font-semibold tracking-tight text-slate-950 uppercase">Total before checkout</h2>
              </div>
              <div className="space-y-3">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Shipping (Estimated)" value={formatCurrency(shipping)} />
              </div>
              <div className="flex items-center justify-between border-t border-slate-950 pt-4">
                <span className="text-sm font-bold uppercase tracking-wide text-slate-950">Total</span>
                <span className="text-[1.2rem] font-black tracking-tight text-slate-950">{formatCurrency(total)}</span>
              </div>
              <Link href="/checkout" className="block">
                <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-none uppercase tracking-[0.12em]" disabled={items.length === 0}>
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="flex items-center justify-center gap-2 text-center text-xs uppercase tracking-[0.16em] text-text-muted">
                <Lock className="h-3.5 w-3.5" />
                Secure encrypted transaction
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}

function QuantityControl({
  value,
  max,
  onDecrease,
  onIncrease,
}: {
  value: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
}): React.JSX.Element {
  return (
    <div className="flex h-10 w-32 items-center border border-slate-950 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        className="inline-flex h-full w-10 items-center justify-center text-slate-950 transition hover:bg-slate-50"
        disabled={value <= 1}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="flex-1 text-center text-sm font-medium text-slate-950">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrease}
        className="inline-flex h-full w-10 items-center justify-center text-slate-950 transition hover:bg-slate-50"
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between text-sm text-slate-600">
      <span>{label}</span>
      <span className="font-semibold text-slate-950">{value}</span>
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
