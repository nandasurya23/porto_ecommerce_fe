"use client";

import type * as React from "react";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StockBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import type { Product, ProductVariant } from "@/types/product";

type VariantSelectorProps = {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  onColorChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onAddToCart: (variant: ProductVariant) => void;
};

export function VariantSelector({
  product,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  onAddToCart,
}: VariantSelectorProps): React.JSX.Element {
  const colors = [...new Set(product.variants.map((variant) => variant.color))];
  const availableVariants = product.variants.filter((variant) =>
    selectedColor ? variant.color === selectedColor : true,
  );
  const selectedVariant =
    product.variants.find(
      (variant) => variant.color === selectedColor && variant.size === selectedSize,
    ) ?? null;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Color</label>
          <Select value={selectedColor} onChange={(event) => onColorChange(event.target.value)}>
            <option value="">Select color</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Size</label>
          <Select value={selectedSize} onChange={(event) => onSizeChange(event.target.value)}>
            <option value="">Select size</option>
            {availableVariants.map((variant) => (
              <option key={variant.id} value={variant.size} disabled={variant.stock === 0}>
                {variant.size}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {selectedVariant ? (
          <>
            <Badge tone="accent">{formatCurrency(selectedVariant.price)}</Badge>
            <StockBadge stock={selectedVariant.stock} />
          </>
        ) : (
          <Badge tone="default">Select color and size</Badge>
        )}
      </div>
      <Button
        className="w-full"
        disabled={!selectedVariant || selectedVariant.stock === 0}
        onClick={() => selectedVariant && onAddToCart(selectedVariant)}
      >
        Add to cart
      </Button>
    </div>
  );
}
