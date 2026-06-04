import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/features/auth/schemas";

describe("auth schemas", () => {
  it("rejects invalid login payload", () => {
    const result = loginSchema.safeParse({ email: "invalid", password: "123" });
    expect(result.success).toBe(false);
  });

  it("accepts valid register payload", () => {
    const result = registerSchema.safeParse({
      name: "Alya",
      email: "alya@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });
});
