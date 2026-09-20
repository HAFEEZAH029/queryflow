import type { GroupNode } from "@/types/query";

export type QueryPreset = {
  id: string;
  label: string;
  schemaId: string;
  rootGroup: GroupNode;
};

export const presets: QueryPreset[] = [
  {
    id: "active-users",
    label: "Active Users",
    schemaId: "users",
    rootGroup: {
      id: "preset-active-users-root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "preset-active-users-condition",
          type: "condition",
          field: "status",
          operator: "equals",
          value: "active",
        },
      ],
    },
  },
  {
    id: "high-value-orders",
    label: "High Value Orders",
    schemaId: "orders",
    rootGroup: {
      id: "preset-high-value-orders-root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "preset-high-value-orders-condition",
          type: "condition",
          field: "total",
          operator: "greaterThan",
          value: "100",
        },
      ],
    },
  },
  {
    id: "electronics-products",
    label: "Electronics Products",
    schemaId: "products",
    rootGroup: {
      id: "preset-electronics-products-root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "preset-electronics-products-condition",
          type: "condition",
          field: "category",
          operator: "equals",
          value: "electronics",
        },
      ],
    },
  },
];