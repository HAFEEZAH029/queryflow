"use client";

import { useEffect } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import type {
  ConditionNode,
  FieldSchema,
  QueryOperator,
  QueryValue,
} from "@/types/query";
import { useQueryStore } from "@/store/query-store";
import { schemas } from "@/data/schema";
import { OPERATORS_BY_FIELD_TYPE } from "@/lib/query-engine/operators";

import FieldSelector from "./FieldSelector";
import OperatorSelector from "./OperatorSelector";
import ValueInput from "./ValueInput";

type QueryConditionProps = {
  condition: ConditionNode;
};

const EMPTY_OPERATORS: QueryOperator[] = [];

const getDefaultValueForField = (
  field: FieldSchema,
): QueryValue => {
  if (field.type === "enum") {
    return field.options?.[0] ?? "";
  }

  if (field.type === "boolean") {
    return false;
  }

  return "";
};

export default function QueryCondition({
  condition,
}: QueryConditionProps) {
  const removeNode = useQueryStore((state) => state.removeNode);

  const selectedSchemaId = useQueryStore(
    (state) => state.selectedSchemaId,
  );

  const updateCondition = useQueryStore(
    (state) => state.updateCondition,
  );

  const updateConditionValue = useQueryStore(
    (state) => state.updateConditionValue,
  );

  const activeSchema = schemas.find(
    (schema) => schema.id === selectedSchemaId,
  );

  const currentField =
    activeSchema?.fields.find(
      (field) => field.name === condition.field,
    ) ?? activeSchema?.fields[0];

  const availableOperators =
    currentField
      ? OPERATORS_BY_FIELD_TYPE[currentField.type]
      : EMPTY_OPERATORS;

  useEffect(() => {
    if (!currentField) return;

    const fieldBelongsToActiveSchema =
      currentField.name === condition.field;

    const firstOperator =
      OPERATORS_BY_FIELD_TYPE[currentField.type][0];

    if (!fieldBelongsToActiveSchema) {
      updateCondition(
        condition.id,
        {
          field: currentField.name,
          operator: firstOperator,
          value: getDefaultValueForField(currentField),
        },
      );

      return;
    }

    if (!availableOperators.includes(condition.operator)) {
      updateCondition(
        condition.id,
        {
          operator: firstOperator,
          value: getDefaultValueForField(currentField),
        },
      );

      return;
    }

    if (
      currentField.type === "enum" &&
      condition.value === ""
    ) {
      updateConditionValue(
        condition.id,
        getDefaultValueForField(currentField),
      );
    }
  }, [
    availableOperators,
    condition.field,
    condition.id,
    condition.operator,
    condition.value,
    currentField,
    updateCondition,
    updateConditionValue,
  ]);

  if (!activeSchema || !currentField) return null;

  return (
    <div className="flex items-center gap-3 rounded border border-slate-800 bg-slate-900 px-3 py-3 text-sm">
      <GripVertical size={16} className="text-slate-500" />

      <div className="grid flex-1 grid-cols-3 gap-3">
        <FieldSelector
          value={condition.field}
          options={activeSchema.fields}
          onChange={(fieldName) => {
            const field = activeSchema.fields.find(
              (item) => item.name === fieldName,
            );

            if (!field) return;

            const firstOperator =
              OPERATORS_BY_FIELD_TYPE[field.type][0];

            updateCondition(
              condition.id,
              {
                field: field.name,
                operator: firstOperator,
                value: getDefaultValueForField(field),
              },
            );
          }}
        />

        <OperatorSelector
          value={condition.operator}
          operators={availableOperators}
          onChange={(operator) =>
            updateCondition(
              condition.id,
              {
                operator,
              },
            )
          }
        />

        <ValueInput
          fieldType={currentField.type}
          value={condition.value}
          options={currentField.options}
          onChange={(value) =>
            updateConditionValue(
              condition.id,
              value,
            )
          }
        />
      </div>

      <button
        type="button"
        onClick={() => removeNode(condition.id)}
        className="rounded p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
        aria-label="Remove condition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
