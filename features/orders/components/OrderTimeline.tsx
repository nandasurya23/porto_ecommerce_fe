"use client";

import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/order";

const steps: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

export function OrderTimeline({ status }: { status: OrderStatus }): React.JSX.Element {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => (
        <Badge
          key={step}
          tone={index <= currentIndex ? "accent" : "default"}
          className={index === currentIndex ? "ring-2 ring-blue-200" : ""}
        >
          {step.replaceAll("_", " ")}
        </Badge>
      ))}
    </div>
  );
}
