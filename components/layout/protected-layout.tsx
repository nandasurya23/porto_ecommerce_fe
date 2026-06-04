"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingState } from "@/components/ui/loading-state";

type ProtectedLayoutProps = {
  allowedRoles: Array<"CUSTOMER" | "ADMIN" | "WAREHOUSE" | "SUPER_ADMIN">;
  children: React.ReactNode;
  fallbackPath: string;
};

export function ProtectedLayout({ allowedRoles, children, fallbackPath }: ProtectedLayoutProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, hydrated } = useAuthStore();

  React.useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(fallbackPath);
    }
  }, [allowedRoles, fallbackPath, hydrated, router, user]);

  if (!hydrated) {
    return <LoadingState label="Menyiapkan sesi..." />;
  }

  if (!user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
