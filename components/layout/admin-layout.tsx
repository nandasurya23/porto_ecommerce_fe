"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar, LogoutButton, StoreFooter } from "@/components/layout/store-layout";
import { ProtectedLayout } from "@/components/layout/protected-layout";

export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();

  return (
    <ProtectedLayout allowedRoles={["ADMIN", "SUPER_ADMIN"]} fallbackPath="/forbidden">
      <div className="min-h-screen bg-bg">
        <div className="flex min-h-screen">
          <AdminSidebar activePath={pathname} />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="border-b border-white/60 bg-white/75 px-6 py-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">Admin operations</p>
                  <p className="text-sm text-fg-muted">Products, inventory, orders, payments, and reports.</p>
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
