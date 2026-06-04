export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItem = {
  id: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  userId?: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  status: OrderStatus;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";
  subtotal: number;
  shippingAmount: number;
  discountAmount?: number;
  totalAmount: number;
  addressId?: string | null;
  address?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  paymentCode?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};
