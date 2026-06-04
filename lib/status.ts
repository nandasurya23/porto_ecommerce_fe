import type { OrderStatus } from "@/types/order";
import type { Shipment } from "@/types/shipment";
import type { BadgeTone } from "@/components/ui/badge";

export function getOrderStatusTone(status: OrderStatus): BadgeTone {
  switch (status) {
    case "PENDING_PAYMENT":
      return "warning";
    case "PAID":
    case "PROCESSING":
    case "PACKED":
      return "accent";
    case "SHIPPED":
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
}

export function getShipmentStatusTone(status: Shipment["status"]): BadgeTone {
  switch (status) {
    case "WAITING_FOR_PICKUP":
      return "warning";
    case "PICKED_UP":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return "info";
    case "DELIVERED":
      return "success";
    default:
      return "default";
  }
}

export function getStockTone(stock: number): BadgeTone {
  if (stock === 0) return "danger";
  if (stock <= 5) return "warning";
  return "success";
}
