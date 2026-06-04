export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ProductVariant = {
  id: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  weight: number;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
};

export type Product = {
  id: string;
  categoryId?: string | null;
  categoryName?: string | null;
  slug: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  status: ProductStatus;
  material?: string;
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt?: string;
};
