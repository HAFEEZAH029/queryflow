"use client";

import SidePanel from "@/components/query-builder/SidePanel";
import TopBar from "@/components/query-builder/TopBar";
import { schemas } from "@/data/schema";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Database,
  GitBranch,
  Hash,
  LayoutGrid,
  ListFilter,
  Mail,
  Moon,
  PanelRight,
  Play,
  Sun,
  Type,
  UserCircle,
} from "lucide-react";
import QueryPreview from "@/components/query-builder/QueryPreview";
import QueryBuilder from "@/components/query-builder/QueryBuilder";
import { useQueryStore } from "@/store/query-store";
import ResultPanel from "@/components/query-builder/ResultPanel";
import HistoryPanel from "@/components/query-builder/HistoryPanel";
import QueryActions from "@/components/query-builder/QueryActions";
import { useEffect, useState } from "react";



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

type MobilePanel = "menu" | "schema" | "query" | null;

type SchemaPanelProps = {
  activeSchema: typeof schemas[number];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  selectedSchemaId: string;
  setSelectedSchema: (schemaId: string) => void;
};

function SchemaPanel({
  activeSchema,
  isCollapsed = false,
  onToggleCollapse,
  selectedSchemaId,
  setSelectedSchema,
}: SchemaPanelProps) {
  return (
    <aside className="h-full overflow-hidden border-r border-slate-800 bg-slate-950/70">
      <div
        className={`border-b border-slate-800 ${
          isCollapsed ? "p-3" : "p-4"
        }`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="font-semibold">Schema</h2>
              <span className="text-xs text-slate-500">{schemas.length} sources</span>
            </div>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="flex size-8 shrink-0 items-center justify-center rounded border border-slate-700 text-slate-400 transition hover:border-indigo-400 hover:bg-slate-800 hover:text-white"
              aria-label={
                isCollapsed
                  ? "Expand schema panel"
                  : "Collapse schema panel"
              }
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          )}
        </div>

        {!isCollapsed && (
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
        )}
      </div>

      {isCollapsed ? (
        <div className="flex justify-center p-4">
          <div
            className="flex flex-col items-center gap-2 text-slate-400"
            aria-hidden="true"
          >
            <Mail size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] [writing-mode:vertical-rl]">
              Schema
            </span>
          </div>
        </div>
      ) : (
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
      )}
    </aside>
  );
}


