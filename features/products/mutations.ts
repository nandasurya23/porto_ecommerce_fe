"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveProductRequest,
  createProductRequest,
  createVariantRequest,
  updateProductRequest,
  updateVariantRequest,
  uploadProductImageRequest,
} from "@/services/product.service";

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      categoryId?: string | null;
      name: string;
      slug: string;
      description?: string;
      basePrice: number;
      status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      imageUrl?: string;
      imageFile?: File | Blob;
      imageAltText?: string;
      imageSortOrder?: number;
      variant?: {
        sku: string;
        color: string;
        size: string;
        price: number;
        stock: number;
        weight: number;
      };
    }) => {
      const product = await createProductRequest({
        categoryId: payload.categoryId ?? null,
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        basePrice: payload.basePrice,
        status: payload.status,
      });

      const productId = product.data.id;

      let imageFile = payload.imageFile;
      if (!imageFile && payload.imageUrl) {
        try {
          const response = await fetch(payload.imageUrl);
          if (response.ok) {
            imageFile = await response.blob();
          }
        } catch {
          imageFile = undefined;
        }
      }

      if (imageFile) {
        await uploadProductImageRequest(productId, {
          image: imageFile,
          altText: payload.imageAltText,
          sortOrder: payload.imageSortOrder,
          isPrimary: true,
        });
      }

      if (payload.variant) {
        await createVariantRequest(productId, {
          sku: payload.variant.sku,
          color: payload.variant.color,
          size: payload.variant.size,
          price: payload.variant.price,
          stock: payload.variant.stock,
          weight: payload.variant.weight,
        });
      }

      return product;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      productId: string;
      data: {
        categoryId?: string | null;
        name: string;
        slug: string;
        description?: string;
        basePrice: number;
        status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      };
    }) => updateProductRequest(payload.productId, payload.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useArchiveProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => archiveProductRequest(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUploadProductImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      productId: string;
      image: File | Blob;
      altText?: string;
      sortOrder?: number;
      isPrimary?: boolean;
    }) =>
      uploadProductImageRequest(payload.productId, {
        image: payload.image,
        altText: payload.altText,
        sortOrder: payload.sortOrder,
        isPrimary: payload.isPrimary,
      }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["products", variables.productId] });
    },
  });
}

export function useUpsertVariantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      productId: string;
      variantId?: string;
      variant: {
        sku: string;
        color: string;
        size: string;
        price: number;
        stock: number;
        weight: number;
        status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
      };
    }) => {
      if (payload.variantId) {
        return updateVariantRequest(payload.variantId, payload.variant);
      }
      return createVariantRequest(payload.productId, payload.variant);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
