"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchShipmentByOrderId, fetchShipments } from "@/services/shipment.service";

export function useShipmentsQuery() {
  return useQuery({
    queryKey: ["shipments"],
    queryFn: async () => fetchShipments(),
  });
}

export function useShipmentQuery(orderId: string) {
  return useQuery({
    queryKey: ["shipments", orderId],
    queryFn: async () => fetchShipmentByOrderId(orderId),
    enabled: Boolean(orderId),
  });
}
