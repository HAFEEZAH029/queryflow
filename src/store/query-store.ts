import { create } from "zustand";
import type {
  ConditionNode,
  GroupNode,
  QueryLogic,
  QueryNode,
  QueryOperator,
  QueryValue,
} from "@/types/query";

const createId = () => crypto.randomUUID();

const createCondition = (): ConditionNode => ({
  id: createId(),
  type: "condition",
  field: "status",
  operator: "equals",
  value: "active",
});

const createGroup = (logic: QueryLogic = "AND"): GroupNode => ({
  id: createId(),
  type: "group",
  logic,
  collapsed: false,
  children: [],
});

const createInitialRootGroup = (): GroupNode => ({
  ...createGroup("AND"),
  children: [createCondition()],
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

type QueryStore = {
  rootGroup: GroupNode;
  addCondition: (groupId: string) => void;
  addGroup: (groupId: string) => void;
  removeNode: (nodeId: string) => void;
  toggleLogic: (groupId: string) => void;
  toggleCollapsed: (groupId: string) => void;
  updateConditionField: (conditionId: string, field: string) => void;
  updateConditionOperator: (
    conditionId: string,
    operator: QueryOperator,
  ) => void;
  updateConditionValue: (conditionId: string, value: QueryValue) => void;
};

export const useQueryStore = create<QueryStore>((set) => ({
  rootGroup: createInitialRootGroup(),

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

  toggleLogic: (groupId) =>
    set((state) => ({
      rootGroup: updateGroup(state.rootGroup, groupId, (group) => ({
        ...group,
        logic: group.logic === "AND" ? "OR" : "AND",
      })),
    })),

  toggleCollapsed: (groupId) =>
    set((state) => ({
      rootGroup: updateGroup(state.rootGroup, groupId, (group) => ({
        ...group,
        collapsed: !group.collapsed,
      })),
    })),

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
