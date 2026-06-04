export const appName = "Footwear Commerce";

export const roles = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  WAREHOUSE: "WAREHOUSE",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export const orderStatuses = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export const shipmentStatuses = [
  "WAITING_FOR_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export const stockStates = ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK"] as const;
