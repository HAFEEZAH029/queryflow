"use client";

import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { GroupNode, QueryNode } from "@/types/query";
import { useQueryStore } from "@/store/query-store";
import QueryCondition from "./QueryCondition";
import { schemas } from "@/data/schema";
import {
  getNodeError,
  validateQuery,
} from "@/lib/query-engine/validate-query";

type QueryGroupProps = {
  group: GroupNode;
  isRoot?: boolean;
  dndPath?: string;
};

type SortableQueryNodeProps = {
  node: QueryNode;
  validationErrors: ReturnType<typeof validateQuery>;
  dndPath: string;
};

function SortableQueryNode({
  node,
  validationErrors,
  dndPath,
}: SortableQueryNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "relative z-10 opacity-60" : "relative"}
    >
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Drag to reorder"
          className="mt-3 shrink-0 cursor-grab touch-none rounded p-1 text-slate-500 transition hover:text-slate-300 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        <div className="min-w-0 flex-1">
          {node.type === "group" ? (
            <QueryGroup group={node} dndPath={dndPath} />
          ) : (
            <QueryCondition
              condition={node}
              error={getNodeError(validationErrors, node.id)?.message}
              hideDragHandle
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function QueryGroup({
  group,
  isRoot = false,
  dndPath = "root",
}: QueryGroupProps) {
  const addCondition = useQueryStore((state) => state.addCondition);
  const addGroup = useQueryStore((state) => state.addGroup);
  const removeNode = useQueryStore((state) => state.removeNode);
  const toggleLogic = useQueryStore((state) => state.toggleLogic);
  const toggleCollapsed = useQueryStore((state) => state.toggleCollapsed);
  const reorderChildren = useQueryStore((state) => state.reorderChildren);
  const rootGroup = useQueryStore((state) => state.rootGroup);
  const selectedSchemaId = useQueryStore((state) => state.selectedSchemaId);

  const activeSchema =
    schemas.find((schema) => schema.id === selectedSchemaId) ?? schemas[0];

  const validationErrors = validateQuery(rootGroup, activeSchema);
  const groupError = getNodeError(validationErrors, group.id);

  const childIds = group.children.map((child) => child.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    reorderChildren(group.id, String(active.id), String(over.id));
  };

  return (
    <div
      className={`rounded-lg border bg-slate-950/60 p-3 ${
        groupError ? "border-rose-500/50" : "border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-slate-500" />

          <button
            type="button"
            onClick={() => toggleCollapsed(group.id)}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label={group.collapsed ? "Expand group" : "Collapse group"}
          >
            {group.collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
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

      {groupError && (
        <p className="mt-3 text-xs text-rose-300">{groupError.message}</p>
      )}

      {!group.collapsed && (
        <div className="mt-3 space-y-2 border-l border-slate-800 pl-3">
          <DndContext
            id={`query-group-${dndPath}`}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={childIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {group.children.map((child, index) => (
                  <SortableQueryNode
                    key={child.id}
                    node={child}
                    validationErrors={validationErrors}
                    dndPath={`${dndPath}-${index}`}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

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
