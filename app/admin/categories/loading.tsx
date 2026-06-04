import type * as React from "react";
import { LoadingTablePageSkeleton } from "@/components/ui/loading-skeletons";

export default function Loading(): React.JSX.Element {
  return <LoadingTablePageSkeleton rows={4} />;
}

