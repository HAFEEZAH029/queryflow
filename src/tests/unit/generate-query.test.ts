import { describe, expect, it } from "vitest";
import { generateQuery } from "@/lib/query-engine/generate-query";
import type { GroupNode } from "@/types/query";

describe("generateQuery", () => {
  it("generates Mongo-style queries for AND groups", () => {
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
          value: "30",
        },
      ],
    };

    expect(generateQuery(query)).toEqual({
      $and: [
        { status: "active" },
        { age: { $gt: "30" } },
      ],
    });
  });

  it("sanitizes values while generating query output", () => {
    const query: GroupNode = {
      id: "root",
      type: "group",
      logic: "OR",
      collapsed: false,
      children: [
        {
          id: "condition-1",
          type: "condition",
          field: "name",
          operator: "contains",
          value: " <Ann> ",
        },
      ],
    };

    expect(generateQuery(query)).toEqual({
      $or: [
        {
          name: {
            $regex: "Ann",
            $options: "i",
          },
        },
      ],
    });
  });

  it("generates range and array operators", () => {
    const query: GroupNode = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "condition-1",
          type: "condition",
          field: "price",
          operator: "between",
          value: ["35", "80"],
        },
        {
          id: "condition-2",
          type: "condition",
          field: "status",
          operator: "inArray",
          value: ["active", "pending"],
        },
      ],
    };

    expect(generateQuery(query)).toEqual({
      $and: [
        { price: { $gte: "35", $lte: "80" } },
        { status: { $in: ["active", "pending"] } },
      ],
    });
  });
});
