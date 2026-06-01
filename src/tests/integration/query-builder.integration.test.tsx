import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import QueryBuilder from "@/components/query-builder/QueryBuilder";
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
  act(() => {
    useQueryStore.setState({
      rootGroup: structuredClone(rootGroup),
      selectedSchemaId: "users",
      executionStatus: "idle",
      results: [],
      history: [],
      theme: "dark",
    });
  });
};

describe("QueryBuilder integration", () => {
  beforeEach(() => {
    resetStore();
  });

  it("renders recursive groups and conditions from store state", () => {
    resetStore({
      id: "root-group",
      type: "group",
      logic: "OR",
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
          id: "nested-group",
          type: "group",
          logic: "AND",
          collapsed: false,
          children: [
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

    render(<QueryBuilder />);

    expect(screen.getByText("Root group")).toBeInTheDocument();
    expect(screen.getByText("Nested group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OR" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AND" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Add Condition" })).toHaveLength(2);
  });

  it("updates condition fields through the rendered controls", () => {
    render(<QueryBuilder />);

    const [fieldSelect, operatorSelect, valueSelect] = screen.getAllByRole(
      "combobox",
    ) as HTMLSelectElement[];

    expect(fieldSelect.value).toBe("status");
    expect(operatorSelect.value).toBe("equals");
    expect(valueSelect.value).toBe("active");

    fireEvent.change(fieldSelect, {
      target: { value: "age" },
    });

    const condition = useQueryStore.getState().rootGroup.children[0];

    expect(condition).toMatchObject({
      type: "condition",
      field: "age",
      operator: "equals",
      value: "",
    });
  });

  it("adds conditions and groups from UI actions", () => {
    render(<QueryBuilder />);

    fireEvent.click(screen.getByRole("button", { name: "Add Condition" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Group" }));

    const rootGroup = useQueryStore.getState().rootGroup;

    expect(rootGroup.children).toHaveLength(3);
    expect(rootGroup.children[0]?.type).toBe("condition");
    expect(rootGroup.children[1]?.type).toBe("condition");
    expect(rootGroup.children[2]?.type).toBe("group");
    expect(screen.getByText("Nested group")).toBeInTheDocument();
  });

  it("collapses and expands nested groups without losing their children", () => {
    resetStore({
      id: "root-group",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "nested-group",
          type: "group",
          logic: "OR",
          collapsed: false,
          children: [
            {
              id: "condition-1",
              type: "condition",
              field: "name",
              operator: "contains",
              value: "aisha",
            },
          ],
        },
      ],
    });

    render(<QueryBuilder />);

    const nestedGroupLabel = screen.getByText("Nested group");
    const nestedGroup = nestedGroupLabel.closest(".rounded-lg");

    expect(nestedGroup).not.toBeNull();

    const collapseButton = within(nestedGroup as HTMLElement).getByRole(
      "button",
      { name: "Collapse group" },
    );

    fireEvent.click(collapseButton);

    expect(useQueryStore.getState().rootGroup.children[0]).toMatchObject({
      type: "group",
      collapsed: true,
      children: [
        expect.objectContaining({
          type: "condition",
          field: "name",
        }),
      ],
    });
  });
});
