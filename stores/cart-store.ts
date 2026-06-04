import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSafeStorage } from "@/lib/storage";
import type { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
};

type CartActions = {
  setItems: (items: CartItem[]) => void;
  clear: () => void;
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "porto-cart-store",
      storage: createJSONStorage(() => createSafeStorage()),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
