import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSafeStorage } from "@/lib/storage";
import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/wishlist";

type WishlistState = {
  items: WishlistItem[];
};

type WishlistActions = {
  add: (product: Product) => void;
  remove: (productId: string) => void;
  toggle: (product: Product) => void;
  clear: () => void;
  isWishlisted: (productId: string) => boolean;
};

function toWishlistItem(product: Product): WishlistItem {
  const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  const colorCount = new Set(product.variants.map((variant) => variant.color)).size;
  const sizeCount = new Set(product.variants.map((variant) => variant.size)).size;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.basePrice,
    image: product.images[0],
    stock,
    colorCount,
    sizeCount,
    addedAt: new Date().toISOString(),
  };
}

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state;
          }

          return {
            items: [toWishlistItem(product), ...state.items],
          };
        }),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      toggle: (product) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) {
            return {
              items: state.items.filter((item) => item.id !== product.id),
            };
          }

          return {
            items: [toWishlistItem(product), ...state.items],
          };
        }),
      clear: () => set({ items: [] }),
      isWishlisted: (productId) => get().items.some((item) => item.id === productId),
    }),
    {
      name: "porto-wishlist-store",
      storage: createJSONStorage(() => createSafeStorage()),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
