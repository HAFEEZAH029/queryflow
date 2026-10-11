import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useQueryStore } from "@/store/query-store";
import type { GroupNode } from "@/types/query";

const baseRootGroup: GroupNode = {
  id: "root-group",
  type: "group",
  logic: "AND",
  collapsed: false,
  children: [
    {
      id: "condition-1",
      type: "condition",
      field: "status",
      operator: "equals",
      value: "active",
    },
  ],
};

const resetStore = (rootGroup: GroupNode = baseRootGroup) => {
  useQueryStore.setState({
    rootGroup: structuredClone(rootGroup),
    selectedSchemaId: "users",
    executionStatus: "idle",
    results: [],
    history: [],
    theme: "dark",
  });
};

describe("query store integration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStore();
  });

  it("runs validation, execution, and history updates through runQuery", () => {
    act(() => {
      useQueryStore.getState().runQuery();
    });

    expect(useQueryStore.getState().executionStatus).toBe("loading");

    act(() => {
      vi.runAllTimers();
    });

    const state = useQueryStore.getState();

    expect(state.executionStatus).toBe("success");
    expect(state.results.length).toBeGreaterThan(1);
    expect(state.results.every((result) => result.status === "active")).toBe(true);
    expect(state.results[0]).toMatchObject({
      id: "u001",
      status: "active",
    });
    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toMatchObject({
      schemaId: "users",
      resultCount: state.results.length,
    });
  });

  it("blocks execution when validation fails", () => {
    resetStore({
      id: "root-group",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "condition-1",
          type: "condition",
          field: "missing",
          operator: "equals",
          value: "active",
        },
      ],
    });

    act(() => {
      useQueryStore.getState().runQuery();
      vi.runAllTimers();
    });

    const state = useQueryStore.getState();

    expect(state.executionStatus).toBe("error");
    expect(state.results).toEqual([]);
    expect(state.history).toEqual([]);
  });

  it("loads presets, restores history, and avoids duplicate history entries", () => {
    act(() => {
      useQueryStore.getState().loadPreset("high-value-orders");
    });

    expect(useQueryStore.getState()).toMatchObject({
      selectedSchemaId: "orders",
      executionStatus: "idle",
      results: [],
    });

    act(() => {
      useQueryStore.getState().runQuery();
      vi.runAllTimers();
      useQueryStore.getState().runQuery();
      vi.runAllTimers();
    });

    const historyItem = useQueryStore.getState().history[0];
    const results = useQueryStore.getState().results;

    expect(useQueryStore.getState().history).toHaveLength(1);
    expect(results.length).toBeGreaterThan(1);
    expect(results.every((result) => Number(result.total) > 100)).toBe(true);
    expect(historyItem).toMatchObject({
      schemaId: "orders",
      resultCount: results.length,
    });

    act(() => {
      useQueryStore.getState().setSelectedSchema("users");
      useQueryStore.getState().restoreHistoryItem(historyItem.id);
    });

    expect(useQueryStore.getState()).toMatchObject({
      selectedSchemaId: "orders",
      executionStatus: "idle",
      results: [],
    });
  });

  it("reorders children within nested groups", () => {
    resetStore({
      id: "root-group",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "nested-group",
          type: "group",
          logic: "AND",
          collapsed: false,
          children: [
            {
              id: "condition-1",
              type: "condition",
              field: "status",
              operator: "equals",
              value: "active",
            },
            {
              id: "condition-2",
              type: "condition",
              field: "age",
              operator: "greaterThan",
              value: "25",
            },
          ],
        },
      ],
    });

    act(() => {
      useQueryStore
        .getState()
        .reorderChildren("nested-group", "condition-2", "condition-1");
    });

    const nestedGroup = useQueryStore.getState().rootGroup.children[0];

    expect(nestedGroup).toMatchObject({
      type: "group",
      children: [
        expect.objectContaining({ id: "condition-2" }),
        expect.objectContaining({ id: "condition-1" }),
      ],
    });
  });
});
