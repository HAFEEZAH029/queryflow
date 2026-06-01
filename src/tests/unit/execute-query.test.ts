import { describe, expect, it } from "vitest";
import { executeQuery } from "@/lib/query-engine/execute-query";
import type { GroupNode } from "@/types/query";

const dataset = [
  {
    id: "u001",
    name: "Aisha Patel",
    age: 28,
    status: "active",
    createdAt: "2025-01-12",
  },
  {
    id: "u002",
    name: "Marcus Chen",
    age: 34,
    status: "inactive",
    createdAt: "2025-02-03",
  },
  {
    id: "u003",
    name: "Elena Rodriguez",
    age: 22,
    status: "pending",
    createdAt: "2025-02-18",
  },
];

describe("executeQuery", () => {
  it("filters records with AND logic", () => {
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
        {
          id: "condition-2",
          type: "condition",
          field: "age",
          operator: "greaterThan",
          value: "25",
        },
      ],
    };

    expect(executeQuery(dataset, query)).toEqual([dataset[0]]);
  });

  it("filters records with OR logic", () => {
    const query: GroupNode = {
      id: "root",
      type: "group",
      logic: "OR",
      collapsed: false,
      children: [
        {
          id: "condition-1",
          type: "condition",
          field: "status",
          operator: "equals",
          value: "pending",
        },
        {
          id: "condition-2",
          type: "condition",
          field: "name",
          operator: "contains",
          value: "marcus",
        },
      ],
    };

    expect(executeQuery(dataset, query)).toEqual([dataset[1], dataset[2]]);
  });

  it("supports between, startsWith, notEquals, and inArray operators", () => {
    const query: GroupNode = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "condition-1",
          type: "condition",
          field: "age",
          operator: "between",
          value: ["20", "30"],
        },
        {
          id: "condition-2",
          type: "condition",
          field: "name",
          operator: "startsWith",
          value: "ai",
        },
        {
          id: "condition-3",
          type: "condition",
          field: "status",
          operator: "notEquals",
          value: "inactive",
        },
        {
          id: "condition-4",
          type: "condition",
          field: "id",
          operator: "inArray",
          value: ["u001", "u004"],
        },
      ],
    };

    expect(executeQuery(dataset, query)).toEqual([dataset[0]]);
  });
});
