"use client";

import type * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useOrdersQuery } from "@/features/orders/queries";
import { useProductsQuery } from "@/features/products/queries";
import { formatCurrency } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function ReportsPage(): React.JSX.Element {
  const ordersQuery = useOrdersQuery();
  const productsQuery = useProductsQuery();
  const orders = ordersQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const chartData = [
    { label: "Orders", value: orders.length },
    { label: "Products", value: products.length },
    { label: "Revenue", value: orders.reduce((sum, item) => sum + item.totalAmount, 0) / 100000 },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Reports</p>
          <h1 className="page-title">Sales overview</h1>
          <p className="page-description">Lightweight KPI summary and a compact chart for a quick operational scan.</p>
        </div>
      </div>
      <div className="kpi-grid md:grid-cols-3 xl:grid-cols-3">
        <Metric title="Revenue" value={formatCurrency(orders.reduce((sum, item) => sum + item.totalAmount, 0))} />
        <Metric title="Orders" value={String(orders.length)} />
        <Metric title="Published products" value={String(products.filter((item) => item.status === "PUBLISHED").length)} />
      </div>
      <Card>
        <CardContent className="h-80 p-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#111827" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }): React.JSX.Element {
  return (
    <Card>
      <CardContent className="space-y-1 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
