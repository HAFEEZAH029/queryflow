import type {
  ConditionNode,
  GroupNode,
  QueryNode,
} from "@/types/query";
import { sanitizeValue } from "./sanitize-query";


function generateCondition(
  condition: ConditionNode,
) {
  const {
    field,
    operator,
    value,
  } = condition;

  const safeValue = sanitizeValue(value);

  switch (operator) {
    case "equals":
      return {
        [field]: safeValue,
      };

    case "notEquals":
      return {
        [field]: {
          $ne: safeValue,
        },
      };

    case "greaterThan":
      return {
        [field]: {
          $gt: safeValue,
        },
      };

    case "lessThan":
      return {
        [field]: {
          $lt: safeValue,
        },
      };

    case "contains":
      return {
        [field]: {
          $regex: safeValue,
          $options: "i",
        },
      };

    case "startsWith":
      return {
        [field]: {
          $regex: `^${safeValue}`,
        },
      };

    case "between": {
        const range = Array.isArray(safeValue) ? safeValue : ["", ""];

        return {
            [field]: {
                $gte: range[0],
                $lte: range[1],
            },
        };
    }

    case "inArray":
      return {
        [field]: {
          $in: Array.isArray(safeValue)
            ? safeValue
            : [safeValue],
        },
      };

    default:
      return {
        [field]: safeValue,
      };
  }
}

function generateNode(
  node: QueryNode,
): object {
  if (node.type === "condition") {
    return generateCondition(node);
  }

  const operator =
    node.logic === "AND"
      ? "$and"
      : "$or";

  return {
    [operator]: node.children.map(
      generateNode,
    ),
  };
}

export function generateQuery(
  rootGroup: GroupNode,
) {
  return generateNode(rootGroup);
}
