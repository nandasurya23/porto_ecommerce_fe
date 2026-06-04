"use client";

import { Card, CardContent } from "@/components/ui/card";

export function LoadingState({ label = "Memuat data..." }: { label?: string }): React.JSX.Element {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-8 text-sm text-fg-muted">
        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-400" />
        {label}
      </CardContent>
    </Card>
  );
}
