"use client";

import type * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, StockBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useOrdersQuery } from "@/features/orders/queries";
import { useAdminProductsQuery } from "@/features/products/queries";
import { useInventoryQuery } from "@/features/inventory/queries";

export default function AdminDashboardPage(): React.JSX.Element {
  const ordersQuery = useOrdersQuery();
  const productsQuery = useAdminProductsQuery();
  const inventoryQuery = useInventoryQuery();
  const orders = ordersQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const inventory = inventoryQuery.data?.variants ?? [];
  const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingPayment = orders.filter((order) => order.paymentStatus === "PENDING").length;
  const processing = orders.filter((order) => order.status === "PROCESSING").length;
  const lowStock = inventory.filter((item) => item.stock <= 5).length;

  const isLoading = ordersQuery.isLoading || productsQuery.isLoading || inventoryQuery.isLoading;
  const hasError = ordersQuery.isError || productsQuery.isError || inventoryQuery.isError;

  return (
    <div className="page-shell">
      <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="page-eyebrow">Admin dashboard</p>
          <h1 className="page-title">Operational overview</h1>
          <p className="page-description">Monitor products, orders, inventory, and payment states in one place.</p>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-white/80 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">Quick action</p>
            <p className="mt-1 text-sm text-fg-muted">Create a product or jump into catalog operations.</p>
          </div>
          <Link href="/admin/products/create">
            <Button className="w-full">Create product</Button>
          </Link>
        </div>
      </section>

      {isLoading ? <LoadingState /> : null}
      {hasError ? <ErrorState message="Gagal memuat ringkasan admin." onRetry={() => void Promise.all([ordersQuery.refetch(), productsQuery.refetch(), inventoryQuery.refetch()])} /> : null}

      <div className="kpi-grid">
        <StatCard label="Total revenue" value={formatCurrency(revenue)} />
        <StatCard label="Total orders" value={String(orders.length)} />
        <StatCard label="Pending payment" value={String(pendingPayment)} />
        <StatCard label="Processing orders" value={String(processing)} />
        <StatCard label="Low stock variants" value={String(lowStock)} />
        <StatCard label="Published products" value={String(products.filter((item) => item.status === "PUBLISHED").length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-fg-muted">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <OrderStatusBadge status={order.status} />
                  <p className="mt-1 text-sm font-medium">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low stock variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventory.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-xs text-fg-muted">{item.sku}</p>
                </div>
                <StockBadge stock={item.stock} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <Card className="bg-white/85 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <CardContent className="space-y-2 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}
