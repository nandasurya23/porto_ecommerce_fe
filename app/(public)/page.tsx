"use client";

import type * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useFeaturedProductsQuery } from "@/features/products/queries";
import { LoadingGridSkeleton } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { formatCurrency } from "@/lib/format";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import type { Product } from "@/types/product";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=2400&q=80";

export default function HomePage(): React.JSX.Element {
  const { data, isLoading, isError, refetch } = useFeaturedProductsQuery();
  const newArrivals = data?.slice(0, 4) ?? [];
  const menProduct = data?.[1] ?? data?.[0];
  const womenProduct = data?.[2] ?? data?.[0];

  return (
    <div className="space-y-0">
      <section className="relative min-h-[620px] w-full overflow-hidden border-b border-border bg-[#f5b33e] sm:min-h-[680px] lg:min-h-[819px]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="White sneaker on a studio pedestal"
            fill
            unoptimized
            className="object-cover object-[70%_32%] saturate-[1.1] contrast-[1.05]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f2b13b]/92 via-[#f0b441]/66 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_54%,rgba(255,231,169,0.34)_0%,rgba(255,186,66,0.32)_46%,rgba(181,106,0,0.25)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#c17d1a]/28" />
        </div>

        <div className="container-shell relative z-10 flex min-h-[620px] items-end py-12 sm:min-h-[680px] sm:items-center sm:py-16 lg:min-h-[819px]">
          <div className="max-w-[610px] pb-2 pt-20 sm:pb-0 sm:pt-14">
            <p className="mb-4 w-fit border-b-2 border-orange-600 pb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-700 sm:text-[11px] sm:tracking-[0.26em]">
              Summer Collection 2026
            </p>
            <h1 className="max-w-[560px] text-[clamp(2.9rem,12vw,7rem)] font-black leading-[0.86] tracking-[-0.09em] text-slate-950 lg:max-w-[620px] lg:text-[clamp(3.5rem,6vw,7rem)] lg:leading-[0.82] lg:tracking-[-0.108em]">
              Engineered for
              <br />
              Precision.
              <br />
              Styled for
              <br />
              Motion.
            </h1>
            <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-slate-700 sm:mt-8 sm:text-[17px] sm:leading-8">
              Discover our latest arrival of high-performance footwear, blending a clean editorial storefront with uncompromising urban aesthetics.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-none bg-orange-600 px-6 text-[13px] font-bold uppercase tracking-wide text-white transition hover:bg-orange-700 sm:h-14 sm:px-10 sm:text-[15px]"
              >
                Shop Collection
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-none bg-slate-950 px-6 text-[13px] font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 sm:h-14 sm:px-10 sm:text-[15px]"
              >
                View Lookbook
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Spacer />

      <section id="new-arrivals" className="container-shell">
        <SectionHeader title="New Arrivals" subtitle="Latest operational drops." actionLabel="View All" actionHref="/products" />
        <div className="mt-5">
          {isLoading ? <LoadingGridSkeleton items={4} /> : null}
          {isError ? <ErrorState message="Gagal mengambil produk unggulan." onRetry={() => void refetch()} /> : null}
          {data ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {newArrivals.map((product) => (
                <ArrivalCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <Spacer />

      <section id="collections" className="container-shell">
        <div className="mb-5 border-b border-border pb-4">
          <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2rem]">Shop by Category</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:h-[600px]">
          <CategoryTile
            id="men"
            image={menProduct?.images[0]}
            title="Performance Series"
            subtitle="Explore men's"
            alt={menProduct?.name ?? "Men footwear"}
            dark
          />
          <CategoryTile
            id="women"
            image={womenProduct?.images[0]}
            title="Urban Minimal"
            subtitle="Explore women's"
            alt={womenProduct?.name ?? "Women footwear"}
          />
        </div>
      </section>

      <Spacer />

      <section className="border-y border-border bg-[#f1f3f5] py-16">
        <div className="container-shell">
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2rem]">Why Kinetic Ops</h2>
            <p className="mt-2 text-sm text-slate-500">Operational excellence engineered into every step of our process.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            <ValueProp
              icon={<Truck className="h-8 w-8" />}
              title="Fast Shipping Logistics"
              description="Global fulfillment centers ensure your gear arrives when you need it, without delay."
            />
            <ValueProp
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Premium Quality Control"
              description="Every unit undergoes rigorous inspection to meet our uncompromising standards."
            />
            <ValueProp
              icon={<Sparkles className="h-8 w-8" />}
              title="Tech-Driven Design"
              description="Utilizing advanced materials and data-driven biomechanics for superior performance."
            />
          </div>
        </div>
      </section>

      <Spacer />
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 border-b border-border-muted pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div>
        <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2rem]">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="inline-flex items-center gap-1 text-sm font-medium text-slate-950 transition hover:text-orange-600 sm:self-end">
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

function ArrivalCard({ product }: { product: Product }): React.JSX.Element {
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  const badgeLabel = totalStock <= 5 ? "LOW STOCK" : "NEW";

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <article>
        <div className="relative mb-3 aspect-[4/5] overflow-hidden bg-slate-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              unoptimized
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
              Product
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-slate-950 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white transition duration-300 group-hover:translate-y-0">
            Quick Add
          </div>
          <div className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100">
            <WishlistButton product={product} />
          </div>
          <span
            className={`absolute left-4 top-4 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
              totalStock <= 5 ? "bg-orange-600 text-white" : "bg-white text-slate-950"
            }`}
          >
            {badgeLabel}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium text-slate-950 transition group-hover:text-orange-600">{product.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{product.category}</p>
          </div>
          <span className="text-sm font-medium text-slate-950">{formatCurrency(product.basePrice)}</span>
        </div>
      </article>
    </Link>
  );
}

function CategoryTile({
  id,
  image,
  title,
  subtitle,
  alt,
  dark,
}: {
  id: string;
  image?: string;
  title: string;
  subtitle: string;
  alt: string;
  dark?: boolean;
}): React.JSX.Element {
  return (
    <Link href="/products" className="group block">
      <article id={id} className={`relative overflow-hidden border border-border ${dark ? "bg-slate-950" : "bg-slate-100"}`}>
        <div className="relative aspect-[1.18] h-[400px] md:h-full">
          {image ? (
            <Image
              src={image}
              alt={alt}
              fill
              unoptimized
              className={`object-cover transition duration-700 group-hover:scale-105 ${dark ? "opacity-80" : ""}`}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center ${dark ? "bg-slate-800" : "bg-slate-200"}`}>
              <span className={`text-xs font-bold uppercase tracking-[0.18em] ${dark ? "text-white/70" : "text-slate-700"}`}>Category</span>
            </div>
          )}
          <div className={`absolute inset-0 ${dark ? "bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" : "bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"}`} />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
            <h3 className="text-[1.6rem] font-semibold tracking-[-0.05em] sm:text-[2rem]">{title}</h3>
            <p className="mt-2 inline-flex items-center gap-1 border-b border-white pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.2em]">
              {subtitle}
              <ArrowRight className="h-3.5 w-3.5" />
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ValueProp({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-none bg-slate-950 text-white sm:mb-6 sm:h-16 sm:w-16">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-medium text-slate-950 sm:mb-3 sm:text-xl">{title}</h3>
      <p className="max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function Spacer(): React.JSX.Element {
  return <div className="h-12 sm:h-16" />;
}
