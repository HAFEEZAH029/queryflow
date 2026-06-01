import { describe, expect, it } from "vitest";
import { sanitizeValue } from "@/lib/query-engine/sanitize-query";

describe("sanitizeValue", () => {
  it("trims strings and removes angle brackets", () => {
    expect(sanitizeValue("  <active>  ")).toBe("active");
  });

  it("sanitizes array values recursively", () => {
    expect(sanitizeValue([" <active>", "<pending> "])).toEqual([
      "active",
      "pending",
    ]);
  });

  it("leaves non-string scalar values unchanged", () => {
    expect(sanitizeValue(42)).toBe(42);
    expect(sanitizeValue(true)).toBe(true);
    expect(sanitizeValue(null)).toBeNull();
  });
});
