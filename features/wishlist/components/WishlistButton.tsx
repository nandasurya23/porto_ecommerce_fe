"use client";

import type * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { Product } from "@/types/product";

type WishlistButtonProps = {
  product: Product;
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
  onToggle?: () => void;
};

export function WishlistButton({
  product,
  className,
  compact = true,
  showLabel = false,
  onToggle,
}: WishlistButtonProps): React.JSX.Element {
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));
  const toggle = useWishlistStore((state) => state.toggle);

  return (
    <button
      type="button"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isWishlisted}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(product);
        onToggle?.();
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition",
        compact
          ? "h-9 w-9 rounded-full border border-border-muted bg-white/90 text-slate-500 backdrop-blur-sm hover:border-slate-950 hover:text-slate-950"
          : "h-12 min-w-12 rounded-none border border-slate-950 px-4 text-[15px] font-semibold tracking-normal text-slate-950 hover:bg-slate-950 hover:text-white",
        isWishlisted && compact ? "border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:text-rose-700" : "",
        isWishlisted && !compact ? "bg-slate-950 text-white" : "",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", isWishlisted ? "fill-current" : "")} />
      {showLabel ? <span>{isWishlisted ? "Saved" : "Wishlist"}</span> : null}
    </button>
  );
}