export default function Home() {
  const [isSchemaCollapsed, setIsSchemaCollapsed] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [activeMobilePanel, setActiveMobilePanel] =
    useState<MobilePanel>(null);

  const selectedSchemaId = useQueryStore(
  (state) => state.selectedSchemaId,
  );

  const setSelectedSchema = useQueryStore(
  (state) => state.setSelectedSchema,
  );

  const theme = useQueryStore((state) => state.theme);
  const toggleTheme = useQueryStore((state) => state.toggleTheme);
  const runQuery = useQueryStore((state) => state.runQuery);
  const executionStatus = useQueryStore((state) => state.executionStatus);

  const activeSchema =
  schemas.find(
    (schema) => schema.id === selectedSchemaId,
  ) ?? schemas[0];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const syncLayout = () => {
      setIsCompactLayout(mediaQuery.matches);
      setActiveMobilePanel(null);
    };

    syncLayout();
    mediaQuery.addEventListener("change", syncLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncLayout);
    };
  }, []);

  useEffect(() => {
    if (!activeMobilePanel) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMobilePanel(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMobilePanel]);

  const toggleMobilePanel = (panel: Exclude<MobilePanel, null>) => {
    setActiveMobilePanel((currentPanel) =>
      currentPanel === panel ? null : panel,
    );
  };

  const builderCanvas = (
    <div className="scrollbar-themed mt-4 h-[calc(100vh-220px)] overflow-auto rounded-lg border border-slate-700 bg-slate-900 p-4">
      <div className={isCompactLayout ? "min-w-[900px] md:min-w-[1040px]" : ""}>
        <QueryBuilder />
      </div>
    </div>
  );

  const compiledQueryPanel = (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
        <h2 className="font-semibold">Compiled Query</h2>

        <QueryActions />
      </header>

      <QueryPreview />

      <footer className="border-t border-slate-800 px-4 py-3 text-xs font-semibold tracking-wide text-slate-400">
        Target: MongoDB
      </footer>
    </div>
  );

  return (
    <main
      className={`min-h-screen bg-(--app-bg) text-(--text-primary) ${
        theme === "dark" ? "theme-dark" : "theme-light"
      }`}
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-primary)",
      }}
    >
      {isCompactLayout ? (
        <div className="relative flex min-h-screen overflow-hidden">
          <aside className="relative z-50 flex w-14 shrink-0 flex-col items-center gap-4 border-r border-slate-800 bg-slate-950/90 px-2 py-20">
            <button
              type="button"
              onClick={() => toggleMobilePanel("menu")}
              className={`flex size-10 items-center justify-center rounded border transition ${
                activeMobilePanel === "menu"
                  ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                  : "border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              }`}
              aria-label="Open navigation panel"
              aria-pressed={activeMobilePanel === "menu"}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              type="button"
              onClick={() => toggleMobilePanel("schema")}
              className={`flex size-10 items-center justify-center rounded border transition ${
                activeMobilePanel === "schema"
                  ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                  : "border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              }`}
              aria-label="Open schema panel"
              aria-pressed={activeMobilePanel === "schema"}
            >
              <Database size={18} />
            </button>

            <button
              type="button"
              onClick={() => toggleMobilePanel("query")}
              className={`flex size-10 items-center justify-center rounded border transition ${
                activeMobilePanel === "query"
                  ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                  : "border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              }`}
              aria-label="Open compiled query panel"
              aria-pressed={activeMobilePanel === "query"}
            >
              <PanelRight size={18} />
            </button>
          </aside>

          {activeMobilePanel && (
            <button
              type="button"
              className="fixed inset-0 z-30 cursor-default bg-slate-950/45"
              aria-label="Close open panel"
              onClick={() => setActiveMobilePanel(null)}
            />
          )}

          {activeMobilePanel === "menu" && (
            <div className="fixed bottom-0 left-14 top-0 z-40 w-[min(82vw,280px)] shadow-2xl shadow-slate-950/60">
              <SidePanel />
            </div>
          )}

          {activeMobilePanel === "schema" && (
            <div className="fixed bottom-0 left-14 top-0 z-40 w-[min(82vw,320px)] shadow-2xl shadow-slate-950/60">
              <SchemaPanel
                activeSchema={activeSchema}
                selectedSchemaId={selectedSchemaId}
                setSelectedSchema={setSelectedSchema}
              />
            </div>
          )}

          {activeMobilePanel === "query" && (
            <aside className="fixed bottom-0 right-0 top-0 z-40 flex w-[min(88vw,420px)] border-l border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/60">
              {compiledQueryPanel}
            </aside>
          )}

          <section className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/60 px-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded bg-emerald-400 text-slate-950">
                  <GitBranch size={18} />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-sm font-bold text-emerald-300">QueryFlow</h1>
                  <p className="truncate text-xs font-medium text-slate-300">Data Engine</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  className="flex h-9 items-center gap-2 rounded bg-emerald-500 px-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                  type="button"
                  onClick={runQuery}
                  disabled={executionStatus === "loading"}
                >
                  <Play size={15} />
                  <span className="hidden sm:inline">
                    {executionStatus === "loading" ? "Running..." : "Run"}
                  </span>
                </button>

                <button
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                  className="flex size-9 items-center justify-center rounded text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  type="button"
                >
                  {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
                </button>

                <button
                  aria-label="Account"
                  className="flex size-9 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-slate-600 hover:text-white"
                  type="button"
                >
                  <UserCircle size={22} />
                </button>
              </div>
            </header>

            <div className="min-w-0 flex-1 p-3 sm:p-4">
              <h2 className="font-semibold">Visual Query Builder</h2>
              {builderCanvas}
            </div>

            <ResultPanel />
            <HistoryPanel />
          </section>
        </div>
      ) : (
        <div className="grid min-h-screen grid-cols-[240px_1fr]">
          <SidePanel />

          <section className="flex min-w-0 flex-col">
            <TopBar />

            <div className="grid flex-1 grid-cols-[1fr_360px] overflow-hidden">
              <section className="flex min-w-0 flex-col overflow-hidden">
                <div
                  className="grid flex-1 transition-[grid-template-columns] duration-300 ease-out"
                  style={{
                    gridTemplateColumns: isSchemaCollapsed
                      ? "56px minmax(0, 1fr)"
                      : "260px minmax(0, 1fr)",
                  }}
                >
                  <SchemaPanel
                    activeSchema={activeSchema}
                    isCollapsed={isSchemaCollapsed}
                    onToggleCollapse={() =>
                      setIsSchemaCollapsed((current) => !current)
                    }
                    selectedSchemaId={selectedSchemaId}
                    setSelectedSchema={setSelectedSchema}
                  />

                  <section className="min-w-0 p-4">
                    <h2 className="font-semibold">Visual Query Builder</h2>
                    {builderCanvas}
                  </section>
                </div>

                <ResultPanel />
                <HistoryPanel />
              </section>

              <aside className="flex border-l border-slate-800 bg-slate-950/80">
                {compiledQueryPanel}
              </aside>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
