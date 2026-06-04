import type { ApiMeta } from "@/types/api";

export type BackendCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BackendProductListItem = {
  id: string;
  category_id?: string | null;
  category_name?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  base_price: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  created_at: string;
  updated_at: string;
};

export type BackendProductImage = {
  id: string;
  image_url: string;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type BackendProductVariant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  weight_gram: number;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
};

export type BackendProductDetail = BackendProductListItem & {
  images: BackendProductImage[];
  variants: BackendProductVariant[];
};

export type BackendCartItem = {
  id: string;
  product_variant_id: string;
  product_slug: string;
  product_name: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  quantity: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
};

export type BackendCartResponse = {
  cart_id: string;
  items: BackendCartItem[];
};

export type BackendOrderListItem = {
  id: string;
  user_id: string;
  order_number: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  payment_status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";
  order_status: "PENDING_PAYMENT" | "PROCESSING" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  created_at: string;
  updated_at: string;
};

export type BackendOrderItem = {
  id: string;
  product_variant_id?: string | null;
  product_name_snapshot: string;
  product_slug_snapshot?: string | null;
  sku_snapshot: string;
  size_snapshot: string;
  color_snapshot: string;
  price_snapshot: number;
  quantity: number;
  subtotal: number;
  created_at: string;
};

export type BackendOrderDetail = BackendOrderListItem & {
  address_id?: string | null;
  items: BackendOrderItem[];
};

export type BackendPayment = {
  id: string;
  order_id: string;
  payment_code: string;
  method: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";
  paid_at?: string | null;
  expired_at?: string | null;
  created_at: string;
  updated_at: string;
  order_number?: string;
};

export type BackendShipment = {
  id: string;
  order_id?: string;
  courier: string;
  service_name?: string | null;
  tracking_number?: string | null;
  status: "WAITING_FOR_PICKUP" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED_DELIVERY";
  shipped_at?: string | null;
  delivered_at?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type BackendInventoryLog = {
  id: string;
  product_variant_id: string;
  sku: string;
  type: "RESTOCK" | "SALE" | "MANUAL_ADJUSTMENT" | "RETURN" | "CANCEL_CORRECTION";
  quantity: number;
  previous_stock: number;
  current_stock: number;
  note?: string | null;
  created_by?: string | null;
  created_at: string;
};

export type BackendAddress = {
  id: string;
  user_id: string;
  receiver_name: string;
  phone: string;
  province: string;
  city: string;
  district?: string | null;
  postal_code?: string | null;
  full_address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type BackendDashboardSummary = {
  total_revenue: number;
  total_orders: number;
  pending_payment_orders: number;
  processing_orders: number;
  delivered_orders: number;
  low_stock_variants: number;
};

export type BackendDashboardSalesPoint = {
  date: string;
  total_revenue: number;
};

export type BackendDashboardOrderStatusPoint = {
  order_status: string;
  total: number;
};

export type BackendDashboardLowStock = {
  id: string;
  product_name: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
};

export type ApiListResult<T> = {
  items: T[];
  meta?: ApiMeta;
};
