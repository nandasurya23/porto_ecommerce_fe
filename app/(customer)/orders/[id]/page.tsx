"use client";

import type * as React from "react";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { addDays } from "date-fns";
import {
  ArrowLeft,
  Banknote,
  Clock3,
  CreditCard,
  Download,
  Home,
  ImageOff,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useAddressesQuery } from "@/features/addresses/queries";
import { useOrderDetailQuery } from "@/features/orders/queries";
import { usePaymentByOrderQuery } from "@/features/payments/queries";
import { useShipmentQuery } from "@/features/shipments/queries";
import type { Order, OrderItem } from "@/types/order";
import type { Shipment } from "@/types/shipment";

const TIMELINE_STEPS: Array<{
  key: string;
  label: string;
  icon: React.ReactNode;
}> = [
  { key: "PENDING_PAYMENT", label: "Pending", icon: <Clock3 className="h-5 w-5" /> },
  { key: "PAID", label: "Paid", icon: <Banknote className="h-5 w-5" /> },
  { key: "PROCESSING", label: "Processing", icon: <PackageCheck className="h-5 w-5" /> },
  { key: "SHIPPED", label: "Shipped", icon: <Truck className="h-5 w-5" /> },
  { key: "DELIVERED", label: "Delivered", icon: <Home className="h-5 w-5" /> },
];

