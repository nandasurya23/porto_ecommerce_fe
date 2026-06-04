"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useProductCategoriesQuery, useProductsQuery } from "@/features/products/queries";
import { LoadingCatalogSkeleton } from "@/components/ui/loading-skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProductsPage(): React.JSX.Element {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState<"all" | "available" | "low" | "out">("all");
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const { data: categories = [] } = useProductCategoriesQuery();
  const query = useProductsQuery({ search, category, size, color, stock, sort });

  const sizeOptions = useMemo(() => ["39", "40", "41", "42"], []);
  const colorOptions = useMemo(() => ["Black", "White", "Brown", "Navy", "Olive", "Orange"], []);

  return (
    <div className="container-shell py-8">
      <div className="page-shell">
        <section className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="self-start lg:sticky lg:top-28">
            <Card className="border-border-muted bg-white">
              <CardContent className="space-y-6 p-5 sm:p-6">
                <div>
                  <h1 className="text-[1.6rem] font-black tracking-[-0.08em] text-slate-950 sm:text-[2rem]">Filters</h1>
                  <div className="mt-4 h-px w-full bg-slate-200" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-950">Category</h2>
                  <div className="space-y-2">
                    <FilterOption label="All categories" active={!category} onClick={() => setCategory("")} />
                    {categories.map((item) => (
                      <FilterOption
                        key={item.id}
                        label={item.name}
                        active={category === item.name}
                        onClick={() => setCategory((current) => (current === item.name ? "" : item.name))}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-950">Size (US)</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {sizeOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSize((current) => (current === item ? "" : item))}
                        className={`h-12 border text-[15px] transition ${
                          size === item
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-border-muted bg-white text-slate-600 hover:border-slate-950 hover:text-slate-950"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-950">Color</h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setColor("")}
                      className={`rounded-sm border px-3 py-2 text-sm transition ${
                        !color ? "border-slate-950 bg-slate-950 text-white" : "border-border-muted bg-white text-slate-600"
                      }`}
                    >
                      All
                    </button>
                    {colorOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setColor((current) => (current === item ? "" : item))}
                        className={`rounded-sm border px-3 py-2 text-sm transition ${
                          color === item ? "border-slate-950 bg-slate-950 text-white" : "border-border-muted bg-white text-slate-600"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-950">Availability</h2>
                  <label className="flex items-center gap-3 text-[15px] text-slate-600">
                    <input
                      type="checkbox"
                      checked={stock === "available"}
                      onChange={(event) => setStock(event.target.checked ? "available" : "all")}
                      className="h-4 w-4 border-border-muted text-slate-950 focus:ring-slate-950"
                    />
                    In Stock Only
                  </label>
                </div>

                <div className="grid gap-3">
                  <div className="space-y-2">
                    <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-950">Search</h2>
                    <Input placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                      setSize("");
                      setColor("");
                      setStock("all");
                      setSort("newest");
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-border-muted pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[15px] text-slate-600">
                  Showing <span className="font-semibold text-slate-950">{query.data?.length ?? 0}</span> results
                  {category ? ` for "${category}"` : ""}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:min-w-[260px] sm:flex-row sm:items-center sm:gap-3">
                <label className="whitespace-nowrap text-[15px] text-slate-600" htmlFor="sort">
                  Sort by:
                </label>
                <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                  <option value="newest">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </Select>
              </div>
            </div>

            {query.isLoading ? <LoadingCatalogSkeleton /> : null}
            {query.isError ? <ErrorState message="Gagal memuat katalog." onRetry={() => void query.refetch()} /> : null}
            {query.data?.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting the filters to find more footwear options."
                actionLabel="Reset filters"
                onAction={() => {
                  setSearch("");
                  setCategory("");
                  setSize("");
                  setColor("");
                  setStock("all");
                  setSort("newest");
                }}
              />
            ) : null}
            {query.data ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {query.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}

            <div className="border-t border-border-muted pt-6">
              <PaginationStub />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 text-left text-[15px] text-slate-600 transition hover:text-slate-950"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center border transition ${
          active ? "border-slate-950 bg-slate-950 text-white" : "border-border-muted bg-white"
        }`}
      >
        {active ? <span className="text-[11px] leading-none">✓</span> : null}
      </span>
      <span>{label}</span>
    </button>
  );
}

function PaginationStub(): React.JSX.Element {
  return (
    <nav className="flex items-center justify-center gap-2">
      <button type="button" className="flex h-12 w-12 items-center justify-center border border-border-muted text-slate-400" disabled>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" className="h-12 w-12 border border-slate-950 bg-slate-950 text-white">1</button>
      <button type="button" className="h-12 w-12 border border-border-muted text-slate-600 hover:border-slate-950 hover:text-slate-950">
        2
      </button>
      <button type="button" className="h-12 w-12 border border-border-muted text-slate-600 hover:border-slate-950 hover:text-slate-950">
        3
      </button>
      <span className="px-2 text-slate-500">...</span>
      <button type="button" className="h-12 w-12 border border-border-muted text-slate-600 hover:border-slate-950 hover:text-slate-950">
        8
      </button>
      <button type="button" className="flex h-12 w-12 items-center justify-center border border-border-muted text-slate-600 hover:border-slate-950 hover:text-slate-950">
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
