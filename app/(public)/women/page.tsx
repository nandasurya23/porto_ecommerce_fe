"use client";

import type * as React from "react";
import { CategoryLandingPage } from "@/components/public/category-landing-page";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useProductsQuery } from "@/features/products/queries";

const WOMEN_HERO_IMAGE =
  "https://images.unsplash.com/photo-1528701800489-20be3c41e6b7?auto=format&fit=crop&w=2400&q=80";

export default function WomenPage(): React.JSX.Element {
  const query = useProductsQuery({ sort: "newest" });
  const allProducts = query.data ?? [];
  const curatedProducts = allProducts.filter((product) => ["Lifestyle", "Running", "Trail"].includes(product.category));
  const products = curatedProducts.length > 0 ? curatedProducts : allProducts;

  if (query.isLoading) {
    return <LoadingState label="Memuat women collection..." />;
  }

  if (query.isError) {
    return <ErrorState message="Gagal memuat women collection." onRetry={() => void query.refetch()} />;
  }

  if (products.length === 0) {
    return <EmptyState title="No products found" description="No women's selection available right now." />;
  }

  return (
    <div className="container-shell py-8">
      <CategoryLandingPage
        eyebrow="Women"
        title="Everyday, elevated."
        description="Soft neutrals, clean lines, and versatile silhouettes selected for workdays, weekends, and travel."
        heroImage={WOMEN_HERO_IMAGE}
        heroImageAlt="Women's footwear editorial image"
        accentClassName="bg-[#f5f7fb]"
        stats={[
          { label: "Curated picks", value: String(products.length) },
          {
            label: "Daily wear",
            value: String(products.filter((product) => product.category === "Lifestyle").length),
          },
          { label: "New in", value: "Fresh edits" },
        ]}
        products={products}
        sectionTitle="Women's selection"
        sectionSubtitle="Clean shapes and versatile builds chosen for rotation across the week."
        tags={curatedProducts.length > 0 ? ["Lifestyle", "Running", "Trail"] : ["All available products"]}
      />
    </div>
  );
}
