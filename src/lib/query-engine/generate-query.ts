import type {
  ConditionNode,
  GroupNode,
  QueryNode,
} from "@/types/query";

function generateCondition(
  condition: ConditionNode,
) {
  const {
    field,
    operator,
    value,
  } = condition;

  switch (operator) {
    case "equals":
      return {
        [field]: value,
      };

    case "notEquals":
      return {
        [field]: {
          $ne: value,
        },
      };

    case "greaterThan":
      return {
        [field]: {
          $gt: value,
        },
      };

    case "lessThan":
      return {
        [field]: {
          $lt: value,
        },
      };

    case "contains":
      return {
        [field]: {
          $regex: value,
          $options: "i",
        },
      };

    case "startsWith":
      return {
        [field]: {
          $regex: `^${value}`,
        },
      };

    case "between": {
        const range = Array.isArray(value) ? value : ["", ""];

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
          $in: Array.isArray(value)
            ? value
            : [value],
        },
      };

    default:
      return {
        [field]: value,
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
