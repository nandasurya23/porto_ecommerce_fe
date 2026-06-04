"use client";

import type * as React from "react";
import { Toaster } from "sonner";

export function ToastProvider(): React.JSX.Element {
  return <Toaster position="top-right" richColors closeButton />;
}
