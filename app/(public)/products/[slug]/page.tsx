"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatCurrency } from "@/lib/format";
import { useAddToCartMutation } from "@/features/cart/mutations";
import { useProductDetailQuery, useProductsQuery } from "@/features/products/queries";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { toast } from "sonner";
import { CheckCircle2, Plus, Minus, PlayCircle, ShieldCheck, ShoppingCart, Truck } from "lucide-react";

export default function ProductDetailPage(): React.JSX.Element {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const query = useProductDetailQuery(slug);
  const relatedQuery = useProductsQuery();
  const addToCart = useAddToCartMutation();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "materials" | "care">("description");
  const [quantity, setQuantity] = useState(1);
  const images = query.data?.images ?? [];
  const primaryImage = images[0];
  const activeImage = images[selectedImageIndex] ?? primaryImage;

  const product = query.data;
  const selectedVariant =
    product?.variants.find(
      (variant) => variant.color === selectedColor && variant.size === selectedSize,
    ) ?? null;

  useEffect(() => {
    if (product?.variants[0]) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
    }
  }, [product?.id, product?.variants]);

  useEffect(() => {
    setSelectedImageIndex(0);
    setActiveTab("description");
    setQuantity(1);
  }, [product?.id]);

  const colors = product ? [...new Set(product.variants.map((variant) => variant.color))] : [];
  const availableVariants = product?.variants.filter((variant) =>
    selectedColor ? variant.color === selectedColor : true,
  );
  const sizes = product ? [...new Set(availableVariants?.map((variant) => variant.size))] : [];
  const totalStock = product?.variants.reduce((sum, variant) => sum + variant.stock, 0) ?? 0;
  const currentPrice = selectedVariant?.price ?? product?.basePrice ?? 0;
  const currentSku = selectedVariant?.sku ?? product?.variants[0]?.sku ?? "";
  const maxQuantity = selectedVariant?.stock ?? 1;

  return (
    <div className="container-shell py-8">
      <div className="page-shell">
        {query.isLoading ? <LoadingState /> : null}
        {query.isError ? <ErrorState message="Gagal memuat detail produk." onRetry={() => void query.refetch()} /> : null}
        {!query.isLoading && !product ? (
          <EmptyState title="Produk tidak ditemukan" description="Slug produk tidak valid." />
        ) : null}

        {product ? (
          <>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-lg border border-border bg-slate-100">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-200 via-white to-slate-100">
                    {activeImage ? (
                      <Image
                        src={activeImage}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover object-center transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-fg-muted">
                        No image available
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {images.slice(0, 3).map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg border bg-slate-100 transition ${
                        selectedImageIndex === index ? "border-slate-950 ring-1 ring-slate-950" : "border-border hover:border-border-strong"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image src={image} alt={`${product.name} thumbnail ${index + 1}`} fill unoptimized className="object-cover" sizes="25vw" />
                    </button>
                  ))}
                  <button
                    type="button"
                    className="flex aspect-square items-center justify-center rounded-lg border border-border bg-slate-100 text-slate-500 transition hover:border-border-strong hover:text-slate-950"
                    aria-label="Play product media"
                  >
                    <PlayCircle className="h-10 w-10" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-[clamp(2.2rem,3.2vw,3.4rem)] font-black tracking-[-0.07em] text-slate-950">{product.name}</h1>
                  <p className="text-[clamp(1.6rem,2vw,2.2rem)] font-bold tracking-[-0.05em] text-slate-950">
                    {formatCurrency(currentPrice)}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone="success" className="rounded-sm border border-emerald-600 bg-emerald-50 text-emerald-700">
                      In Stock: {totalStock}
                    </Badge>
                    <span className="text-sm text-slate-500">SKU: {currentSku}</span>
                  </div>
                </div>

                <hr className="border-border" />

                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-lg font-medium text-slate-950">
                      <span>Color:</span>
                      <span className="text-slate-600">{selectedColor || "Select color"}</span>
                    </div>
                    <div className="flex gap-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          aria-label={`Select ${color}`}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedSize("");
                          }}
                          className={`h-12 w-12 rounded-2xl border-2 transition ${
                            selectedColor === color ? "border-slate-950 ring-2 ring-slate-950 ring-offset-2" : "border-border hover:border-border-strong"
                          } ${getColorSwatchClass(color)}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <h2 className="text-lg font-medium text-slate-950">Size (US)</h2>
                      <Link href="/products" className="text-sm text-blue-600 transition hover:underline">
                        Size Guide
                      </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {sizes.map((size) => {
                        const variant = product.variants.find((item) => item.color === selectedColor && item.size === size);
                        const disabled = Boolean(variant && variant.stock === 0);
                        const active = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedSize(size)}
                            className={`h-14 rounded-sm border text-center text-lg transition ${
                              active
                                ? "border-slate-950 bg-slate-950 text-white"
                                : "border-border bg-white text-slate-950 hover:border-slate-950 hover:bg-slate-50"
                            } ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-400 hover:border-border" : ""}`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex h-14 items-center border border-border bg-white">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                        className="inline-flex h-full items-center justify-center px-4 text-slate-600 transition hover:text-slate-950"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        aria-label="Quantity"
                        type="number"
                        min={1}
                        max={maxQuantity}
                        value={quantity}
                        onChange={(event) => {
                          const next = Number(event.target.value);
                          if (Number.isNaN(next)) return;
                          setQuantity(Math.min(maxQuantity, Math.max(1, next)));
                        }}
                        className="h-full w-16 border-0 bg-transparent text-center text-lg font-medium text-slate-950 focus:outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                        className="inline-flex h-full items-center justify-center px-4 text-slate-600 transition hover:text-slate-950"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-1 gap-3">
                      <button
                        type="button"
                        className="flex h-14 flex-1 items-center justify-center gap-2 rounded-sm bg-slate-950 text-lg font-semibold text-white transition hover:bg-slate-800"
                        disabled={!selectedVariant || selectedVariant.stock === 0}
                        onClick={() => {
                          if (!selectedVariant) return;
                          addToCart.mutate(
                            {
                              productId: product.id,
                              variantId: selectedVariant.id,
                              productName: product.name,
                              slug: product.slug,
                              image: primaryImage ?? "",
                              color: selectedVariant.color,
                              size: selectedVariant.size,
                              quantity,
                              price: selectedVariant.price,
                              stock: selectedVariant.stock,
                            },
                            {
                              onSuccess: () => {
                                toast.success("Item ditambahkan ke cart.");
                                router.push("/cart");
                              },
                              onError: (error) => {
                                toast.error(error instanceof Error ? error.message : "Gagal menambahkan item.");
                              },
                            },
                          );
                        }}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </button>
                      <WishlistButton
                        product={product}
                        className="h-14 w-14 rounded-sm border-border-muted bg-white text-slate-600 opacity-100 hover:border-slate-950 hover:text-slate-950"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <div className="flex border-b border-border bg-slate-50">
                    <TabButton active={activeTab === "description"} onClick={() => setActiveTab("description")}>
                      Description
                    </TabButton>
                    <TabButton active={activeTab === "materials"} onClick={() => setActiveTab("materials")}>
                      Materials
                    </TabButton>
                    <TabButton active={activeTab === "care"} onClick={() => setActiveTab("care")}>
                      Care
                    </TabButton>
                  </div>
                  <div className="space-y-4 p-5 text-[15px] leading-7 text-slate-700">
                    {activeTab === "description" ? <p>{product.description}</p> : null}
                    {activeTab === "materials" ? <p>{product.material || "Material information is not available yet."}</p> : null}
                    {activeTab === "care" ? (
                      <ul className="list-disc space-y-2 pl-5">
                        <li>Wipe gently after use with a soft dry cloth.</li>
                        <li>Keep away from direct heat and damp storage areas.</li>
                        <li>Store in a cool, dry place to preserve shape and finish.</li>
                      </ul>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3">
                  <TrustRow
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    title="Variant-safe selection"
                    description="Only valid color and size combinations are added to cart."
                  />
                  <TrustRow
                    icon={<Truck className="h-4 w-4" />}
                    title="Shipping ready"
                    description="Ready to ship with standard and express options."
                  />
                  <TrustRow
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Clear return info"
                    description="Return summary is visible at checkout and order detail."
                  />
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-4 pt-4">
            <div className="page-header">
              <div>
                <p className="page-eyebrow">Related products</p>
                <h2 className="page-title text-2xl sm:text-3xl">More styles to compare</h2>
              </div>
              <Link href="/products" className="text-sm font-medium text-fg-muted hover:text-fg">
                Back to catalog
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedQuery.data
                ?.filter((item) => item.id !== product.id)
                .slice(0, 3)
                .map((item) => (
                  <LinkCard key={item.id} href={`/products/${item.slug}`} title={item.name} subtitle={item.category} />
                ))}
            </div>
          </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

function LinkCard({ href, title, subtitle }: { href: string; title: string; subtitle: string }): React.JSX.Element {
  return (
    <Link href={href}>
      <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
        <CardContent className="py-5">
          <p className="text-xs uppercase tracking-[0.14em] text-fg-muted">{subtitle}</p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}

function Meta({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted">{label}</p>
      <p className="mt-1 text-sm font-medium tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function TrustRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-white/70 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
        {icon}
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-slate-950">{title}</p>
        <p className="text-sm leading-6 text-fg-muted">{description}</p>
      </div>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border-b-2 px-4 py-4 text-sm font-semibold transition ${
        active
          ? "border-slate-950 bg-white text-slate-950"
          : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}

function getColorSwatchClass(color: string): string {
  const value = color.trim().toLowerCase();
  if (value.includes("red")) return "bg-[#ef453c]";
  if (value.includes("black")) return "bg-black";
  if (value.includes("white")) return "bg-white";
  if (value.includes("blue")) return "bg-blue-500";
  if (value.includes("green") || value.includes("olive")) return "bg-emerald-700";
  if (value.includes("brown")) return "bg-amber-900";
  if (value.includes("navy")) return "bg-slate-900";
  if (value.includes("gray") || value.includes("grey")) return "bg-slate-400";
  return "bg-slate-200";
}
