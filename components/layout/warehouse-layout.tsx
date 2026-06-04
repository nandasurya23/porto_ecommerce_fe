"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { LogoutButton, StoreFooter, WarehouseSidebar } from "@/components/layout/store-layout";

export function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();

  return (
    <ProtectedLayout allowedRoles={["WAREHOUSE", "SUPER_ADMIN"]} fallbackPath="/forbidden">
      <div className="min-h-screen bg-bg">
        <div className="flex min-h-screen">
          <WarehouseSidebar activePath={pathname} />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="border-b border-white/60 bg-white/75 px-6 py-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">Warehouse operations</p>
                  <p className="text-sm text-fg-muted">Pick, pack, ship, and track fulfillment states.</p>
                </div>
                <LogoutButton />
              </div>
            </header>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
            <StoreFooter />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
