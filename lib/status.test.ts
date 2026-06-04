import { describe, expect, it } from "vitest";
import { getOrderStatusTone, getShipmentStatusTone, getStockTone } from "@/lib/status";

describe("status helpers", () => {
  it("maps order status tone", () => {
    expect(getOrderStatusTone("PENDING_PAYMENT")).toBe("warning");
    expect(getOrderStatusTone("DELIVERED")).toBe("success");
  });

  it("maps shipment status tone", () => {
    expect(getShipmentStatusTone("WAITING_FOR_PICKUP")).toBe("warning");
    expect(getShipmentStatusTone("DELIVERED")).toBe("success");
  });

  it("maps stock tone", () => {
    expect(getStockTone(0)).toBe("danger");
    expect(getStockTone(3)).toBe("warning");
    expect(getStockTone(10)).toBe("success");
  });
});
