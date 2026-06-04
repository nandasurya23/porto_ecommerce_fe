import type * as React from "react";
import { WarehouseLayout } from "@/components/layout/warehouse-layout";

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <WarehouseLayout>{children}</WarehouseLayout>;
}
