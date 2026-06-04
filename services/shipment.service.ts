import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import { fetchOrders } from "@/services/order.service";
import type { Shipment } from "@/types/shipment";
import type { BackendShipment } from "@/types/backend";

function mapShipment(item: BackendShipment, orderId: string): Shipment {
  return {
    id: item.id,
    orderId,
    courier: item.courier,
    serviceName: item.service_name ?? undefined,
    trackingNumber: item.tracking_number ?? "",
    status: item.status,
    createdAt: item.created_at,
    shippedAt: item.shipped_at ?? null,
    deliveredAt: item.delivered_at ?? null,
  };
}

export async function fetchShipments(): Promise<Shipment[]> {
  const orders = await fetchOrders();
  const settled = await Promise.all(
    orders.items.map(async (order) => {
      try {
        const response = await apiFetch<BackendShipment>(`${endpoints.orders}/${order.id}/shipment`, {
          method: "GET",
        });
        return mapShipment(response.data, order.id);
      } catch {
        return null;
      }
    }),
  );

  return settled.filter((item): item is Shipment => item !== null);
}

export async function fetchShipmentByOrderId(orderId: string): Promise<Shipment | null> {
  try {
    const response = await apiFetch<BackendShipment>(`${endpoints.orders}/${orderId}/shipment`, {
      method: "GET",
    });
    return mapShipment(response.data, orderId);
  } catch {
    return null;
  }
}

export function createShipmentRequest(
  orderId: string,
  payload: {
    courier: string;
    serviceName?: string;
    trackingNumber?: string;
  },
) {
  return apiFetch<{ id: string }>(`${endpoints.adminOrders}/${orderId}/shipment`, {
    method: "POST",
    body: JSON.stringify({
      courier: payload.courier,
      service_name: payload.serviceName ?? "",
      tracking_number: payload.trackingNumber ?? "",
    }),
  });
}

export function updateShipmentStatusRequest(
  shipmentId: string,
  payload: {
    status: Shipment["status"];
    trackingNumber?: string;
  },
) {
  return apiFetch<Record<string, unknown>>(`${endpoints.adminShipments}/${shipmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status: payload.status,
      tracking_number: payload.trackingNumber ?? "",
    }),
  });
}
