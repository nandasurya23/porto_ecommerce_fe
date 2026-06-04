"use client";

import type * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProductMutation } from "@/features/products/mutations";
import { useAdminCategoriesQuery, useAdminProductsQuery } from "@/features/products/queries";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3),
  category: z.string().min(2),
  description: z.string().min(10),
  basePrice: z.coerce.number().positive(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  color: z.string().min(2),
  size: z.string().min(1),
  variantPrice: z.coerce.number().positive(),
  stock: z.coerce.number().min(0),
  weight: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof schema>;

export default function CreateProductPage(): React.JSX.Element {
  const router = useRouter();
  const mutation = useCreateProductMutation();
  const categoriesQuery = useAdminCategoriesQuery();
  const productsQuery = useAdminProductsQuery();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      basePrice: 0,
      status: "DRAFT",
      color: "",
      size: "",
      variantPrice: 0,
      stock: 0,
      weight: 1,
    },
  });
  const name = form.watch("name");
  const existingSlugs = new Set((productsQuery.data ?? []).map((product) => product.slug));
  const existingVariantSkus = new Set((productsQuery.data ?? []).flatMap((product) => product.variants.map((variant) => variant.sku)));
  const color = form.watch("color");
  const size = form.watch("size");
  const previewSlug = buildUniqueSlug(name, existingSlugs);
  const previewVariantSku = buildVariantSku(name, color, size, existingVariantSkus);

  return (
    <form
      className="page-shell"
      onSubmit={form.handleSubmit((values) => {
        if (!imageFile) {
          setImageError("Product image is required.");
          return;
        }

        const slug = buildUniqueSlug(values.name, existingSlugs);
        const variantSku = buildVariantSku(values.name, values.color, values.size, existingVariantSkus);

        mutation.mutate(
          {
            categoryId: values.category || null,
            name: values.name,
            slug,
            description: values.description,
            basePrice: values.basePrice,
            status: values.status,
            imageFile,
            variant: {
              sku: variantSku,
              color: values.color,
              size: values.size,
              price: values.variantPrice,
              stock: values.stock,
              weight: values.weight,
            },
          },
          {
            onSuccess: () => {
              toast.success("Product created.");
              router.push("/admin/products");
            },
            onError: (error) => {
              toast.error(error instanceof Error ? error.message : "Gagal membuat product.");
            },
          },
        );
      })}
    >
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Products</p>
          <h1 className="page-title">Create product</h1>
          <p className="page-description">Create catalog metadata and the first variant in one flow.</p>
        </div>
      </div>

      <section className="section-surface p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" error={form.formState.errors.name?.message}><Input {...form.register("name")} /></Field>
          <Field label="Slug" hint="Auto generated from name" error={undefined}>
            <Input value={previewSlug} readOnly />
          </Field>
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
          <Field label="Variant SKU" hint="Auto generated from name, color, and size" error={undefined}>
            <Input value={previewVariantSku} readOnly />
          </Field>
          <Field label="Color" error={form.formState.errors.color?.message}><Input {...form.register("color")} /></Field>
          <Field label="Size" error={form.formState.errors.size?.message}><Input {...form.register("size")} /></Field>
          <Field label="Variant price" error={form.formState.errors.variantPrice?.message}><Input type="number" {...form.register("variantPrice")} /></Field>
          <Field label="Stock" error={form.formState.errors.stock?.message}><Input type="number" {...form.register("stock")} /></Field>
          <Field label="Weight" error={form.formState.errors.weight?.message}><Input type="number" {...form.register("weight")} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Description" error={form.formState.errors.description?.message}>
            <Textarea {...form.register("description")} />
          </Field>
        </div>
        <div className="mt-4">
          <ImageDropzone
            label="Product image"
            description="Drag and drop one image for the primary product image."
            file={imageFile}
            error={imageError}
            onChange={(file) => {
              setImageFile(file);
              setImageError(undefined);
            }}
          />
        </div>
      </section>
      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          Create product
        </Button>
      </div>
    </form>
  );
}

function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "product";
}

function buildUniqueSlug(name: string, existingSlugs: Set<string>): string {
  const baseSlug = slugify(name);
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (existingSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

function buildVariantSku(name: string, color: string, size: string, existingSkus: Set<string>): string {
  const productCode = abbreviateSkuToken(name);
  const colorCode = abbreviateSkuToken(color);
  const sizeCode = abbreviateSkuToken(size);
  const baseSku = [productCode, colorCode, sizeCode].filter(Boolean).join("-");

  if (!existingSkus.has(baseSku)) {
    return baseSku;
  }

  let suffix = 2;
  while (existingSkus.has(`${baseSku}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSku}-${suffix}`;
}

function abbreviateSkuToken(value: string): string {
  const parts = value
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);

  if (parts.length > 1) {
    return parts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase();
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-4">
        <label className="block text-sm font-medium">{label}</label>
        {hint ? <span className="text-xs text-fg-muted">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
