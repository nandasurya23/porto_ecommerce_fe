import type * as React from "react";
import { StoreLayout } from "@/components/layout/store-layout";

export default function PublicLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <StoreLayout>{children}</StoreLayout>;
}
