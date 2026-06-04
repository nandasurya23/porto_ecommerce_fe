"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useOrdersQuery } from "@/features/orders/queries";

export default function AdminOrdersPage(): React.JSX.Element {
  const query = useOrdersQuery();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const orders = useMemo(() => {
    return (query.data ?? []).filter((order) => {
      const matchesSearch = search
        ? `${order.orderNumber} ${order.userId ?? ""}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesStatus = status === "all" ? true : order.status === status;
      const matchesPayment = paymentStatus === "all" ? true : order.paymentStatus === paymentStatus;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [paymentStatus, query.data, search, status]);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Orders</p>
          <h1 className="page-title">Order management</h1>
          <p className="page-description">Manage lifecycle, payment state, and customer orders with quick filters.</p>
        </div>
      </div>
      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat order." onRetry={() => void query.refetch()} /> : null}
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Search order or customer" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
          <option value="PAID">PAID</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="PACKED">PACKED</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </Select>
        <Select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
          <option value="all">All payment states</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
          <option value="EXPIRED">EXPIRED</option>
          <option value="CANCELLED">CANCELLED</option>
        </Select>
      </div>
      {!query.isLoading && !query.isError && orders.length === 0 ? (
        <EmptyState title="No orders" description="Orders will appear here once customers checkout." />
      ) : null}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <Tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Total</Th>
                <Th>Payment</Th>
                <Th>Status</Th>
                <Th />
              </Tr>
            </THead>
            <TBody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-fg-muted">{formatDateTime(order.createdAt)}</p>
                    </div>
                  </Td>
                  <Td>{order.userId ?? "-"}</Td>
                  <Td>{formatCurrency(order.totalAmount)}</Td>
                  <Td>{order.paymentStatus}</Td>
                  <Td>
                    <OrderStatusBadge status={order.status} />
                  </Td>
                  <Td>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="secondary" size="sm">
                        Detail
                      </Button>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
