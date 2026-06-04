"use client";

import type * as React from "react";
import { CategoryLandingPage } from "@/components/public/category-landing-page";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingCategoryPageSkeleton } from "@/components/ui/loading-skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { useProductsQuery } from "@/features/products/queries";

const MEN_HERO_IMAGE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2400&q=80";

export default function MenPage(): React.JSX.Element {
  const query = useProductsQuery({ sort: "newest" });
  const allProducts = query.data ?? [];
  const curatedProducts = allProducts.filter((product) => ["Running", "Trail", "Lifestyle"].includes(product.category));
  const products = curatedProducts.length > 0 ? curatedProducts : allProducts;

  if (query.isLoading) {
    return <LoadingCategoryPageSkeleton />;
  }

  if (query.isError) {
    return <ErrorState message="Gagal memuat men collection." onRetry={() => void query.refetch()} />;
  }

  if (products.length === 0) {
    return <EmptyState title="No products found" description="No men's selection available right now." />;
  }

  return (
    <div className="container-shell py-8">
      <CategoryLandingPage
        eyebrow="Men"
        title="Built to move."
        description="A focused edit of performance-led silhouettes, everyday essentials, and rugged trainers for the modern rotation."
        heroImage={MEN_HERO_IMAGE}
        heroImageAlt="Men's footwear editorial image"
        accentClassName="bg-[#f5f3ef]"
        stats={[
          { label: "Curated picks", value: String(products.length) },
          {
            label: "Fast movers",
            value: String(products.filter((product) => product.variants.some((variant) => variant.stock > 5)).length),
          },
          { label: "Starting from", value: "Shop now" },
        ]}
        products={products}
        sectionTitle="Men's selection"
        sectionSubtitle="Performance-first footwear edited for daily wear, training, and travel."
        tags={curatedProducts.length > 0 ? ["Running", "Trail", "Lifestyle"] : ["All available products"]}
      />
    </div>
  );
}
