"use client";

import type * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useAdminCategoriesQuery } from "@/features/products/queries";

export default function CategoriesPage(): React.JSX.Element {
  const query = useAdminCategoriesQuery();

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Categories</p>
          <h1 className="page-title">Category management</h1>
          <p className="page-description">View backend categories that drive product grouping in the catalog.</p>
        </div>
      </div>

      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat kategori." onRetry={() => void query.refetch()} /> : null}
      {!query.isLoading && !query.isError && query.data?.length === 0 ? (
        <EmptyState title="No categories" description="Create categories from the backend admin flow." />
      ) : null}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <Tr>
                <Th>Name</Th>
                <Th>Slug</Th>
                <Th>Status</Th>
              </Tr>
            </THead>
            <TBody>
              {query.data?.map((category) => (
                <Tr key={category.id}>
                  <Td>{category.name}</Td>
                  <Td>{category.slug}</Td>
                  <Td>
                    <Badge tone={category.isActive ? "success" : "default"}>{category.isActive ? "ACTIVE" : "INACTIVE"}</Badge>
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
