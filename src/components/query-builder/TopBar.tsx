"use client";

import { Keyboard, Moon, Sun, Play, Save, Search, UserCircle } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { useEffect } from "react";



const shortcuts = [
  { action: "Run Query", keys: "Ctrl + Enter" },
  { action: "Export JSON", keys: "Ctrl + S" },
  { action: "Import JSON", keys: "Ctrl + I" },
];

export default function TopBar() {

  const runQuery = useQueryStore((state) => state.runQuery);
  const executionStatus = useQueryStore((state) => state.executionStatus);
  const theme = useQueryStore((state) => state.theme);
  const toggleTheme = useQueryStore((state) => state.toggleTheme);

  useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      runQuery();
    }

    if (event.ctrlKey && event.key.toLowerCase() === "s") {
      event.preventDefault();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
 }, [runQuery]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4">
      <div className="relative w-full max-w-sm">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={18}
        />
        <input
          className="h-9 w-full rounded border border-slate-700 bg-slate-950 pl-10 pr-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
          placeholder="Search resources..."
          type="search"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          className="flex h-9 items-center gap-2 rounded border border-slate-700 bg-slate-900 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          type="button"
        >
          <Save size={15} />
          <span>Save</span>
        </button>

        <button
          className="flex h-9 items-center gap-2 rounded bg-emerald-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          type="button"
          onClick={runQuery}
          disabled={executionStatus === "loading"}
        >
          <Play size={15} />
          <span>{executionStatus === "loading" ? "Running..." : "Run"}</span>
        </button>

        <div className="mx-2 h-7 w-px bg-slate-800" />

        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="flex size-9 items-center justify-center rounded text-slate-300 transition hover:bg-slate-800 hover:text-white"
          type="button"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="group relative">
          <button
            aria-label="Keyboard shortcuts"
            className="flex size-9 items-center justify-center rounded text-slate-300 transition hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white focus:outline-none"
            type="button"
          >
            <Keyboard size={20} />
          </button>

          <div className="pointer-events-none absolute right-0 top-11 z-20 w-44 rounded border border-slate-700 bg-slate-950 px-3 py-2 opacity-0 shadow-xl shadow-slate-950/50 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
            <p className="mb-2 text-[11px] font-semibold text-slate-400">
              Keyboard Shortcuts
            </p>
            <div className="space-y-1.5">
              {shortcuts.map((shortcut) => (
                <div
                  className="flex items-center justify-between gap-3 text-[11px]"
                  key={shortcut.action}
                >
                  <span className="text-slate-300">{shortcut.action}</span>
                  <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          aria-label="Account"
          className="flex size-9 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-slate-600 hover:text-white"
          type="button"
        >
          <UserCircle size={24} />
        </button>
      </div>
    </header>
  );
}
