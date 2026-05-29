"use client";

import { GripVertical, Trash2 } from "lucide-react";
import type { ConditionNode } from "@/types/query";
import { useQueryStore } from "@/store/query-store";

type QueryConditionProps = {
  condition: ConditionNode;
};

export default function QueryCondition({ condition }: QueryConditionProps) {
  const removeNode = useQueryStore((state) => state.removeNode);

  return (
    <div className="flex items-center gap-3 rounded border border-slate-800 bg-slate-900 px-3 py-3 text-sm">
      <GripVertical size={16} className="text-slate-500" />

      <div className="grid flex-1 grid-cols-3 gap-3">
        <div className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-slate-300">
          {condition.field || "Select field"}
        </div>

        <div className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-slate-300">
          {condition.operator}
        </div>

        <div className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-slate-300">
          {String(condition.value || "Value")}
        </div>
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
