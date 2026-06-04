"use client";

import type * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { StockBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useAdminProductsQuery } from "@/features/products/queries";
import { formatCurrency } from "@/lib/format";

export default function AdminProductsPage(): React.JSX.Element {
  const query = useAdminProductsQuery();

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Products</p>
          <h1 className="page-title">Catalog management</h1>
          <p className="page-description">Manage catalog items, status, pricing, and variant stock.</p>
        </div>
        <Link href="/admin/products/create">
          <Button>Create product</Button>
        </Link>
      </div>

      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat produk." onRetry={() => void query.refetch()} /> : null}
      {!query.isLoading && !query.isError && query.data?.length === 0 ? (
        <EmptyState title="No products" description="Create the first product to populate catalog." />
      ) : null}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <Tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Stock</Th>
                <Th />
              </Tr>
            </THead>
            <TBody>
              {query.data?.map((product) => (
                <Tr key={product.id}>
                  <Td>{product.name}</Td>
                  <Td>{product.category}</Td>
                  <Td>{formatCurrency(product.basePrice)}</Td>
                  <Td>{product.status}</Td>
                  <Td>
                    <StockBadge stock={product.variants.reduce((sum, variant) => sum + variant.stock, 0)} />
                  </Td>
                  <Td>
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
