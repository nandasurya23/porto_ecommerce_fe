"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatusRequest } from "@/services/order.service";
import type { Order } from "@/types/order";

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { orderId: string; status: Order["status"] }) =>
      updateOrderStatusRequest(payload.orderId, payload.status),
    onSuccess: async (_result, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
