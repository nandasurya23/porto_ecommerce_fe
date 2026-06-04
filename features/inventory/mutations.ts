"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjustStockRequest } from "@/services/inventory.service";

export function useUpdateStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      variantId: string;
      previousStock: number;
      nextStock: number;
      note?: string;
    }) =>
      adjustStockRequest({
        variantId: payload.variantId,
        quantity: payload.nextStock - payload.previousStock,
        type: "MANUAL_ADJUSTMENT",
        note: payload.note ?? "Stock updated from admin inventory page",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
