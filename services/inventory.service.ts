import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import { fetchAdminProducts } from "@/services/product.service";
import type { ApiMeta } from "@/types/api";
import type { InventoryLog } from "@/types/inventory";
import type { ProductVariant } from "@/types/product";
import type { BackendDashboardLowStock, BackendInventoryLog } from "@/types/backend";

type InventoryResult = {
  variants: Array<ProductVariant & { productName: string; category: string }>;
  logs: InventoryLog[];
  lowStock: BackendDashboardLowStock[];
  meta?: ApiMeta;
};

function mapInventoryLog(item: BackendInventoryLog): InventoryLog {
  return {
    id: item.id,
    variantId: item.product_variant_id,
    sku: item.sku,
    movementType: item.type,
    previousStock: item.previous_stock,
    currentStock: item.current_stock,
    note: item.note ?? "",
    changedBy: item.created_by ?? "System",
    createdAt: item.created_at,
  };
}

export async function fetchInventory(): Promise<InventoryResult> {
  const [productsResponse, logsResponse, lowStockResponse] = await Promise.all([
    fetchAdminProducts(),
    apiFetch<BackendInventoryLog[]>(endpoints.inventoryLogs, { method: "GET" }),
    apiFetch<BackendDashboardLowStock[]>(endpoints.adminDashboard.lowStock, { method: "GET" }),
  ]);

  const variants = productsResponse.items.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productName: product.name,
      category: product.category,
    })),
  );
  const variantMap = new Map(variants.map((variant) => [variant.id, variant.productName]));

  return {
    variants,
    logs: logsResponse.data.map((item) => ({
      ...mapInventoryLog(item),
      productName: variantMap.get(item.product_variant_id) ?? "",
    })),
    lowStock: lowStockResponse.data,
    meta: logsResponse.meta,
  };
}

export function adjustStockRequest(payload: {
  variantId: string;
  quantity: number;
  type?: string;
  note?: string;
}) {
  return apiFetch<Record<string, unknown>>(`${endpoints.adminVariants}/${payload.variantId}/stock`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity: payload.quantity,
      type: payload.type ?? "MANUAL_ADJUSTMENT",
      note: payload.note ?? "",
    }),
  });
}
