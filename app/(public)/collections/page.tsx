"use client";

import type * as React from "react";
import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { CategoryLandingPage } from "@/components/public/category-landing-page";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useProductCategoriesQuery, useProductsQuery } from "@/features/products/queries";

const COLLECTIONS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=2400&q=80";

export default function CollectionsPage(): React.JSX.Element {
  const productsQuery = useProductsQuery({ sort: "newest" });
  const categoriesQuery = useProductCategoriesQuery();

  if (productsQuery.isLoading || categoriesQuery.isLoading) {
    return <LoadingState label="Memuat collections..." />;
  }

  if (productsQuery.isError || categoriesQuery.isError) {
    return (
      <ErrorState
        message="Gagal memuat collections."
        onRetry={() => {
          void productsQuery.refetch();
          void categoriesQuery.refetch();
        }}
      />
    );
  }

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  if (products.length === 0) {
    return <EmptyState title="No products found" description="Collections will appear once products are available." />;
  }

  const categoryCounts = categories.map((category) => ({
    name: category.name,
    count: products.filter((product) => product.category === category.name).length,
  }));

  return (
    <div className="container-shell py-8">
      <div className="page-shell">
        <CategoryLandingPage
          eyebrow="Collections"
          title="The full edit."
          description="A complete storefront view that groups every active style into one editorial destination."
          heroImage={COLLECTIONS_HERO_IMAGE}
          heroImageAlt="Collections editorial image"
          accentClassName="bg-[#f3f4f6]"
          stats={[
            { label: "Total styles", value: String(products.length) },
            { label: "Active categories", value: String(categories.length) },
            { label: "Best value", value: "Browse all" },
          ]}
          products={products}
          productLimit={products.length}
          sectionTitle="All collections"
          sectionSubtitle="Browse the entire catalog by product family, compare silhouettes, and jump back to the main catalog."
          heroCtaLabel="Browse catalog"
          heroCtaHref="/products"
          secondaryCtaLabel="Open Wishlist"
          secondaryCtaHref="/wishlist"
          tags={categories.slice(0, 4).map((category) => category.name)}
        />

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4 border-b border-border-muted pb-4">
            <div>
              <p className="page-eyebrow">Browse by family</p>
              <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-slate-950">Category overview</h2>
            </div>
            <p className="hidden max-w-[420px] text-sm text-slate-500 sm:block">
              The current catalog is grouped by the active product categories returned from the backend.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categoryCounts.map((item) => (
              <Card key={item.name} className="rounded-none border-border-muted bg-white">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">Collection</p>
                      <h3 className="mt-1 text-[1.2rem] font-semibold tracking-tight text-slate-950">{item.name}</h3>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
                      <Layers3 className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.count} published products in this category.</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-orange-600"
                  >
                    Explore catalog
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
