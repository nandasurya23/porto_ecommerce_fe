import type * as React from "react";
import { AdminLayout } from "@/components/layout/admin-layout";

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <AdminLayout>{children}</AdminLayout>;
}
