import {
  BookOpen,
  Clock3,
  Database,
  FileText,
  GitBranch,
  LayoutGrid,
  Settings,
} from "lucide-react";

export default function SidePanel() {
  const navItems = [
    { label: "Query", icon: LayoutGrid, active: true },
    { label: "Schema", icon: GitBranch },
    { label: "History", icon: Clock3 },
  ];

  const presets = ["Active Users", "High Value Customers", "Recent Signups"];

  return (
    <aside className="flex min-h-screen flex-col border-r border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded bg-emerald-400 text-slate-950">
          <Database size={20} />
        </div>
        <div>
          <h1 className="text-base font-bold text-emerald-300">QueryFlow</h1>
          <p className="text-xs font-medium text-slate-300">Data Engine</p>
        </div>
      </div>

      <nav className="mt-9 space-y-2">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm transition ${
              active
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            type="button"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-9">
        <p className="px-3 text-xs font-semibold text-slate-500">Presets</p>
        <div className="mt-3 space-y-1">
          {presets.map((preset) => (
            <button
              key={preset}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              type="button"
            >
              <BookOpen size={16} />
              <span>{preset}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-1 border-t border-slate-800 pt-4">
        <button
          className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          type="button"
        >
          <FileText size={18} />
          <span>Docs</span>
        </button>
        <button
          className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          type="button"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
