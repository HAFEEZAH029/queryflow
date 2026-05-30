"use client";

import SidePanel from "@/components/query-builder/SidePanel";
import TopBar from "@/components/query-builder/TopBar";
import { schemas } from "@/data/schema";
import {
  CalendarDays,
  Copy,
  Download,
  Hash,
  ListFilter,
  Mail,
  Type,
  Upload,
} from "lucide-react";
import QueryPreview from "@/components/query-builder/QueryPreview";
import QueryBuilder from "@/components/query-builder/QueryBuilder";
import { useQueryStore } from "@/store/query-store";



const fieldIcons = {
  date: CalendarDays,
  enum: ListFilter,
  number: Hash,
  string: Type,
  boolean: ListFilter,
};

const fieldBadgeStyles = {
  date: "bg-rose-500/15 text-rose-300",
  enum: "bg-indigo-500/15 text-indigo-300",
  number: "bg-amber-500/15 text-amber-300",
  string: "bg-emerald-500/15 text-emerald-300",
  boolean: "bg-cyan-500/15 text-cyan-300",
};


export default function Home() {
  const selectedSchemaId = useQueryStore(
  (state) => state.selectedSchemaId,
  );

  const setSelectedSchema = useQueryStore(
  (state) => state.setSelectedSchema,
  );

  const activeSchema =
  schemas.find(
    (schema) => schema.id === selectedSchemaId,
  ) ?? schemas[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-[240px_1fr]">
        <SidePanel />

        <section className="flex min-w-0 flex-col">
          <TopBar />

          <div className="grid flex-1 grid-cols-[1fr_360px] overflow-hidden">
            <section className="flex min-w-0 flex-col overflow-hidden">
              <div className="grid flex-1 grid-cols-[260px_1fr]">
                <aside className="border-r border-slate-800 bg-slate-950/70">
                  <div className="border-b border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold">Schema</h2>
                      <span className="text-xs text-slate-500">{schemas.length} sources</span>
                    </div>

                    <select
                    value={selectedSchemaId}
                    onChange={(e) =>
                      setSelectedSchema(e.target.value)
                    }
                    className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
                    >
                      {schemas.map((schema) => (
                        <option
                        key={schema.id}
                        value={schema.id}
                        >
                          {schema.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      <Mail size={16} className="text-slate-400" />
                      <span>{activeSchema.label}</span>
                    </div>

                    <div className="mt-4 space-y-3 border-l border-slate-800 pl-4">
                      {activeSchema.fields.map((field) => {
                        const Icon = fieldIcons[field.type];

                        return (
                          <div
                            key={field.name}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-2 text-slate-300">
                              <Icon size={14} className="shrink-0 text-slate-500" />
                              <span className="truncate">{field.name}</span>
                            </div>
                            <span
                              className={`shrink-0 rounded px-2 py-1 text-[11px] leading-none ${fieldBadgeStyles[field.type]}`}
                            >
                              {field.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                <section className="p-6">
                  <h2 className="font-semibold">Visual Query Builder</h2>

                  <div className="scrollbar-hidden mt-4 h-[calc(100vh-220px)] overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-6">
                    <QueryBuilder />
                  </div>
                </section>
              </div>

              <footer className="border-t border-slate-800 p-4">
                Results Preview
              </footer>
            </section>

            <aside className="flex border-l border-slate-800 bg-slate-950/80">
              <div className="flex min-h-0 flex-1 flex-col">
                <header className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
                  <h2 className="font-semibold">Compiled Query</h2>

                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      type="button"
                      aria-label="Upload query"
                      className="rounded p-1.5 transition hover:bg-slate-800 hover:text-slate-100"
                    >
                      <Upload size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Download query"
                      className="rounded p-1.5 transition hover:bg-slate-800 hover:text-slate-100"
                    >
                      <Download size={14} />
                    </button>
                    <span className="h-5 w-px bg-slate-800" />
                    <button
                      type="button"
                      aria-label="Copy query"
                      className="rounded p-1.5 transition hover:bg-slate-800 hover:text-slate-100"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </header>

                <QueryPreview />

                <footer className="border-t border-slate-800 px-4 py-3 text-xs font-semibold tracking-wide text-slate-400">
                  Target: MongoDB
                </footer>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
