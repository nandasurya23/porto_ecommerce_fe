"use client";

import type * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useOrderDetailQuery } from "@/features/orders/queries";
import { useUpdateOrderStatusMutation } from "@/features/orders/mutations";
import { OrderTimeline } from "@/features/orders/components/OrderTimeline";
import { toast } from "sonner";

const schema = z.object({
  status: z.enum(["PENDING_PAYMENT", "PAID", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

type FormValues = z.infer<typeof schema>;

export default function AdminOrderDetailPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const query = useOrderDetailQuery(params.id);
  const mutation = useUpdateOrderStatusMutation();
  const order = query.data;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: order ? { status: order.status } : undefined,
  });

  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.isError) {
    return <ErrorState message="Gagal memuat order detail." onRetry={() => void query.refetch()} />;
  }

  if (!order) {
    return <EmptyState title="Order not found" description="Cannot manage a missing order." />;
  }

  return (
    <div className="page-shell">
      <Card>
        <CardContent className="space-y-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
              <p className="text-sm text-fg-muted">{formatDateTime(order.createdAt)}</p>
            </div>
          <OrderStatusBadge status={order.status} />
          </div>
          <OrderTimeline status={order.status} />
          <p className="text-sm text-fg-muted">User ID: {order.userId ?? "-"}</p>
          <p className="text-sm text-fg-muted">Address ID: {order.addressId ?? "-"}</p>
          <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Items</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-fg-muted">{item.variantName}</p>
                </div>
                <p>Qty {item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-border p-3 text-sm">
            <p className="font-medium">Shipment</p>
            <p className="text-fg-muted">Tracking number: {order.trackingNumber ?? "-"}</p>
            <p className="text-fg-muted">Shipping cost: {formatCurrency(order.shippingAmount)}</p>
          </div>
        </CardContent>
      </Card>

      <form
        className="section-surface p-4 sm:p-5"
        onSubmit={form.handleSubmit((values) =>
          mutation.mutate(
            { orderId: order.id, status: values.status },
            {
              onSuccess: () => {
                toast.success("Order status updated.");
                router.refresh();
              },
              onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Gagal update order status.");
              },
            },
          ),
        )}
      >
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <Select {...form.register("status")}>
              <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
              <option value="PAID">PAID</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="PACKED">PACKED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </Select>
          </div>
          <Button type="submit">Save status</Button>
        </div>
      </form>
    </div>
  );
}
