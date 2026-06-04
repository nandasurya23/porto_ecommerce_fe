import { getErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiEnvelope, ApiErrorItem, ApiResponse } from "@/types/api";

const defaultApiBaseUrl = "http://127.0.0.1:8080/api/v1";
const defaultAssetBaseUrl = "http://127.0.0.1:8080";
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? (process.env.NODE_ENV === "development" ? defaultApiBaseUrl : "");
const assetBaseUrl =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? (process.env.NODE_ENV === "development" ? defaultAssetBaseUrl : "");

export class ApiClientError extends Error {
  status: number;
  fieldErrors?: ApiErrorItem[];

  constructor(message: string, status: number, fieldErrors?: ApiErrorItem[]) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type RequestOptions = RequestInit & {
  token?: string | null;
};

function resolveToken(token?: string | null): string | null {
  if (token !== undefined) {
    return token;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return useAuthStore.getState().token;
}

function isFormDataBody(body: BodyInit | null | undefined): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function parseJson<T>(response: Response): Promise<ApiEnvelope<T> | null> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return null;
  }
}

export function buildAssetUrl(path?: string | null): string {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (!assetBaseUrl) {
    return path;
  }

  return `${assetBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  if (!baseUrl) {
    throw new Error("API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL.");
  }

  const headers = new Headers(options.headers);
  const body = options.body;

  if (!isFormDataBody(body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = resolveToken(options.token);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    body,
  });

  const payload = await parseJson<T>(response);

  if (!response.ok || !payload || payload.success === false) {
    const errorPayload = payload && payload.success === false ? payload : null;
    const message = errorPayload?.message ?? response.statusText ?? "Request failed";
    throw new ApiClientError(message || getErrorMessage(new Error("Request failed")), response.status, errorPayload?.errors);
  }

  return payload;
}

export async function apiFetchData<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await apiFetch<T>(path, options);
  return response.data;
}

export async function apiFetchWithMeta<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, options);
}
