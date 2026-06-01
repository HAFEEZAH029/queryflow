import { create } from "zustand";
import type {
  ConditionNode,
  GroupNode,
  QueryLogic,
  QueryNode,
  QueryOperator,
  QueryValue,
} from "@/types/query";
import { schemas } from "@/data/schema";
import { mockData } from "@/data/mock-data";
import { validateQuery } from "@/lib/query-engine/validate-query";
import { executeQuery } from "@/lib/query-engine/execute-query";
import { presets } from "@/data/presets";



const createId = () => crypto.randomUUID();

const INITIAL_ROOT_GROUP_ID = "root-group";
const INITIAL_CONDITION_ID = "initial-condition";

const createCondition = (id = createId()): ConditionNode => ({
  id,
  type: "condition",
  field: "status",
  operator: "equals",
  value: "active",
});

const createGroup = (
  logic: QueryLogic = "AND",
  id = createId(),
): GroupNode => ({
  id,
  type: "group",
  logic,
  collapsed: false,
  children: [],
});

const createInitialRootGroup = (): GroupNode => ({
  ...createGroup("AND", INITIAL_ROOT_GROUP_ID),
  children: [createCondition(INITIAL_CONDITION_ID)],
});

const updateGroup = (
  node: GroupNode,
  groupId: string,
  updater: (group: GroupNode) => GroupNode,
): GroupNode => {
  if (node.id === groupId) return updater(node);

  return {
    ...node,
    children: node.children.map((child) =>
      child.type === "group" ? updateGroup(child, groupId, updater) : child,
    ),
  };
};

const updateCondition = (
  node: GroupNode,
  conditionId: string,
  updater: (condition: ConditionNode) => ConditionNode,
): GroupNode => ({
  ...node,
  children: node.children.map((child) => {
    if (child.type === "condition" && child.id === conditionId) {
      return updater(child);
    }

    if (child.type === "group") {
      return updateCondition(child, conditionId, updater);
    }

    return child;
  }),
});

const removeNodeById = (node: GroupNode, nodeId: string): GroupNode => ({
  ...node,
  children: node.children
    .filter((child) => child.id !== nodeId)
    .map((child) =>
      child.type === "group" ? removeNodeById(child, nodeId) : child,
    ),
});

type QuerySignatureNode =
  | Omit<ConditionNode, "id">
  | (Omit<GroupNode, "id" | "children" | "collapsed"> & {
      children: QuerySignatureNode[];
    });

const createQuerySignature = (schemaId: string, rootGroup: GroupNode) => {
  const normalizeNode = (node: QueryNode): QuerySignatureNode => {
    if (node.type === "condition") {
      return {
        type: node.type,
        field: node.field,
        operator: node.operator,
        value: node.value,
      };
    }

    return {
      type: node.type,
      logic: node.logic,
      children: node.children.map(normalizeNode),
    };
  };

  return JSON.stringify({
    schemaId,
    rootGroup: normalizeNode(rootGroup),
  });
};

export type QueryHistoryItem = {
  id: string;
  schemaId: string;
  rootGroup: GroupNode;
  resultCount: number;
  createdAt: string;
};

const reorderGroupChildren = (
  node: GroupNode,
  groupId: string,
  activeId: string,
  overId: string,
): GroupNode => {
  if (node.id === groupId) {
    const oldIndex = node.children.findIndex((child) => child.id === activeId);
    const newIndex = node.children.findIndex((child) => child.id === overId);

    if (oldIndex === -1 || newIndex === -1) return node;

    const reorderedChildren = [...node.children];
    const [movedItem] = reorderedChildren.splice(oldIndex, 1);

    reorderedChildren.splice(newIndex, 0, movedItem);

    return {
      ...node,
      children: reorderedChildren,
    };
  }

  return {
    ...node,
    children: node.children.map((child) =>
      child.type === "group"
        ? reorderGroupChildren(child, groupId, activeId, overId)
        : child,
    ),
  };
};

