"use client";

import type * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { usePaymentsQuery } from "@/features/payments/queries";

export default function AdminPaymentsPage(): React.JSX.Element {
  const query = usePaymentsQuery();

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Payments</p>
          <h1 className="page-title">Simulated payment records</h1>
          <p className="page-description">Track payment state transitions and expiry windows for order simulations.</p>
        </div>
      </div>
      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState message="Gagal memuat payment." onRetry={() => void query.refetch()} /> : null}
      {!query.isLoading && !query.isError && query.data?.length === 0 ? (
        <EmptyState title="No payments" description="Payment records will appear after orders are placed." />
      ) : null}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <Tr>
                <Th>Code</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Expiry</Th>
              </Tr>
            </THead>
            <TBody>
              {query.data?.map((payment) => (
                <Tr key={payment.id}>
                  <Td>{payment.code}</Td>
                  <Td>{formatCurrency(payment.amount)}</Td>
                  <Td>
                    <Badge tone={payment.status === "PAID" ? "success" : payment.status === "FAILED" ? "danger" : "warning"}>
                      {payment.status}
                    </Badge>
                  </Td>
                  <Td>{formatDateTime(payment.expiryAt)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
