"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUserRequest } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function useCurrentUserQuery() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await fetchCurrentUserRequest();
      return response.data.user;
    },
    enabled: Boolean(token),
    staleTime: 60_000,
  });
}
