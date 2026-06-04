"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "@/services/cart.service";
import { useCartStore } from "@/stores/cart-store";

export function useCartQuery() {
  const setItems = useCartStore((state) => state.setItems);

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const items = await fetchCart();
      setItems(items);
      return items;
    },
  });
}

export function useCartSummaryQuery() {
  const items = useCartStore((state) => state.items);

  return useQuery({
    queryKey: ["cart", "summary", items],
    queryFn: async () => {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = items.length > 0 ? 25000 : 0;
      return {
        subtotal,
        shipping,
        total: subtotal + shipping,
      };
    },
  });
}
