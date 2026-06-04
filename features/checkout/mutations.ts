"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddressRequest } from "@/services/address.service";
import { createOrderRequest } from "@/services/order.service";
import { useCartStore } from "@/stores/cart-store";
import type { CheckoutFormValues } from "@/features/checkout/schemas";
import { useAuthStore } from "@/stores/auth-store";

const LAST_PAYMENT_KEY = "porto-last-payment";

function saveLastPayment(payload: {
  orderId: string;
  orderNumber: string;
  paymentCode: string;
  paymentMethod: string;
  amount: number;
}) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(LAST_PAYMENT_KEY, JSON.stringify(payload));
}

export function readLastPayment() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(LAST_PAYMENT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as {
      orderId: string;
      orderNumber: string;
      paymentCode: string;
      paymentMethod: string;
      amount: number;
    };
  } catch {
    return null;
  }
}

export function useCheckoutMutation() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clear);
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      if (!user) {
        throw new Error("Sesi tidak ditemukan. Silakan login kembali.");
      }

      const addressResponse = await createAddressRequest({
        receiverName: values.receiverName,
        phone: values.phone,
        province: values.province,
        city: values.city,
        district: values.district,
        postalCode: values.postalCode,
        fullAddress: values.fullAddress,
        isDefault: false,
      });

      const response = await createOrderRequest({
        addressId: addressResponse.data.id,
        paymentMethod: values.paymentMethod,
      });

      saveLastPayment({
        orderId: response.data.order_id,
        orderNumber: response.data.order_number,
        paymentCode: response.data.payment_code,
        paymentMethod: values.paymentMethod,
        amount: response.data.total_amount,
      });

      return response.data;
    },
    onSuccess: () => {
      clearCart();
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: ["payments"] });
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      void queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
