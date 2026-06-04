import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { AuthUser } from "@/types/auth";

type AuthPayload = {
  user: AuthUser;
  token: string;
};

export function loginRequest(payload: { email: string; password: string }) {
  return apiFetch<AuthPayload>(endpoints.auth.login, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerRequest(payload: { name: string; email: string; password: string; phone?: string }) {
  return apiFetch<AuthPayload>(endpoints.auth.register, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchCurrentUserRequest() {
  return apiFetch<{ user: AuthUser }>(endpoints.auth.me, {
    method: "GET",
  });
}

export function logoutRequest() {
  return apiFetch<Record<string, never>>(endpoints.auth.logout, {
    method: "POST",
  });
}
