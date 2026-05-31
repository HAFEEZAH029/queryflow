export const OPERATOR_MAP = {
  equals: null,
  notEquals: "$ne",
  contains: "$regex",
  startsWith: "$regex",
  greaterThan: "$gt",
  lessThan: "$lt",
  between: "$between",
  inArray: "$in",
} as const;