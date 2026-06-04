import type { Metadata } from "next";
import type * as React from "react";
import { Providers } from "@/app/providers";
import "@/styles/globals.css";
import { appName } from "@/constants/theme";

export const metadata: Metadata = {
  title: appName,
  description: "Footwear commerce storefront, admin, and warehouse operations platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
