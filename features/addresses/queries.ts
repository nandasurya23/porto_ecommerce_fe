"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAddresses } from "@/services/address.service";

export function useAddressesQuery() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => fetchAddresses(),
    staleTime: 30_000,
  });
}
