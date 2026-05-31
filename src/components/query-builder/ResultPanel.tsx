"use client";

import { useQueryStore } from "@/store/query-store";

export default function ResultPanel() {
  const results = useQueryStore((state) => state.results);
  const executionStatus = useQueryStore((state) => state.executionStatus);

  const columns = results[0] ? Object.keys(results[0]) : [];

  return (
    <footer className="border-t border-slate-800 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold">Results Preview</span>

          {executionStatus === "success" && (
            <span className="text-sm text-emerald-300">
              {results.length} result{results.length === 1 ? "" : "s"} found
            </span>
          )}

          {executionStatus === "empty" && (
            <span className="text-sm text-amber-300">No matches found</span>
          )}

          {executionStatus === "error" && (
            <span className="text-sm text-rose-300">Validation Blocked</span>
          )}

          {executionStatus === "idle" && (
            <span className="text-sm text-slate-400">Run a query to preview results</span>
          )}
        </div>
      </div>

      {executionStatus === "error" && (
        <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-5 text-center">
          <p className="font-medium text-rose-200">Cannot execute query</p>
          <p className="mt-2 text-sm text-slate-300">
            Please fix validation errors before running this query.
          </p>
        </div>
      )}

      {executionStatus === "empty" && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-5 text-center">
          <p className="font-medium text-slate-200">No records matched</p>
          <p className="mt-2 text-sm text-slate-400">
            Try adjusting your filters or switching the query logic.
          </p>
        </div>
      )}

      {executionStatus === "success" && (
        <div className="scrollbar-hidden mt-4 max-h-48 overflow-auto rounded-lg border border-slate-800">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-slate-900 text-xs uppercase text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {results.map((row, index) => (
                <tr key={index} className="bg-slate-950/70 text-slate-300">
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-3">
                      {String(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </footer>
  );
}
