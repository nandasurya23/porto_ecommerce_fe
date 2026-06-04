"use client";

import type * as React from "react";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { StoreLayout } from "@/components/layout/store-layout";

export default function CustomerLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <ProtectedLayout allowedRoles={["CUSTOMER", "ADMIN", "WAREHOUSE", "SUPER_ADMIN"]} fallbackPath="/">
      <StoreLayout>{children}</StoreLayout>
    </ProtectedLayout>
  );
}
