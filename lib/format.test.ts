import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "@/lib/format";

describe("format helpers", () => {
  it("formats currency in IDR", () => {
    expect(formatCurrency(1500000)).toContain("1.500.000");
  });

  it("formats date string", () => {
    expect(formatDate("2025-01-01")).toContain("2025");
  });
});
