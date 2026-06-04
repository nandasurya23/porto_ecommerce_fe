"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInventory } from "@/services/inventory.service";

export function useInventoryQuery() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => fetchInventory(),
  });
}
