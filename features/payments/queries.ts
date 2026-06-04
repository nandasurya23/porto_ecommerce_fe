"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPaymentByOrderId, fetchPayments } from "@/services/payment.service";
import { readLastPayment } from "@/features/checkout/mutations";

export function usePaymentByOrderQuery(orderId: string) {
  return useQuery({
    queryKey: ["payments", orderId],
    queryFn: async () => {
      const payment = await fetchPaymentByOrderId(orderId);
      if (payment) {
        return payment;
      }

      const lastPayment = readLastPayment();
      if (lastPayment && lastPayment.orderId === orderId) {
        return {
          id: orderId,
          orderId,
          orderNumber: lastPayment.orderNumber,
          code: lastPayment.paymentCode,
          method: lastPayment.paymentMethod,
          amount: lastPayment.amount,
          expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: "PENDING" as const,
        };
      }

      return null;
    },
    enabled: Boolean(orderId),
  });
}

export function usePaymentsQuery() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => fetchPayments(),
  });
}
