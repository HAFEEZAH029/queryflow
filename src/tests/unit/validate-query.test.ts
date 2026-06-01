import { describe, expect, it } from "vitest";
import {
  getNodeError,
  validateQuery,
} from "@/lib/query-engine/validate-query";
import { schemas } from "@/data/schema";
import type { GroupNode } from "@/types/query";

const usersSchema = schemas.find((schema) => schema.id === "users") ?? schemas[0];

describe("validateQuery", () => {
  it("returns no errors for a valid query", () => {
    const query: GroupNode = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "condition-1",
          type: "condition",
          field: "status",
          operator: "equals",
          value: "active",
        },
      ],
    };

    expect(validateQuery(query, usersSchema)).toEqual([]);
  });

  it("flags empty groups", () => {
    const query: GroupNode = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [],
    };

    expect(validateQuery(query, usersSchema)).toEqual([
      {
        nodeId: "root",
        message: "Empty groups are not allowed",
      },
    ]);
  });

  it("flags invalid fields, incompatible operators, and empty values", () => {
    const query: GroupNode = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "missing-field",
          type: "condition",
          field: "missing",
          operator: "equals",
          value: "active",
        },
        {
          id: "bad-operator",
          type: "condition",
          field: "age",
          operator: "contains",
          value: "30",
        },
        {
          id: "empty-value",
          type: "condition",
          field: "name",
          operator: "equals",
          value: " ",
        },
      ],
    };

    const errors = validateQuery(query, usersSchema);

    expect(getNodeError(errors, "missing-field")?.message).toBe(
      "Field does not exist in the active schema",
    );
    expect(getNodeError(errors, "bad-operator")?.message).toBe(
      "Operator is not compatible with this field type",
    );
    expect(getNodeError(errors, "empty-value")?.message).toBe(
      "Value is required",
    );
  });

  it("requires both range values for between queries", () => {
    const query: GroupNode = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "range",
          type: "condition",
          field: "age",
          operator: "between",
          value: ["18", ""],
        },
      ],
    };

    expect(validateQuery(query, usersSchema)).toEqual([
      {
        nodeId: "range",
        message: "Both range values are required",
      },
    ]);
  });
});
