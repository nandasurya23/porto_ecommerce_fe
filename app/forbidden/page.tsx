import type * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForbiddenPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Akses ditolak</CardTitle>
          <CardDescription>Role Anda tidak memiliki izin untuk membuka halaman ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button>Kembali</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
