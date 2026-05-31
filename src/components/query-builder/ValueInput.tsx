import type { FieldType, QueryOperator, QueryValue } from "@/types/query";

type ValueInputProps = {
  fieldType: FieldType;
  operator: QueryOperator;
  value: QueryValue;
  options?: string[];
  onChange: (value: QueryValue) => void;
};

export default function ValueInput({
  fieldType,
  operator,
  value,
  options,
  onChange,
}: ValueInputProps) {
  const inputClass =
    "w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-400";
  const compactInputClass =
    "w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-200 outline-none focus:border-emerald-400";

  if (operator === "between") {
    const rangeValue: [string, string] = Array.isArray(value)
      ? [
          String(value[0] ?? ""),
          String(value[1] ?? ""),
        ]
      : ["", ""];

    return (
      <div className="grid min-w-0 grid-cols-2 gap-1.5">
        <input
          type={fieldType === "date" ? "date" : "number"}
          value={String(rangeValue[0] ?? "")}
          onChange={(e) => onChange([e.target.value, rangeValue[1]])}
          className={compactInputClass}
          placeholder="Min"
        />

        <input
          type={fieldType === "date" ? "date" : "number"}
          value={String(rangeValue[1] ?? "")}
          onChange={(e) => onChange([rangeValue[0], e.target.value])}
          className={compactInputClass}
          placeholder="Max"
        />
      </div>
    );
  }

  if (operator === "inArray") {
    return (
      <input
        type="text"
        value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          )
        }
        className={inputClass}
        placeholder="active, pending"
      />
    );
  }

  if (fieldType === "enum") {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (fieldType === "boolean") {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value === "true")}
        className={inputClass}
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  if (fieldType === "number") {
    return (
      <input
        type="number"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        placeholder="Value..."
      />
    );
  }

  if (fieldType === "date") {
    return (
      <input
        type="date"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    );
  }

  return (
    <input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
      placeholder="Value..."
    />
  );
}
