import type * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Halaman tidak ditemukan</CardTitle>
          <CardDescription>Silakan kembali ke beranda atau buka katalog produk.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Link href="/">
            <Button>Beranda</Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary">Products</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
