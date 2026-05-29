
export type FieldType = "string" | "number" | "boolean" | "date" | "enum";

export type QueryLogic = "AND" | "OR";

export type QueryOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "startsWith"
  | "greaterThan"
  | "lessThan"
  | "inArray"
  | "between";

export type QueryValue = string | number | boolean | string[] | number[] | [number, number] | [string, string] | null;

export type ConditionNode = {
  id: string;
  type: "condition";
  field: string;
  operator: QueryOperator;
  value: QueryValue;
};

export type GroupNode = {
  id: string;
  type: "group";
  logic: QueryLogic;
  children: QueryNode[];
  collapsed?: boolean;
};

export type QueryNode = ConditionNode | GroupNode;

export type FieldSchema = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
};

export type DataSourceSchema = {
  id: string;
  label: string;
  fields: FieldSchema[];
};