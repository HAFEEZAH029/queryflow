import type { QueryOperator } from "@/types/query";

type Props = {
  value: QueryOperator;
  operators: QueryOperator[];
  onChange: (operator: QueryOperator) => void;
};

export default function OperatorSelector({
  value,
  operators,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value as QueryOperator)
      }
      className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
    >
      {operators.map((operator) => (
        <option key={operator} value={operator}>
          {operator}
        </option>
      ))}
    </select>
  );
}
