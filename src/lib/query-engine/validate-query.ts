import type {
  ConditionNode,
  DataSourceSchema,
  GroupNode,
  QueryNode,
} from "@/types/query";
import { OPERATORS_BY_FIELD_TYPE } from "./operators";

export type ValidationError = {
  nodeId: string;
  message: string;
};

const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

const validateCondition = (
  condition: ConditionNode,
  schema: DataSourceSchema,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const field = schema.fields.find(
    (schemaField) => schemaField.name === condition.field,
  );

  if (!field) {
    errors.push({
      nodeId: condition.id,
      message: "Field does not exist in the active schema",
    });

    return errors;
  }

  const allowedOperators = OPERATORS_BY_FIELD_TYPE[field.type];

  if (!allowedOperators.includes(condition.operator)) {
    errors.push({
      nodeId: condition.id,
      message: "Operator is not compatible with this field type",
    });
  }

  if (condition.operator === "between") {
    if (!Array.isArray(condition.value) || condition.value.length !== 2) {
      errors.push({
        nodeId: condition.id,
        message: "Both range values are required",
      });

      return errors;
    }

    const [start, end] = condition.value;

    if (isEmptyValue(start) || isEmptyValue(end)) {
      errors.push({
        nodeId: condition.id,
        message: "Both range values are required",
      });
    }

    return errors;
  }

  if (isEmptyValue(condition.value)) {
    errors.push({
      nodeId: condition.id,
      message: "Value is required",
    });
  }

  return errors;
};

const validateGroup = (
  group: GroupNode,
  schema: DataSourceSchema,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (group.children.length === 0) {
    errors.push({
      nodeId: group.id,
      message: "Empty groups are not allowed",
    });
  }

  group.children.forEach((child: QueryNode) => {
    if (child.type === "group") {
      errors.push(...validateGroup(child, schema));
    } else {
      errors.push(...validateCondition(child, schema));
    }
  });

  return errors;
};

export function validateQuery(
  rootGroup: GroupNode,
  schema: DataSourceSchema,
): ValidationError[] {
  return validateGroup(rootGroup, schema);
}

export function getNodeError(
  errors: ValidationError[],
  nodeId: string,
) {
  return errors.find((error) => error.nodeId === nodeId);
}
