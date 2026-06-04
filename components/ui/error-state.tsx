"use client";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = "Terjadi kesalahan", message, onRetry }: ErrorStateProps): React.JSX.Element {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-10">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
        {onRetry ? (
          <div>
            <Button variant="secondary" onClick={onRetry}>
              Coba lagi
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
