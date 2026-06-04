"use client";

import type * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { OrderStatusBadge, ShipmentStatusBadge } from "@/components/ui/status-badge";
import { useOrderDetailQuery } from "@/features/orders/queries";
import { useUpdateShipmentMutation } from "@/features/shipments/mutations";
import { useShipmentQuery } from "@/features/shipments/queries";
import { toast } from "sonner";

const shipmentSchema = z.object({
  courier: z.string().min(1),
  trackingNumber: z.string().min(3),
  status: z.enum(["WAITING_FOR_PICKUP", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED_DELIVERY"]),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export default function WarehouseOrderDetailPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const query = useOrderDetailQuery(params.id);
  const shipmentQuery = useShipmentQuery(params.id);
  const updateShipment = useUpdateShipmentMutation();
  const order = query.data;
  const shipment = shipmentQuery.data;
  const canCreateShipment = order?.paymentStatus === "PAID" && (order.status === "PROCESSING" || order.status === "PACKED");
  const shipmentDefaults = shipment
    ? {
        courier: shipment.courier,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
      }
    : {
        courier: "JNE Regular",
        trackingNumber: "",
        status: "WAITING_FOR_PICKUP" as const,
      };
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    values: shipmentDefaults,
  });

  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.isError) {
    return <ErrorState message="Gagal memuat order detail." onRetry={() => void query.refetch()} />;
  }

  if (shipmentQuery.isError) {
    return <ErrorState message="Gagal memuat shipment detail." onRetry={() => void shipmentQuery.refetch()} />;
  }

  if (!order) {
    return <EmptyState title="Order not found" description="Cannot process a missing order." />;
  }

  return (
    <div className="page-shell">
      <Card>
        <CardContent className="space-y-3 py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
              <p className="text-sm text-fg-muted">{order.userId ?? "Unknown user"}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-2">
            {shipment ? <ShipmentStatusBadge status={shipment.status} /> : <ShipmentStatusBadge status="WAITING_FOR_PICKUP" />}
            <span className="text-sm text-fg-muted">Current shipment status</span>
          </div>
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
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="section-surface space-y-4 p-4 sm:p-5"
          onSubmit={form.handleSubmit((values) => {
            if (!shipment && !canCreateShipment) {
              toast.error("Shipment belum bisa dibuat. Pastikan order sudah PAID dan status order sudah PROCESSING atau PACKED.");
              return;
            }

            updateShipment.mutate(
              {
                orderId: order.id,
                shipmentId: shipment?.id,
                courier: values.courier,
                trackingNumber: values.trackingNumber,
                status: shipment ? values.status : "WAITING_FOR_PICKUP",
              },
              {
                onSuccess: () => {
                  toast.success(shipment ? "Shipment updated." : "Shipment created.");
                  router.refresh();
                },
                onError: (error) => {
                  toast.error(error instanceof Error ? error.message : "Gagal update shipment.");
                },
              },
            );
          })}
        >
          <h2 className="text-lg font-semibold tracking-tight">Shipment details</h2>
          <Field label="Courier" error={form.formState.errors.courier?.message}><Input {...form.register("courier")} /></Field>
          <Field label="Tracking number" error={form.formState.errors.trackingNumber?.message}><Input {...form.register("trackingNumber")} /></Field>
          <Field label="Status" error={form.formState.errors.status?.message}>
            <Select {...form.register("status")} disabled={!shipment}>
              <option value="WAITING_FOR_PICKUP">WAITING_FOR_PICKUP</option>
              <option value="PICKED_UP">PICKED_UP</option>
              <option value="IN_TRANSIT">IN_TRANSIT</option>
              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="FAILED_DELIVERY">FAILED_DELIVERY</option>
            </Select>
          </Field>
          <Button type="submit" disabled={!shipment && !canCreateShipment}>
            {shipment ? "Save shipment" : "Create shipment"}
          </Button>
          {!shipment ? (
            <p className="text-xs text-fg-muted">
              Shipment bisa dibuat setelah order `PAID` dan status order sudah `PROCESSING` atau `PACKED`.
            </p>
          ) : null}
        </form>

        <Card>
          <CardContent className="space-y-4 py-6">
            <h2 className="text-lg font-semibold">Warehouse action</h2>
            <p className="text-sm text-fg-muted">
              Warehouse can create or update shipment only. Order status changes are managed by admin.
            </p>
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-fg-muted">
              <p>Current order status: {order.status}</p>
              <p>Payment status: {order.paymentStatus}</p>
              <p>Shipment status: {shipment?.status ?? "WAITING_FOR_PICKUP"}</p>
            </div>
            <div className="space-y-1 text-sm text-fg-muted">
              <p>Tracking number: {shipment?.trackingNumber ?? "-"}</p>
              <p>Shipment service: {shipment?.serviceName ?? "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
