"use client";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps): React.JSX.Element {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-3 py-10">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-prose">{description}</CardDescription>
        {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
      </CardContent>
    </Card>
  );
}
