import type {
  GroupNode,
  QueryLogic,
  QueryNode,
  QueryOperator,
} from "@/types/query";

const VALID_LOGIC: QueryLogic[] = ["AND", "OR"];

const VALID_OPERATORS: QueryOperator[] = [
  "equals",
  "notEquals",
  "contains",
  "startsWith",
  "greaterThan",
  "lessThan",
  "inArray",
  "between",
];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValidConditionNode = (node: Record<string, unknown>) =>
  typeof node.id === "string" &&
  node.type === "condition" &&
  typeof node.field === "string" &&
  VALID_OPERATORS.includes(node.operator as QueryOperator) &&
  "value" in node;

const isValidGroupNode = (node: Record<string, unknown>): node is GroupNode =>
  typeof node.id === "string" &&
  node.type === "group" &&
  VALID_LOGIC.includes(node.logic as QueryLogic) &&
  Array.isArray(node.children) &&
  node.children.every(isValidQueryNode);

export const isValidQueryNode = (node: unknown): node is QueryNode => {
  if (!isObject(node)) return false;

  if (node.type === "condition") {
    return isValidConditionNode(node);
  }

  if (node.type === "group") {
    return isValidGroupNode(node);
  }

  return false;
};

export const isValidImportedRootGroup = (
  value: unknown,
): value is GroupNode => isValidQueryNode(value) && value.type === "group";