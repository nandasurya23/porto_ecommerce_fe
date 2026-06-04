import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { CartItem } from "@/types/cart";
import type { BackendCartItem, BackendCartResponse } from "@/types/backend";
import { fetchProductBySlug } from "@/services/product.service";

async function mapCartItem(item: BackendCartItem): Promise<CartItem> {
  let image = "";

  const product = await fetchProductBySlug(item.product_slug);
  if (product?.images[0]) {
    image = product.images[0];
  }

  return {
    id: item.id,
    productId: item.product_variant_id,
    variantId: item.product_variant_id,
    productName: item.product_name,
    slug: item.product_slug,
    image,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
    stock: item.stock,
    subtotal: item.subtotal,
  };
}

export async function fetchCart(): Promise<CartItem[]> {
  const response = await apiFetch<BackendCartResponse>(endpoints.cart, {
    method: "GET",
  });
  return Promise.all(response.data.items.map(mapCartItem));
}

export function addCartItemRequest(payload: { productVariantId: string; quantity: number }) {
  return apiFetch<{ cart_id: string; product_variant_id: string; quantity: number }>(
    `${endpoints.cart}/items`,
    {
      method: "POST",
      body: JSON.stringify({
        product_variant_id: payload.productVariantId,
        quantity: payload.quantity,
      }),
    },
  );
}

export function updateCartItemRequest(itemId: string, quantity: number) {
  return apiFetch<{ cart_id: string }>(`${endpoints.cart}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItemRequest(itemId: string) {
  return apiFetch<Record<string, never>>(`${endpoints.cart}/items/${itemId}`, {
    method: "DELETE",
  });
}

export function clearCartRequest() {
  return apiFetch<Record<string, never>>(`${endpoints.cart}/items`, {
    method: "DELETE",
  });
}
