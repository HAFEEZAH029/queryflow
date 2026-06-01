"use client";

import { RotateCcw } from "lucide-react";
import { useQueryStore } from "@/store/query-store";

export default function HistoryPanel() {
  const history = useQueryStore((state) => state.history);
  const restoreHistoryItem = useQueryStore((state) => state.restoreHistoryItem);

  return (
    <div className="border-t border-slate-800 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Query History</h2>
        <span className="text-xs text-slate-500">{history.length} saved runs</span>
      </div>

      {history.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          Run a query to save it in history.
        </p>
      ) : (
        <div className="scrollbar-hidden mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded border border-slate-800 bg-slate-900 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {item.schemaId} query
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString()} · {item.resultCount} results
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => restoreHistoryItem(item.id)}
                  className="flex items-center gap-2 rounded bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  <RotateCcw size={14} />
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}