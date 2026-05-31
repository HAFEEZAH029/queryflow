import type { ConditionNode, GroupNode, QueryNode } from "@/types/query";

type DataRecord = Record<string, string | number | boolean>;

const normalize = (value: unknown) => String(value).toLowerCase();

const compareNumber = (recordValue: unknown, queryValue: unknown) =>
  Number(recordValue) > Number(queryValue);

const compareLessThan = (recordValue: unknown, queryValue: unknown) =>
  Number(recordValue) < Number(queryValue);

const matchesCondition = (
  record: DataRecord,
  condition: ConditionNode,
): boolean => {
  const recordValue = record[condition.field];
  const queryValue = condition.value;

  switch (condition.operator) {
    case "equals":
      return String(recordValue) === String(queryValue);

    case "notEquals":
      return String(recordValue) !== String(queryValue);

    case "contains":
      return normalize(recordValue).includes(normalize(queryValue));

    case "startsWith":
      return normalize(recordValue).startsWith(normalize(queryValue));

    case "greaterThan":
      return compareNumber(recordValue, queryValue);

    case "lessThan":
      return compareLessThan(recordValue, queryValue);

    case "between": {
      if (!Array.isArray(queryValue)) return false;

      const [min, max] = queryValue;

      if (typeof recordValue === "number") {
        return Number(recordValue) >= Number(min) && Number(recordValue) <= Number(max);
      }

      return String(recordValue) >= String(min) && String(recordValue) <= String(max);
    }

    case "inArray":
      return Array.isArray(queryValue)
        ? queryValue.map(String).includes(String(recordValue))
        : false;

    default:
      return false;
  }
};

const matchesNode = (record: DataRecord, node: QueryNode): boolean => {
  if (node.type === "condition") {
    return matchesCondition(record, node);
  }

  const results = node.children.map((child) => matchesNode(record, child));

  return node.logic === "AND"
    ? results.every(Boolean)
    : results.some(Boolean);
};

export function executeQuery(
  dataset: DataRecord[],
  rootGroup: GroupNode,
): DataRecord[] {
  return dataset.filter((record) => matchesNode(record, rootGroup));
}
