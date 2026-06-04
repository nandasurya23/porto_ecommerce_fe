import { apiFetch, buildAssetUrl } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { ApiMeta } from "@/types/api";
import type { Product, ProductVariant } from "@/types/product";
import type {
  BackendProductDetail,
  BackendProductImage,
  BackendProductListItem,
  BackendProductVariant,
} from "@/types/backend";

type ProductListResult = {
  items: Product[];
  meta?: ApiMeta;
};

function mapVariant(item: BackendProductVariant): ProductVariant {
  return {
    id: item.id,
    sku: item.sku,
    color: item.color,
    size: item.size,
    price: item.price,
    stock: item.stock,
    weight: item.weight_gram,
    status: item.status === "OUT_OF_STOCK" ? "OUT_OF_STOCK" : item.status,
  };
}

function mapImages(images: BackendProductImage[]): string[] {
  return images
    .slice()
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) {
        return a.is_primary ? -1 : 1;
      }
      return a.sort_order - b.sort_order;
    })
    .map((item) => buildAssetUrl(item.image_url));
}

function mapProduct(item: BackendProductDetail | BackendProductListItem, detail?: BackendProductDetail | null): Product {
  const categoryName = detail?.category_name ?? item.category_name ?? "";
  const images = detail ? mapImages(detail.images) : [];
  const variants = detail ? detail.variants.map(mapVariant) : [];

  return {
    id: item.id,
    categoryId: item.category_id ?? null,
    categoryName: categoryName ?? null,
    slug: item.slug,
    name: item.name,
    category: categoryName || "Uncategorized",
    description: item.description ?? "",
    material: "",
    basePrice: item.base_price,
    status: item.status,
    images,
    variants,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

async function fetchProductDetailBySlug(slug: string): Promise<BackendProductDetail | null> {
  try {
    const response = await apiFetch<BackendProductDetail>(`${endpoints.products}/${slug}`, {
      method: "GET",
    });
    return response.data;
  } catch {
    return null;
  }
}

async function enrichProducts(items: BackendProductListItem[]): Promise<Product[]> {
  const details = await Promise.all(
    items.map(async (item) => {
      if (item.status !== "PUBLISHED") {
        return { item, detail: null };
      }
      const detail = await fetchProductDetailBySlug(item.slug);
      return { item, detail };
    }),
  );

  return details.map(({ item, detail }) => mapProduct(detail ?? item, detail));
}

async function fetchProductList(path: string): Promise<ProductListResult> {
  const response = await apiFetch<BackendProductListItem[]>(path, {
    method: "GET",
  });
  const items = await enrichProducts(response.data);
  return { items, meta: response.meta };
}

export async function fetchPublicProducts(): Promise<ProductListResult> {
  return fetchProductList(`${endpoints.products}?page=1&limit=100`);
}

export async function fetchAdminProducts(): Promise<ProductListResult> {
  return fetchProductList(`${endpoints.adminProducts}?page=1&limit=100`);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const detail = await fetchProductDetailBySlug(slug);
  if (!detail) {
    return null;
  }
  return mapProduct(detail, detail);
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  const response = await apiFetch<BackendProductListItem[]>(`${endpoints.adminProducts}?page=1&limit=100`, {
    method: "GET",
  });
  const item = response.data.find((entry) => entry.id === productId);
  if (!item) {
    return null;
  }
  const detail = item.status === "PUBLISHED" ? await fetchProductDetailBySlug(item.slug) : null;
  return mapProduct(detail ?? item, detail);
}

export async function fetchProductCategories(): Promise<string[]> {
  const response = await apiFetch<BackendProductListItem[]>(`${endpoints.products}?page=1&limit=100`, {
    method: "GET",
  });
  return [...new Set(response.data.map((item) => item.category_name ?? "Uncategorized"))];
}

export function createProductRequest(payload: {
  categoryId?: string | null;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  return apiFetch<{ id: string }>(endpoints.adminProducts, {
    method: "POST",
    body: JSON.stringify({
      category_id: payload.categoryId ?? null,
      name: payload.name,
      slug: payload.slug,
      description: payload.description ?? "",
      base_price: payload.basePrice,
      status: payload.status,
    }),
  });
}

export function updateProductRequest(
  productId: string,
  payload: {
    categoryId?: string | null;
    name: string;
    slug: string;
    description?: string;
    basePrice: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  },
) {
  return apiFetch<Record<string, never>>(`${endpoints.adminProducts}/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({
      category_id: payload.categoryId ?? null,
      name: payload.name,
      slug: payload.slug,
      description: payload.description ?? "",
      base_price: payload.basePrice,
      status: payload.status,
    }),
  });
}

export function archiveProductRequest(productId: string) {
  return apiFetch<Record<string, never>>(`${endpoints.adminProducts}/${productId}`, {
    method: "DELETE",
  });
}

export function permanentlyDeleteProductRequest(productId: string) {
  return apiFetch<Record<string, never>>(`${endpoints.adminProducts}/${productId}/permanent`, {
    method: "DELETE",
  });
}

export function uploadProductImageRequest(
  productId: string,
  payload: {
    image: Blob;
    altText?: string;
    sortOrder?: number;
    isPrimary?: boolean;
  },
) {
  const formData = new FormData();
  formData.append("image", payload.image);
  if (payload.altText) {
    formData.append("alt_text", payload.altText);
  }
  formData.append("sort_order", String(payload.sortOrder ?? 0));
  formData.append("is_primary", payload.isPrimary ? "true" : "false");

  return apiFetch<{ id: string; image_url: string; is_primary: boolean }>(
    `${endpoints.adminProductImages}/${productId}/images`,
    {
      method: "POST",
      body: formData,
    },
  );
}

export function createVariantRequest(
  productId: string,
  payload: {
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;
    weight: number;
    status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  },
) {
  return apiFetch<{ id: string }>(`${endpoints.adminProducts}/${productId}/variants`, {
    method: "POST",
    body: JSON.stringify({
      sku: payload.sku,
      size: payload.size,
      color: payload.color,
      price: payload.price,
      stock: payload.stock,
      weight_gram: payload.weight,
      status: payload.status ?? "ACTIVE",
    }),
  });
}

export function updateVariantRequest(
  variantId: string,
  payload: {
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;
    weight: number;
    status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  },
) {
  return apiFetch<Record<string, never>>(`${endpoints.adminVariants}/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify({
      sku: payload.sku,
      size: payload.size,
      color: payload.color,
      price: payload.price,
      stock: payload.stock,
      weight_gram: payload.weight,
      status: payload.status ?? "ACTIVE",
    }),
  });
}
