"use client";

import type * as React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import {
  useArchiveProductMutation,
  useUpdateProductMutation,
  usePermanentDeleteProductMutation,
  useUpsertVariantMutation,
  useUploadProductImageMutation,
} from "@/features/products/mutations";
import { useAdminCategoriesQuery, useProductByIdQuery } from "@/features/products/queries";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  category: z.string().optional(),
  description: z.string().min(10),
  basePrice: z.coerce.number().positive(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

type FormValues = z.infer<typeof schema>;

const variantSchema = z.object({
  sku: z.string().min(3),
  color: z.string().min(2),
  size: z.string().min(1),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().min(0),
  weight: z.coerce.number().positive(),
});

type VariantValues = z.infer<typeof variantSchema>;

export default function EditProductPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const query = useProductByIdQuery(params.id);
  const categoriesQuery = useAdminCategoriesQuery();
  const updateMutation = useUpdateProductMutation();
  const archiveMutation = useArchiveProductMutation();
  const permanentDeleteMutation = usePermanentDeleteProductMutation();
  const upsertVariantMutation = useUpsertVariantMutation();
  const uploadImageMutation = useUploadProductImageMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const product = query.data;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: product
      ? {
          name: product.name,
          slug: product.slug,
          category: product.categoryId ?? "",
          description: product.description,
          basePrice: product.basePrice,
          status: product.status,
        }
      : undefined,
  });
  const variantForm = useForm<VariantValues>({
    resolver: zodResolver(variantSchema),
    values: product?.variants[0]
      ? {
          sku: product.variants[0].sku,
          color: product.variants[0].color,
          size: product.variants[0].size,
          price: product.variants[0].price,
          stock: product.variants[0].stock,
          weight: product.variants[0].weight,
        }
      : {
          sku: "",
          color: "",
          size: "",
          price: 0,
          stock: 0,
          weight: 1,
        },
  });

  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.isError) {
    return <ErrorState message="Gagal memuat product." onRetry={() => void query.refetch()} />;
  }

  if (!product) {
    return <EmptyState title="Product not found" description="Cannot edit a missing product." />;
  }

  return (
    <div className="page-shell">
      <form
        className="page-shell"
        onSubmit={form.handleSubmit((values) =>
          updateMutation.mutate(
            {
              productId: product.id,
              data: {
                categoryId: values.category || null,
                name: values.name,
                slug: values.slug,
                description: values.description,
                basePrice: values.basePrice,
                status: values.status,
              },
            },
            {
              onSuccess: () => {
                toast.success("Product updated.");
                router.refresh();
              },
              onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Gagal memperbarui product.");
              },
            },
          ),
        )}
      >
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Products</p>
            <h1 className="page-title">Edit product</h1>
            <p className="page-description">Update catalog metadata and archive when the product is no longer active.</p>
          </div>
        </div>
        <section className="section-surface p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" error={form.formState.errors.name?.message}><Input {...form.register("name")} /></Field>
            <Field label="Slug" error={form.formState.errors.slug?.message}><Input {...form.register("slug")} /></Field>
            <Field label="Category" error={form.formState.errors.category?.message}>
              <Select {...form.register("category")}>
                <option value="">Select category</option>
                {categoriesQuery.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Base price" error={form.formState.errors.basePrice?.message}><Input type="number" {...form.register("basePrice")} /></Field>
            <Field label="Status" error={form.formState.errors.status?.message}>
              <Select {...form.register("status")}>
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </Select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Description" error={form.formState.errors.description?.message}>
              <Textarea {...form.register("description")} />
            </Field>
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={updateMutation.isPending}>
            Save changes
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              archiveMutation.mutate(product.id, {
                onSuccess: () => {
                  toast.success("Product moved to archive.");
                  router.push("/admin/products");
                },
                onError: (error) => {
                  toast.error(error instanceof Error ? error.message : "Gagal memindahkan product ke archive.");
                },
              })
            }
          >
            Move to archive
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              const confirmed = window.confirm(
                "Delete this product permanently? This will remove the product, its images, variants, cart references, and inventory logs.",
              );

              if (!confirmed) {
                return;
              }

              permanentDeleteMutation.mutate(product.id, {
                onSuccess: () => {
                  toast.success("Product permanently deleted.");
                  router.push("/admin/products");
                },
                onError: (error) => {
                  toast.error(error instanceof Error ? error.message : "Gagal menghapus product secara permanen.");
                },
              });
            }}
            disabled={permanentDeleteMutation.isPending}
          >
            Delete permanently
          </Button>
        </div>
      </form>

      <section className="space-y-4 section-surface p-4 sm:p-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Product images</h2>
          <p className="text-sm text-fg-muted">
            Upload a replacement primary image or add a new image using drag and drop.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <ImageDropzone
            label="Upload image"
            description="JPEG, PNG, or WEBP. The selected file will be uploaded as the primary image."
            file={imageFile}
            previewUrl={product.images[0] ?? ""}
            onChange={setImageFile}
            disabled={uploadImageMutation.isPending}
          />
          <Button
            type="button"
            disabled={!imageFile || uploadImageMutation.isPending}
            onClick={() => {
              if (!imageFile) {
                return;
              }

              uploadImageMutation.mutate(
                {
                  productId: product.id,
                  image: imageFile,
                  isPrimary: true,
                },
                {
                  onSuccess: () => {
                    toast.success("Image uploaded.");
                    setImageFile(null);
                    void query.refetch();
                  },
                  onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Gagal upload image.");
                  },
                },
              );
            }}
          >
            Upload image
          </Button>
        </div>
      </section>

      <form
        className="space-y-4 section-surface p-4 sm:p-5"
        onSubmit={variantForm.handleSubmit((values) =>
          upsertVariantMutation.mutate(
            {
              productId: product.id,
              variantId: product.variants[0]?.id,
              variant: {
                sku: values.sku,
                color: values.color,
                size: values.size,
                price: values.price,
                stock: values.stock,
                weight: values.weight,
                status: "ACTIVE",
              },
            },
            {
              onSuccess: () => {
                toast.success("Variant saved.");
                router.refresh();
              },
              onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Gagal menyimpan variant.");
              },
            },
          ),
        )}
      >
        <h2 className="text-xl font-semibold tracking-tight">Variant editor</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SKU" error={variantForm.formState.errors.sku?.message}><Input {...variantForm.register("sku")} /></Field>
          <Field label="Color" error={variantForm.formState.errors.color?.message}><Input {...variantForm.register("color")} /></Field>
          <Field label="Size" error={variantForm.formState.errors.size?.message}><Input {...variantForm.register("size")} /></Field>
          <Field label="Price" error={variantForm.formState.errors.price?.message}><Input type="number" {...variantForm.register("price")} /></Field>
          <Field label="Stock" error={variantForm.formState.errors.stock?.message}><Input type="number" {...variantForm.register("stock")} /></Field>
          <Field label="Weight" error={variantForm.formState.errors.weight?.message}><Input type="number" {...variantForm.register("weight")} /></Field>
        </div>
        <Button type="submit" variant="secondary" disabled={upsertVariantMutation.isPending}>
          Save variant
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
