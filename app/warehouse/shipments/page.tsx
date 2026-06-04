"use client";

import type * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { ShipmentStatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useShipmentsQuery } from "@/features/shipments/queries";
import { formatDateTime } from "@/lib/format";

export default function WarehouseShipmentsPage(): React.JSX.Element {
  const query = useShipmentsQuery();

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Shipments</p>
          <h1 className="page-title">Shipment monitor</h1>
          <p className="page-description">Monitor shipment progress and tracking numbers in a compact table.</p>
        </div>
      </div>
      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat shipment." onRetry={() => void query.refetch()} /> : null}
      {!query.isLoading && !query.isError && query.data?.length === 0 ? (
        <EmptyState title="No shipments" description="Shipment records will appear after warehouse processing." />
      ) : null}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <Tr>
                <Th>Courier</Th>
                <Th>Tracking</Th>
                <Th>Status</Th>
                <Th>Created</Th>
              </Tr>
            </THead>
            <TBody>
              {query.data?.map((shipment) => (
                <Tr key={shipment.id}>
                  <Td>{shipment.courier}</Td>
                  <Td>{shipment.trackingNumber}</Td>
                  <Td>
                    <ShipmentStatusBadge status={shipment.status} />
                  </Td>
                  <Td>{formatDateTime(shipment.createdAt)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
