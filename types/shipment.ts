export type Shipment = {
  id: string;
  orderId: string;
  courier: string;
  serviceName?: string;
  trackingNumber: string;
  status:
    | "WAITING_FOR_PICKUP"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "FAILED_DELIVERY";
  createdAt: string;
  shippedAt?: string | null;
  deliveredAt?: string | null;
};
