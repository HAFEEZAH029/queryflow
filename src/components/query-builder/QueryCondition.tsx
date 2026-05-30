"use client";

import { GripVertical, Trash2 } from "lucide-react";
import type { ConditionNode } from "@/types/query";
import { useQueryStore } from "@/store/query-store";
import { schemas } from "@/data/schema";
import { OPERATORS_BY_FIELD_TYPE } from "@/lib/query-engine/operators";

import FieldSelector from "./FieldSelector";
import OperatorSelector from "./OperatorSelector";
import ValueInput from "./ValueInput";

type QueryConditionProps = {
  condition: ConditionNode;
};

export default function QueryCondition({
  condition,
}: QueryConditionProps) {
  const removeNode = useQueryStore((state) => state.removeNode);

  const selectedSchemaId = useQueryStore(
    (state) => state.selectedSchemaId,
  );

  const updateConditionField = useQueryStore(
    (state) => state.updateConditionField,
  );

  const updateConditionOperator = useQueryStore(
    (state) => state.updateConditionOperator,
  );

  const updateConditionValue = useQueryStore(
    (state) => state.updateConditionValue,
  );

  const activeSchema = schemas.find(
    (schema) => schema.id === selectedSchemaId,
  );

  if (!activeSchema) return null;

  const currentField =
    activeSchema.fields.find(
      (field) => field.name === condition.field,
    ) ?? activeSchema.fields[0];

  const availableOperators =
    OPERATORS_BY_FIELD_TYPE[currentField.type];

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

            updateConditionField(
              condition.id,
              field.name,
            );

            updateConditionOperator(
              condition.id,
              firstOperator,
            );

            updateConditionValue(
              condition.id,
              "",
            );
          }}
        />

        <OperatorSelector
          value={condition.operator}
          operators={availableOperators}
          onChange={(operator) =>
            updateConditionOperator(
              condition.id,
              operator,
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