type QueryStore = {
  rootGroup: GroupNode;
  selectedSchemaId: string;
  setSelectedSchema: (id: string) => void;
  addCondition: (groupId: string) => void;
  addGroup: (groupId: string) => void;
  removeNode: (nodeId: string) => void;
  updateCondition: (
  conditionId: string,
  updates: Partial<ConditionNode>
  ) => void;
  toggleLogic: (groupId: string) => void;
  executionStatus: "idle" | "loading" | "success" | "empty" | "error";
  results: Record<string, string | number | boolean>[];
  runQuery: () => void;
  toggleCollapsed: (groupId: string) => void;
  setRootGroup: (rootGroup: GroupNode) => void;
  setExecutionStatus: (
    status: "idle" | "loading" | "success" | "empty" | "error",
  ) => void;
  updateConditionField: (conditionId: string, field: string) => void;
  updateConditionOperator: (
    conditionId: string,
    operator: QueryOperator,
  ) => void;
  updateConditionValue: (conditionId: string, value: QueryValue) => void;
  history: QueryHistoryItem[];
  loadPreset: (presetId: string) => void;
  restoreHistoryItem: (historyId: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  reorderChildren: (
  groupId: string,
  activeId: string,
  overId: string,
  ) => void;
};

export const useQueryStore = create<QueryStore>((set) => ({
  rootGroup: createInitialRootGroup(),

  executionStatus: "idle",

  results: [],

  history: [],

  selectedSchemaId: "users",

  theme: "dark",

  toggleTheme: () =>
  set((state) => ({
    theme: state.theme === "dark" ? "light" : "dark",
  })),

  reorderChildren: (groupId, activeId, overId) =>
  set((state) => ({
    rootGroup: reorderGroupChildren(
      state.rootGroup,
      groupId,
      activeId,
      overId,
    ),
  })),

  setSelectedSchema: (id) =>
    set({
      selectedSchemaId: id,
  }),

  addCondition: (groupId) =>
    set((state) => ({
      rootGroup: updateGroup(state.rootGroup, groupId, (group) => ({
        ...group,
        children: [...group.children, createCondition()],
      })),
    })),

  addGroup: (groupId) =>
    set((state) => ({
      rootGroup: updateGroup(state.rootGroup, groupId, (group) => ({
        ...group,
        children: [...group.children, createGroup()],
      })),
    })),

  removeNode: (nodeId) =>
    set((state) => {
      if (state.rootGroup.id === nodeId) {
        return state;
      }

      return {
        rootGroup: removeNodeById(state.rootGroup, nodeId),
      };
    }),

    updateCondition: (conditionId, updates) =>
  set((state) => ({
    rootGroup: updateCondition(
      state.rootGroup,
      conditionId,
      (condition) => ({
        ...condition,
        ...updates,
      }),
    ),
  })),

  toggleLogic: (groupId) =>
    set((state) => ({
      rootGroup: updateGroup(state.rootGroup, groupId, (group) => ({
        ...group,
        logic: group.logic === "AND" ? "OR" : "AND",
      })),
    })),

  runQuery: () => {
  set({ executionStatus: "loading" });

  window.setTimeout(() => {
    set((state) => {
      const activeSchema =
        schemas.find((schema) => schema.id === state.selectedSchemaId) ??
        schemas[0];

      const validationErrors = validateQuery(state.rootGroup, activeSchema);

      if (validationErrors.length > 0) {
        return {
          executionStatus: "error",
          results: [],
        };
      }

      const dataset =
        mockData[state.selectedSchemaId as keyof typeof mockData] ?? [];

      const results = executeQuery(dataset, state.rootGroup);

      const querySignature = createQuerySignature(
        state.selectedSchemaId,
        state.rootGroup,
      );

      const queryExistsInHistory = state.history.some(
        (item) =>
          createQuerySignature(item.schemaId, item.rootGroup) ===
          querySignature,
      );

      const historyItem: QueryHistoryItem = {
        id: createId(),
        schemaId: state.selectedSchemaId,
        rootGroup: structuredClone(state.rootGroup),
        resultCount: results.length,
        createdAt: new Date().toISOString(),
      };

      return {
        executionStatus: results.length > 0 ? "success" : "empty",
        results,
        history: queryExistsInHistory
          ? state.history
          : [historyItem, ...state.history].slice(0, 10),
      };
    });
    }, 500);
   },

    loadPreset: (presetId) =>
    set(() => {
    const preset = presets.find((item) => item.id === presetId);

    if (!preset) return {};

    return {
      selectedSchemaId: preset.schemaId,
      rootGroup: structuredClone(preset.rootGroup),
      executionStatus: "idle",
      results: [],
    };
  }),

restoreHistoryItem: (historyId) =>
  set((state) => {
    const historyItem = state.history.find((item) => item.id === historyId);

    if (!historyItem) return {};

    return {
      selectedSchemaId: historyItem.schemaId,
      rootGroup: structuredClone(historyItem.rootGroup),
      executionStatus: "idle",
      results: [],
    };
  }),

  toggleCollapsed: (groupId) =>
    set((state) => ({
      rootGroup: updateGroup(state.rootGroup, groupId, (group) => ({
        ...group,
        collapsed: !group.collapsed,
      })),
    })),

  setRootGroup: (rootGroup) =>
  set({
    rootGroup,
    executionStatus: "idle",
    results: [],
  }),

setExecutionStatus: (status) =>
  set({
    executionStatus: status,
  }),

  updateConditionField: (conditionId, field) =>
    set((state) => ({
      rootGroup: updateCondition(state.rootGroup, conditionId, (condition) => ({
        ...condition,
        field,
      })),
    })),

  updateConditionOperator: (conditionId, operator) =>
    set((state) => ({
      rootGroup: updateCondition(state.rootGroup, conditionId, (condition) => ({
        ...condition,
        operator,
      })),
    })),

  updateConditionValue: (conditionId, value) =>
    set((state) => ({
      rootGroup: updateCondition(state.rootGroup, conditionId, (condition) => ({
        ...condition,
        value,
      })),
    })),
}));

export type { QueryNode };
