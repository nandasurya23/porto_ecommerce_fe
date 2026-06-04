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
import { formatCurrency } from "@/lib/format";
import { useOrdersQuery } from "@/features/orders/queries";

export default function WarehouseOrdersPage(): React.JSX.Element {
  const query = useOrdersQuery();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const orders = useMemo(() => {
    return (query.data ?? []).filter((order) => {
      const matchesSearch = search
        ? `${order.orderNumber} ${order.userId ?? ""}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesStatus = status === "all" ? true : order.status === status;
      const matchesPaid = order.paymentStatus === "PAID";
      return matchesSearch && matchesStatus && matchesPaid;
    });
  }, [query.data, search, status]);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Orders</p>
          <h1 className="page-title">Warehouse queue</h1>
          <p className="page-description">Process packed and shipped workflows for paid orders only.</p>
        </div>
      </div>
      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat order." onRetry={() => void query.refetch()} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Search order or customer" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="PACKED">PACKED</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
        </Select>
      </div>
      {!query.isLoading && !query.isError && orders.length === 0 ? (
        <EmptyState title="No orders" description="Orders ready to process will appear here." />
      ) : null}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <Tr>
                <Th>Order</Th>
                <Th>User</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th />
              </Tr>
            </THead>
            <TBody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.orderNumber}</Td>
                  <Td>{order.userId ?? "-"}</Td>
                  <Td>{formatCurrency(order.totalAmount)}</Td>
                  <Td>
                    <OrderStatusBadge status={order.status} />
                  </Td>
                  <Td>
                    <Link href={`/warehouse/orders/${order.id}`}>
                      <Button variant="secondary" size="sm">
                        Process
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
