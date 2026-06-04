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
import { useAdminCategoriesQuery } from "@/features/products/queries";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  category: z.string().min(2),
  description: z.string().min(10),
  basePrice: z.coerce.number().positive(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  sku: z.string().min(3),
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      description: "",
      basePrice: 0,
      status: "DRAFT",
      sku: "",
      color: "",
      size: "",
      variantPrice: 0,
      stock: 0,
      weight: 1,
    },
  });

  return (
    <form
      className="page-shell"
      onSubmit={form.handleSubmit((values) => {
        if (!imageFile) {
          setImageError("Product image is required.");
          return;
        }

        mutation.mutate(
          {
            categoryId: values.category || null,
            name: values.name,
            slug: values.slug,
            description: values.description,
            basePrice: values.basePrice,
            status: values.status,
            imageFile,
            variant: {
              sku: values.sku,
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
          <Field label="SKU" error={form.formState.errors.sku?.message}><Input {...form.register("sku")} /></Field>
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
