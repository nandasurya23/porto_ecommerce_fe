"use client";

import { Badge } from "@/components/ui/badge";
import { getOrderStatusTone, getShipmentStatusTone, getStockTone } from "@/lib/status";
import type { OrderStatus } from "@/types/order";
import type { Shipment } from "@/types/shipment";

export function OrderStatusBadge({ status }: { status: OrderStatus }): React.JSX.Element {
  return <Badge tone={getOrderStatusTone(status)}>{status.replaceAll("_", " ")}</Badge>;
}

export function ShipmentStatusBadge({ status }: { status: Shipment["status"] }): React.JSX.Element {
  return <Badge tone={getShipmentStatusTone(status)}>{status.replaceAll("_", " ")}</Badge>;
}

export function StockBadge({ stock }: { stock: number }): React.JSX.Element {
  const tone = getStockTone(stock);
  const label = stock === 0 ? "OUT OF STOCK" : stock <= 5 ? "LOW STOCK" : "AVAILABLE";
  return <Badge tone={tone}>{label}</Badge>;
}
