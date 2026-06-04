import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { ApiMeta } from "@/types/api";
import type { Order, OrderItem } from "@/types/order";
import type { BackendOrderDetail, BackendOrderItem, BackendOrderListItem, BackendShipment } from "@/types/backend";
import { fetchProductBySlug } from "@/services/product.service";

type OrderListResult = {
  items: Order[];
  meta?: ApiMeta;
};

function mapOrderStatus(status: BackendOrderListItem["order_status"]): Order["status"] {
  return status;
}

function mapPaymentStatus(status: BackendOrderListItem["payment_status"]): Order["paymentStatus"] {
  return status;
}

async function mapOrderItem(item: BackendOrderItem): Promise<OrderItem> {
  let image = "";

  if (item.product_slug_snapshot) {
    const product = await fetchProductBySlug(item.product_slug_snapshot);
    image = product?.images[0] ?? "";
  }

  return {
    id: item.id,
    productName: item.product_name_snapshot,
    variantName: [item.color_snapshot, item.size_snapshot].filter(Boolean).join(" / "),
    quantity: item.quantity,
    price: item.price_snapshot,
    image,
  };
}

async function mapOrder(item: BackendOrderListItem | BackendOrderDetail, shipment?: BackendShipment | null): Promise<Order> {
  const detail = item as BackendOrderDetail;
  const createdAt = item.created_at;
  const items = "items" in detail ? await Promise.all(detail.items.map(mapOrderItem)) : [];

  return {
    id: item.id,
    userId: item.user_id,
    orderNumber: item.order_number,
    status: mapOrderStatus(item.order_status),
    paymentStatus: mapPaymentStatus(item.payment_status),
    subtotal: item.subtotal,
    shippingAmount: item.shipping_cost,
    discountAmount: item.discount_amount,
    totalAmount: item.total_amount,
    addressId: "address_id" in item ? item.address_id ?? null : null,
    trackingNumber: shipment?.tracking_number ?? undefined,
    paymentCode: undefined,
    items,
    createdAt,
    updatedAt: item.updated_at,
  };
}

export async function fetchOrders(): Promise<OrderListResult> {
  const response = await apiFetch<BackendOrderListItem[]>(`${endpoints.orders}?page=1&limit=100`, {
    method: "GET",
  });
  return {
    items: await Promise.all(response.data.map((item) => mapOrder(item))),
    meta: response.meta,
  };
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  try {
    const response = await apiFetch<BackendOrderDetail>(`${endpoints.orders}/${orderId}`, {
      method: "GET",
    });
    let shipment: BackendShipment | null = null;
    try {
      const shipmentResponse = await apiFetch<BackendShipment>(`${endpoints.orders}/${orderId}/shipment`, {
        method: "GET",
      });
      shipment = shipmentResponse.data;
    } catch {
      shipment = null;
    }
    return mapOrder(response.data, shipment);
  } catch {
    return null;
  }
}

export function createOrderRequest(payload: { addressId: string; paymentMethod: string }) {
  return apiFetch<{
    order_id: string;
    order_number: string;
    subtotal: number;
    shipping_cost: number;
    total_amount: number;
    payment_code: string;
    payment_status: string;
    order_status: string;
  }>(endpoints.orders, {
    method: "POST",
    body: JSON.stringify({
      address_id: payload.addressId,
      payment_method: payload.paymentMethod,
    }),
  });
}

export function updateOrderStatusRequest(orderId: string, status: Order["status"]) {
  return apiFetch<Record<string, never>>(`${endpoints.adminOrders}/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
