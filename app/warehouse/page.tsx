"use client";

import type * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { formatCurrency } from "@/lib/format";
import { useOrdersQuery } from "@/features/orders/queries";

export default function WarehouseDashboardPage(): React.JSX.Element {
  const query = useOrdersQuery();
  const orders = query.data ?? [];
  const ready = orders.filter((order) => order.paymentStatus === "PAID" && order.status !== "DELIVERED" && order.status !== "CANCELLED");

  return (
    <div className="page-shell">
      <section className="hero-panel grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="page-eyebrow">Warehouse dashboard</p>
          <h1 className="page-title">Fulfillment task board</h1>
          <p className="page-description">Focus on paid orders, packing, shipment status, and tracking readiness.</p>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-white/80 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">Task queue</p>
            <p className="mt-1 text-sm text-fg-muted">Move current orders through the warehouse flow faster.</p>
          </div>
          <Link href="/warehouse/orders">
            <Button className="w-full">View orders</Button>
          </Link>
        </div>
      </section>
      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat ringkasan warehouse." onRetry={() => void query.refetch()} /> : null}
      <div className="kpi-grid">
        <Metric title="Paid ready orders" value={String(ready.length)} />
        <Metric title="Packed or shipped" value={String(orders.filter((order) => order.status === "PACKED" || order.status === "SHIPPED").length)} />
        <Metric title="Revenue in queue" value={formatCurrency(ready.reduce((sum, item) => sum + item.totalAmount, 0))} />
      </div>
      <Card>
        <CardContent className="space-y-3 py-6">
          <h2 className="text-lg font-semibold">Ready for processing</h2>
          {ready.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-fg-muted">{order.userId ?? "-"}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }): React.JSX.Element {
  return (
    <Card className="bg-white/85 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <CardContent className="space-y-1 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted">{title}</p>
        <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}
