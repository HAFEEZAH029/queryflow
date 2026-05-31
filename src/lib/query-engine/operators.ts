import type { FieldType, QueryOperator } from "@/types/query";

export const OPERATORS_BY_FIELD_TYPE: Record<
  FieldType,
  QueryOperator[]
> = {
  string: [
    "equals",
    "notEquals",
    "contains",
    "startsWith",
  ],

  number: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "between",
  ],

  enum: [
    "equals",
    "notEquals",
    "inArray",
  ],

  date: [
    "equals",
    "greaterThan",
    "lessThan",
    "between",
  ],

  boolean: [
    "equals",
    "notEquals",
  ],
};