"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { bootstrapSession } from "@/features/auth/mutations";

export function Providers({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  React.useEffect(() => {
    void bootstrapSession().catch(() => {
      // Session bootstrap failure falls back to logged-out state.
    });
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ToastProvider />
    </QueryClientProvider>
  );
}
