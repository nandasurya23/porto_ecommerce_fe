"use client";

import type * as React from "react";
import { useState } from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { StockBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useInventoryQuery } from "@/features/inventory/queries";
import { useUpdateStockMutation } from "@/features/inventory/mutations";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";

export default function AdminInventoryPage(): React.JSX.Element {
  const query = useInventoryQuery();
  const mutation = useUpdateStockMutation();
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const variants = query.data?.variants;
  const logs = query.data?.logs ?? [];
  const filteredVariants = useMemo(() => {
    const currentVariants = variants ?? [];

    return currentVariants.filter((variant) => {
      const matchesSearch = search
        ? `${variant.productName} ${variant.sku}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "low"
            ? variant.stock > 0 && variant.stock <= 5
            : filter === "out"
              ? variant.stock === 0
              : true;
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, variants]);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Inventory</p>
          <h1 className="page-title">Variant stock control</h1>
          <p className="page-description">Search, inspect, and update variant stock with a compact operational workflow.</p>
        </div>
      </div>
      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat inventory." onRetry={() => void query.refetch()} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Search product or SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All stock levels</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </Select>
      </div>
      {!query.isLoading && !query.isError && filteredVariants.length === 0 ? (
        <EmptyState title="No variants" description="Variants will appear after products are created." />
      ) : null}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <Tr>
                <Th>Product</Th>
                <Th>SKU</Th>
                <Th>Stock</Th>
                <Th>Update</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredVariants.map((variant) => (
                <Tr key={variant.id}>
                  <Td>{variant.productName}</Td>
                  <Td>{variant.sku}</Td>
                  <Td>
                    <StockBadge stock={variant.stock} />
                  </Td>
                  <Td className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-24"
                      value={drafts[variant.id] ?? variant.stock}
                      onChange={(event) =>
                        setDrafts((current) => ({ ...current, [variant.id]: Number(event.target.value) }))
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        mutation.mutate(
                          {
                            variantId: variant.id,
                            previousStock: variant.stock,
                            nextStock: drafts[variant.id] ?? variant.stock,
                            note: "Stock updated from admin inventory page",
                          },
                          {
                            onSuccess: () => toast.success("Stock updated."),
                            onError: (error) => toast.error(error instanceof Error ? error.message : "Gagal update stock."),
                          },
                        )
                      }
                    >
                      Save
                    </Button>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 py-6">
          <h2 className="text-lg font-semibold">Inventory logs</h2>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">{log.productName ?? log.sku}</p>
                <p className="text-fg-muted">
                  {log.movementType} {log.previousStock} → {log.currentStock}
                </p>
                <p className="text-xs text-fg-muted">{formatDateTime(log.createdAt)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
