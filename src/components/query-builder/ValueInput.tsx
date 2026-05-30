type ValueInputProps = {
  fieldType: string;
  value: unknown;
  options?: string[];
  onChange: (value: string) => void;
};

export default function ValueInput({
  fieldType,
  value,
  options,
  onChange,
}: ValueInputProps) {
  if (fieldType === "enum") {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (fieldType === "number") {
    return (
      <input
        type="number"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
      />
    );
  }

  if (fieldType === "date") {
    return (
      <input
        type="date"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
      />
    );
  }

  return (
    <input
      type="text"
      value={String(value)}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
    />
  );
}