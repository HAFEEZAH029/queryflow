"use client";

import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import type { GroupNode } from "@/types/query";
import { useQueryStore } from "@/store/query-store";
import QueryCondition from "./QueryCondition";

type QueryGroupProps = {
  group: GroupNode;
  isRoot?: boolean;
};

export default function QueryGroup({ group, isRoot = false }: QueryGroupProps) {
  const addCondition = useQueryStore((state) => state.addCondition);
  const addGroup = useQueryStore((state) => state.addGroup);
  const removeNode = useQueryStore((state) => state.removeNode);
  const toggleLogic = useQueryStore((state) => state.toggleLogic);
  const toggleCollapsed = useQueryStore((state) => state.toggleCollapsed);

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-slate-500" />

          <button
            type="button"
            onClick={() => toggleCollapsed(group.id)}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label={group.collapsed ? "Expand group" : "Collapse group"}
          >
            {group.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>

          <button
            type="button"
            onClick={() => toggleLogic(group.id)}
            className="rounded bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300"
          >
            {group.logic}
          </button>

          <span className="text-xs text-slate-500">
            {isRoot ? "Root group" : "Nested group"}
          </span>
        </div>

        {!isRoot && (
          <button
            type="button"
            onClick={() => removeNode(group.id)}
            className="rounded p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
            aria-label="Remove group"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {!group.collapsed && (
        <div className="mt-4 space-y-3 border-l border-slate-800 pl-4">
          {group.children.map((child) =>
            child.type === "group" ? (
              <QueryGroup key={child.id} group={child} />
            ) : (
              <QueryCondition key={child.id} condition={child} />
            ),
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => addCondition(group.id)}
              className="flex items-center gap-2 rounded border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-emerald-400 hover:text-emerald-300"
            >
              <Plus size={15} />
              Add Condition
            </button>

            <button
              type="button"
              onClick={() => addGroup(group.id)}
              className="flex items-center gap-2 rounded border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
            >
              <Plus size={15} />
              Add Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
