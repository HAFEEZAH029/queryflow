import { describe, expect, it } from "vitest";
import {
  isValidImportedRootGroup,
  isValidQueryNode,
} from "@/lib/query-engine/validate-import";

describe("validate-import", () => {
  it("accepts a valid imported root group", () => {
    expect(
      isValidImportedRootGroup({
        id: "root",
        type: "group",
        logic: "AND",
        children: [
          {
            id: "condition-1",
            type: "condition",
            field: "status",
            operator: "equals",
            value: "active",
          },
        ],
      }),
    ).toBe(true);
  });

  it("rejects invalid operators and group logic", () => {
    expect(
      isValidQueryNode({
        id: "condition-1",
        type: "condition",
        field: "status",
        operator: "unknown",
        value: "active",
      }),
    ).toBe(false);

    expect(
      isValidImportedRootGroup({
        id: "root",
        type: "group",
        logic: "XOR",
        children: [],
      }),
    ).toBe(false);
  });

  it("rejects non-group imported roots", () => {
    expect(
      isValidImportedRootGroup({
        id: "condition-1",
        type: "condition",
        field: "status",
        operator: "equals",
        value: "active",
      }),
    ).toBe(false);
  });
});
