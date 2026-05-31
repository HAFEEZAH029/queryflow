import type { ValidationError } from "@/lib/query-engine/validate-query";

type ValidationSummaryProps = {
  errors: ValidationError[];
};

export default function ValidationSummary({
  errors,
}: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4">
      <p className="text-sm font-semibold text-rose-300">
        Validation Blocked
      </p>
      <ul className="mt-2 space-y-1 text-sm text-rose-200">
        {errors.map((error) => (
          <li key={`${error.nodeId}-${error.message}`}>
            • {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}