export default function OrderDetailPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const query = useOrderDetailQuery(params.id);
  const addressesQuery = useAddressesQuery();
  const paymentQuery = usePaymentByOrderQuery(params.id);
  const shipmentQuery = useShipmentQuery(params.id);

  const order = query.data;
  const address = order?.addressId ? addressesQuery.data?.find((item) => item.id === order.addressId) : undefined;

  const timelineIndex = useMemo(() => getTimelineIndex(order?.status), [order?.status]);

  if (query.isLoading || addressesQuery.isLoading || paymentQuery.isLoading || shipmentQuery.isLoading) {
    return <LoadingState label="Memuat order detail..." />;
  }

  if (query.isError || addressesQuery.isError || paymentQuery.isError || shipmentQuery.isError) {
    return <ErrorState message="Gagal memuat order detail." onRetry={() => void query.refetch()} />;
  }

  if (!order) {
    return <EmptyState title="Order not found" description="The requested order no longer exists." />;
  }

  return (
    <div className="container-shell py-8">
      <div className="page-shell">
        <header className="space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
            <div className="space-y-2">
              <h1 className="text-[clamp(2.2rem,3.2vw,3.4rem)] font-black tracking-[-0.07em] text-slate-950">
                Order #{order.orderNumber}
              </h1>
              <p className="text-[15px] text-slate-600">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-none border border-border-strong bg-white px-5 text-[15px] font-semibold normal-case tracking-normal text-slate-950 transition hover:bg-slate-50"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Download Invoice
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-none border border-slate-950 bg-slate-950 px-5 text-[15px] font-semibold normal-case tracking-normal text-white transition hover:bg-slate-800"
              onClick={() => document.getElementById("summary-panel")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              Track Package
            </button>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-border-muted bg-white p-6 sm:p-8">
        <h2 className="mb-6 text-[1.1rem] font-semibold tracking-tight text-slate-950">Order Status</h2>
        <div className="relative">
          <div className="absolute left-0 top-6 hidden h-px w-full bg-slate-200 md:block" />
          <div
            className="absolute left-0 top-6 hidden h-px bg-slate-950 md:block"
            style={{ width: `${timelineProgressWidth(timelineIndex)}%` }}
          />
          <div className="grid gap-6 md:grid-cols-5 md:gap-0">
            {TIMELINE_STEPS.map((step, index) => {
              const state = getTimelineStepState(index, timelineIndex, order.status);
              return (
                <TimelineStep
                  key={step.key}
                  label={step.label}
                  icon={step.icon}
                  state={state}
                  detail={getTimelineStepDetail(step.key, order, paymentQuery.data, shipmentQuery.data, index, timelineIndex)}
                />
              );
            })}
          </div>
        </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <h2 className="text-[1.1rem] font-semibold tracking-tight text-slate-950">Items Ordered</h2>
              <div className="space-y-0">
                {order.items.map((item, index) => (
                  <OrderItemRow key={item.id} item={item} isLast={index === order.items.length - 1} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card id="summary-panel">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <InfoBlock
                icon={<MapPin className="h-5 w-5" />}
                title="Shipping Address"
                content={
                  <div className="space-y-1 text-[15px] leading-7 text-slate-600">
                    <p className="font-semibold text-slate-950">{address?.receiverName ?? "Customer"}</p>
                    <p>{address?.fullAddress ?? "Address not available"}</p>
                    <p>
                      {address ? `${address.city}, ${address.province}${address.postalCode ? ` ${address.postalCode}` : ""}` : "-"}
                    </p>
                    <p>Indonesia</p>
                    <p className="pt-2">{address?.phone ?? "-"}</p>
                  </div>
                }
              />

              <Divider />

              <InfoBlock
                icon={<CreditCard className="h-5 w-5" />}
                title="Payment Method"
                content={
                  <div className="flex items-center gap-3 text-[15px] text-slate-600">
                    <span className="inline-flex h-6 min-w-10 items-center justify-center rounded border border-border-muted bg-slate-100 px-2 text-[10px] font-bold text-slate-950">
                      {paymentQuery.data ? formatPaymentBadge(paymentQuery.data.method) : "PAY"}
                    </span>
                    <span>{paymentQuery.data ? formatPaymentMethod(paymentQuery.data.method) : order.paymentStatus}</span>
                  </div>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5 p-6 sm:p-8">
              <h3 className="text-[1.1rem] font-semibold tracking-tight text-slate-950">Order Summary</h3>
              <div className="space-y-3 text-[15px]">
                <SummaryRow label={`Subtotal (${order.items.reduce((sum, item) => sum + item.quantity, 0)} items)`} value={formatCurrency(order.subtotal)} />
                <SummaryRow label="Shipping" value={formatCurrency(order.shippingAmount)} />
                <SummaryRow label="Tax" value={formatCurrency(0)} />
                <SummaryRow label="Discount" value={formatCurrency(order.discountAmount ?? 0)} muted />
              </div>
              <Divider />
              <div className="flex items-end justify-between">
                <span className="text-[1.05rem] font-semibold tracking-tight text-slate-950">Total</span>
                <span className="text-[2rem] font-black tracking-[-0.06em] text-slate-950">{formatCurrency(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardContent className="space-y-3 p-6 sm:p-8">
            <h2 className="text-[1.1rem] font-semibold tracking-tight text-slate-950">Shipping & Payment Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoTile label="Tracking Number" value={shipmentQuery.data?.trackingNumber ?? order.trackingNumber ?? "-"} />
              <InfoTile label="Shipment Status" value={shipmentQuery.data?.status.replaceAll("_", " ") ?? "Waiting for pickup"} />
              <InfoTile label="Order Status" value={order.status.replaceAll("_", " ")} />
              <InfoTile label="Payment Status" value={order.paymentStatus} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-[1.1rem] font-semibold tracking-tight text-slate-950">Actions</h2>
            <div className="grid gap-3">
              <Link
                href={`/orders/${order.id}/payment`}
                className="inline-flex h-12 w-full items-center justify-start rounded-none border border-slate-950 bg-slate-950 px-4 text-[15px] font-semibold normal-case tracking-normal text-white transition hover:bg-slate-800"
              >
                Go to payment
              </Link>
              <Link
                href="/orders"
                className="inline-flex h-12 w-full items-center justify-start rounded-none border border-border-strong bg-white px-4 text-[15px] font-semibold normal-case tracking-normal text-slate-950 transition hover:bg-slate-50"
              >
                Back to orders
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
        </div>
      </div>
    );
}

function TimelineStep({
  label,
  icon,
  state,
  detail,
}: {
  label: string;
  icon: React.ReactNode;
  state: "done" | "active" | "pending";
  detail: string;
}): React.JSX.Element {
  const active = state === "active";
  const done = state === "done";

  return (
    <div className="flex items-start gap-4 md:flex-col md:items-start md:gap-3">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
          done
            ? "border-slate-950 bg-slate-950 text-white"
            : active
              ? "border-slate-950 bg-white text-slate-950"
              : "border-slate-300 bg-slate-50 text-slate-300"
        }`}
      >
        {done ? <span className="text-lg font-bold">✓</span> : icon}
      </div>
      <div className="pt-1 md:pt-0">
        <p className={`text-[15px] font-semibold ${active ? "text-slate-950" : done ? "text-slate-950" : "text-slate-600"}`}>
          {label}
        </p>
        <p className={`mt-1 text-xs ${active ? "text-slate-950" : "text-slate-500"}`}>{detail}</p>
      </div>
    </div>
  );
}

function OrderItemRow({ item, isLast }: { item: OrderItem; isLast: boolean }): React.JSX.Element {
  return (
    <div className={`flex gap-4 py-4 ${isLast ? "" : "border-b border-slate-200"}`}>
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border-muted bg-slate-100">
        {item.image ? (
          <Image src={item.image} alt={item.productName} width={96} height={96} unoptimized className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-7 w-7 text-slate-400" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[1.05rem] font-semibold tracking-tight text-slate-950">{item.productName}</h3>
          <p className="mt-1 text-sm text-slate-600">{item.variantName}</p>
          <div className="mt-3 inline-flex items-center rounded border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
            In Stock
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[1.05rem] font-semibold tracking-tight text-slate-950">{formatCurrency(item.price)}</p>
          <p className="mt-1 text-sm text-slate-600">Qty: {item.quantity}</p>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}): React.JSX.Element {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-slate-950">{icon}</span>
        <h3 className="text-[1.05rem] font-semibold tracking-tight text-slate-950">{title}</h3>
      </div>
      <div className="pl-8">{content}</div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-lg border border-border-muted bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-950">{value}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={muted ? "text-emerald-700" : "text-slate-600"}>{label}</span>
      <span className={muted ? "font-medium text-emerald-700" : "font-medium text-slate-950"}>{value}</span>
    </div>
  );
}

function Divider(): React.JSX.Element {
  return <div className="h-px w-full bg-slate-200" />;
}

function getTimelineIndex(status?: Order["status"]): number {
  if (!status) return 0;
  switch (status) {
    case "PENDING_PAYMENT":
      return 0;
    case "PAID":
      return 1;
    case "PROCESSING":
    case "PACKED":
      return 2;
    case "SHIPPED":
      return 3;
    case "DELIVERED":
      return 4;
    case "CANCELLED":
      return 0;
    default:
      return 0;
  }
}

function getTimelineStepState(index: number, activeIndex: number, status?: Order["status"]): "done" | "active" | "pending" {
  if (status === "CANCELLED" && index > 0) return "pending";
  if (index < activeIndex) return "done";
  if (index === activeIndex) return "active";
  return "pending";
}

function timelineProgressWidth(activeIndex: number): number {
  if (activeIndex <= 0) return 0;
  return Math.min(100, (activeIndex / (TIMELINE_STEPS.length - 1)) * 100);
}

function getTimelineStepDetail(
  key: string,
  order: Order,
  payment: { method: string } | null | undefined,
  shipment: Shipment | null | undefined,
  index: number,
  activeIndex: number,
): string {
  const createdAt = new Date(order.createdAt);
  if (index < activeIndex) {
    return formatDateTime(addDays(createdAt, index).toISOString());
  }
  if (index === activeIndex) {
    if (key === "PROCESSING") return "Currently active";
    return formatDateTime(order.updatedAt ?? order.createdAt);
  }
  if (key === "SHIPPED") {
    return shipment?.shippedAt ? formatDateTime(shipment.shippedAt) : `Estimated ${formatDate(addDays(createdAt, 2))}`;
  }
  if (key === "DELIVERED") {
    return shipment?.deliveredAt ? formatDateTime(shipment.deliveredAt) : `Estimated ${formatDate(addDays(createdAt, 4))}`;
  }
  if (key === "PAID") return payment ? formatDateTime(addDays(createdAt, 1)) : formatDateTime(order.updatedAt ?? order.createdAt);
  return formatDateTime(order.createdAt);
}

function formatPaymentMethod(method: string): string {
  const value = method.trim().toUpperCase();
  if (value === "BANK_TRANSFER" || value === "VIRTUAL_ACCOUNT") return "Bank Transfer";
  if (value === "QRIS_SIMULATION") return "QRIS";
  if (value === "COD") return "Cash on Delivery";
  return value.replaceAll("_", " ");
}

function formatPaymentBadge(method: string): string {
  const value = method.trim().toUpperCase();
  if (value === "BANK_TRANSFER" || value === "VIRTUAL_ACCOUNT") return "BANK";
  if (value === "QRIS_SIMULATION") return "QRIS";
  if (value === "COD") return "COD";
  return "PAY";
}
