"use client";

import type * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  Package2,
  UserRound,
  ImageOff,
} from "lucide-react";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { useOrdersQuery, useOrderDetailQuery } from "@/features/orders/queries";
import type { Order, OrderItem } from "@/types/order";

type RangeFilter = "last-6-months" | "2024" | "2023" | "all";

const PAGE_SIZE = 3;

export default function OrdersPage(): React.JSX.Element {
  const router = useRouter();
  const query = useOrdersQuery();
  const [range, setRange] = useState<RangeFilter>("last-6-months");
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => filterOrders(query.data ?? [], range), [query.data, range]);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [range]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const visibleOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container-shell py-8">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <div className="space-y-6">
            <h2 className="text-[clamp(1.9rem,2.4vw,2.5rem)] font-black tracking-[-0.06em] text-slate-950">
              My Account
            </h2>
            <nav className="space-y-3">
              <AccountNavItem icon={<UserRound className="h-5 w-5" />}>
                Profile Details
              </AccountNavItem>
              <AccountNavLink href="/orders" active icon={<Package2 className="h-5 w-5" />}>
                Order History
              </AccountNavLink>
              <AccountNavItem icon={<MapPin className="h-5 w-5" />}>
                Saved Addresses
              </AccountNavItem>
              <AccountNavItem icon={<CreditCard className="h-5 w-5" />}>
                Payment Methods
              </AccountNavItem>
            </nav>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-border-muted pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="page-eyebrow">Orders</p>
              <h1 className="page-title">Order History</h1>
            </div>
            <div className="w-full sm:w-auto">
              <Select
                aria-label="Order range"
                value={range}
                onChange={(event) => setRange(event.target.value as RangeFilter)}
                className="h-12 rounded-lg border-border-muted bg-white px-4 text-sm text-slate-950 sm:min-w-[170px]"
              >
                <option value="last-6-months">Last 6 Months</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="all">All Orders</option>
              </Select>
            </div>
          </div>

          {query.isLoading ? <LoadingState label="Memuat order history..." /> : null}
          {query.isError ? <ErrorState message="Gagal memuat order." onRetry={() => void query.refetch()} /> : null}

          {!query.isLoading && filteredOrders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Your order history will appear here."
              actionLabel="Browse products"
              onAction={() => router.push("/products")}
            />
          ) : null}

          <div className="space-y-5">
            {visibleOrders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} />
            ))}
          </div>

          {filteredOrders.length > 0 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((current) => Math.max(1, current - 1))}
              onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
            />
          ) : null}
        </main>
      </div>
        </div>
      </div>
    );
}

function OrderHistoryCard({ order }: { order: Order }): React.JSX.Element {
  const detailQuery = useOrderDetailQuery(order.id);
  const items = detailQuery.data?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const previewItem = items[0];
  const previewSize = previewItem ? extractSize(previewItem) : "";
  const isCancelled = order.status === "CANCELLED";
  const isRefunded = order.paymentStatus === "CANCELLED" || order.paymentStatus === "FAILED";

  return (
    <article className={`rounded-lg border border-border-muted bg-white p-5 transition ${isCancelled ? "opacity-80" : ""}`}>
      <div className="flex flex-col gap-4 border-b border-surface-container-high pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.12em] text-text-muted">Order Number</p>
          <p className="text-[1.05rem] font-semibold tracking-tight text-slate-950">{order.orderNumber}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded border border-border-muted bg-surface-container">
            {detailQuery.isLoading ? (
              <span className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
            ) : previewItem?.image ? (
              <Image
                src={previewItem.image}
                alt={previewItem.productName}
                width={80}
                height={80}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageOff className="h-7 w-7 text-text-muted" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-slate-950">
              {previewItem?.productName ?? "Multiple Items"}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Placed on: {formatDate(order.createdAt)}
            </p>
            <p className="mt-2 text-sm text-text-muted">
              {detailQuery.isLoading
                ? "Loading item details..."
                : itemCount <= 1
                  ? `Items: ${itemCount || 1} • Size: ${previewSize || "-"}`
                  : `Items: ${itemCount} • View receipt for details`}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className={`text-[1.15rem] font-semibold tracking-tight text-slate-950 ${isCancelled ? "text-text-muted line-through" : ""}`}>
            {formatCurrency(order.totalAmount)}
          </p>
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex h-12 items-center justify-center rounded border border-border-muted bg-white px-5 text-[15px] font-semibold text-slate-950 transition hover:bg-slate-50"
          >
            View Detail
          </Link>
        </div>
      </div>

      {isRefunded ? (
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-text-muted">Refunded</p>
      ) : null}
    </article>
  );
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}): React.JSX.Element {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="inline-flex h-11 w-11 items-center justify-center rounded border border-border-muted text-text-muted transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-border-strong hover:text-slate-950"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="px-1 text-sm text-slate-950">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="inline-flex h-11 w-11 items-center justify-center rounded border border-border-muted text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-border-strong hover:bg-slate-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function AccountNavLink({
  href,
  icon,
  active = false,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] transition ${
        active ? "bg-surface-container text-slate-950" : "text-slate-700 hover:bg-surface-container-low hover:text-slate-950"
      }`}
    >
      <span className="text-slate-700">{icon}</span>
      <span className={active ? "font-semibold text-slate-950" : "font-medium"}>{children}</span>
    </Link>
  );
}

function AccountNavItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }): React.JSX.Element {
  return (
    <button
      type="button"
      className="flex w-full cursor-default items-center gap-3 rounded-lg px-4 py-3 text-[15px] text-slate-700 transition hover:bg-surface-container-low hover:text-slate-950"
    >
      <span className="text-slate-700">{icon}</span>
      <span className="font-medium">{children}</span>
    </button>
  );
}

function PaymentStatusBadge({ status }: { status: Order["paymentStatus"] }): React.JSX.Element {
  const tone =
    status === "PAID"
      ? "success"
      : status === "PENDING"
        ? "warning"
        : status === "FAILED"
          ? "danger"
          : status === "EXPIRED"
            ? "default"
            : "default";
  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}

function extractSize(item: OrderItem): string {
  const parts = item.variantName.split(" / ").map((part) => part.trim());
  return parts[parts.length - 1] ?? item.variantName;
}

function filterOrders(orders: Order[], range: RangeFilter): Order[] {
  const now = new Date();
  const visible = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    if (range === "all") return true;
    if (range === "2024") return createdAt.getFullYear() === 2024;
    if (range === "2023") return createdAt.getFullYear() === 2023;
    const months = (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth());
    return months <= 6;
  });

  return visible.length > 0 ? visible : orders;
}
