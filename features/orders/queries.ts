"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOrderById, fetchOrders } from "@/services/order.service";

export function useOrdersQuery() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetchOrders();
      return response.items;
    },
    staleTime: 30_000,
  });
}

export function useOrderDetailQuery(orderId: string) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => fetchOrderById(orderId),
    enabled: Boolean(orderId),
  });
}
