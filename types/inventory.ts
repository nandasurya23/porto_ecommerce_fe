export type InventoryLog = {
  id: string;
  variantId: string;
  productName?: string;
  sku: string;
  movementType: "IN" | "OUT" | "ADJUSTMENT" | "RESTOCK" | "SALE" | "MANUAL_ADJUSTMENT" | "RETURN" | "CANCEL_CORRECTION";
  previousStock: number;
  currentStock: number;
  note: string;
  changedBy: string;
  createdAt: string;
};
