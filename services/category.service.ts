import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { Category } from "@/types/category";
import type { BackendCategory } from "@/types/backend";

function mapCategory(item: BackendCategory): Category {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description ?? null,
    isActive: item.is_active,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function fetchPublicCategories(): Promise<Category[]> {
  const response = await apiFetch<BackendCategory[]>(endpoints.categories, {
    method: "GET",
  });
  return response.data.map(mapCategory);
}

export async function fetchAdminCategories(): Promise<Category[]> {
  const response = await apiFetch<BackendCategory[]>(endpoints.adminCategories, {
    method: "GET",
  });
  return response.data.map(mapCategory);
}

export function createCategoryRequest(payload: {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}) {
  return apiFetch<BackendCategory>(endpoints.adminCategories, {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      slug: payload.slug,
      description: payload.description ?? "",
      is_active: payload.isActive ?? true,
    }),
  });
}

export function updateCategoryRequest(
  categoryId: string,
  payload: {
    name: string;
    slug: string;
    description?: string;
    isActive?: boolean;
  },
) {
  return apiFetch<BackendCategory>(`${endpoints.adminCategories}/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: payload.name,
      slug: payload.slug,
      description: payload.description ?? "",
      is_active: payload.isActive ?? true,
    }),
  });
}

export function deleteCategoryRequest(categoryId: string) {
  return apiFetch<Record<string, never>>(`${endpoints.adminCategories}/${categoryId}`, {
    method: "DELETE",
  });
}
