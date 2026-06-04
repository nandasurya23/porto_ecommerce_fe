"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCartItemRequest,
  clearCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from "@/services/cart.service";
import { useCartStore } from "@/stores/cart-store";
import type { CartItem } from "@/types/cart";

export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<CartItem, "id">) => addCartItemRequest({ productVariantId: item.variantId, quantity: item.quantity }),
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { itemId: string; quantity: number }) => updateCartItemRequest(payload.itemId, payload.quantity),
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => removeCartItemRequest(itemId),
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();
  const clear = useCartStore((state) => state.clear);

  return useMutation({
    mutationFn: async () => {
      await clearCartRequest();
      return true;
    },
    onSuccess: () => {
      clear();
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
