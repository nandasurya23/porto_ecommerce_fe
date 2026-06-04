"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { simulatePaymentFailedRequest, simulatePaymentSuccessRequest } from "@/services/payment.service";

export function useSimulatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { orderId: string; status: "PAID" | "FAILED" }) =>
      payload.status === "PAID"
        ? simulatePaymentSuccessRequest(payload.orderId)
        : simulatePaymentFailedRequest(payload.orderId),
    onSuccess: async (_result, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["payments", variables.orderId] });
      await queryClient.invalidateQueries({ queryKey: ["payments"] });
      await queryClient.invalidateQueries({ queryKey: ["shipments"] });
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
