"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUserRequest, loginRequest, logoutRequest, registerRequest } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import type { LoginFormValues, RegisterFormValues } from "@/features/auth/schemas";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (values: LoginFormValues) => loginRequest(values),
    onSuccess: async (result) => {
      setUser(result.data.user, result.data.token);
      queryClient.setQueryData(["auth", "me"], result.data.user);
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (values: RegisterFormValues) => registerRequest(values),
    onSuccess: async (result) => {
      setUser(result.data.user, result.data.token);
      queryClient.setQueryData(["auth", "me"], result.data.user);
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const clearCart = useCartStore((state) => state.clear);

  return useMutation({
    mutationFn: async () => {
      try {
        await logoutRequest();
      } catch {
        // Logout is best-effort because JWT is not revoked server-side.
      }
      return true;
    },
    onSuccess: () => {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("porto-last-payment");
      }
      logout();
      clearCart();
      void queryClient.clear();
    },
  });
}

export async function bootstrapSession() {
  const store = useAuthStore.getState();
  if (!store.token) {
    return null;
  }

  try {
    const response = await fetchCurrentUserRequest();
    store.setUser(response.data.user, store.token);
    return response.data.user;
  } catch {
    store.logout();
    return null;
  }
}
