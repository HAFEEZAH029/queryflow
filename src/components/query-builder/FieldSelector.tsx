type FieldSelectorProps = {
  value: string;
  options: {
    name: string;
    label: string;
  }[];
  onChange: (value: string) => void;
};

export default function FieldSelector({
  value,
  options,
  onChange,
}: FieldSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
    >
      {options.map((field) => (
        <option key={field.name} value={field.name}>
          {field.label}
        </option>
      ))}
    </select>
  );
}
