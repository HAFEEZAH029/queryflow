export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-[240px_1fr_360px]">
        <aside className="border-r border-slate-800 p-4">
          <h1 className="text-xl font-bold text-emerald-400">QueryFlow</h1>
          <nav className="mt-8 space-y-3 text-sm text-slate-300">
            <p>Query</p>
            <p>Schema</p>
            <p>History</p>
          </nav>
        </aside>

        <section className="flex flex-col">
          <header className="border-b border-slate-800 p-4">
            <input
              className="w-full max-w-md rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              placeholder="Search resources..."
            />
          </header>

          <div className="grid flex-1 grid-cols-[260px_1fr]">
            <aside className="border-r border-slate-800 p-4">
              <h2 className="font-semibold">Schema</h2>
              <p className="mt-4 text-sm text-slate-400">Users Collection</p>
            </aside>

            <section className="p-6">
              <h2 className="font-semibold">Visual Query Builder</h2>
              <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 p-6">
                Builder placeholder
              </div>
            </section>
          </div>

          <footer className="border-t border-slate-800 p-4">
            Results Preview
          </footer>
        </section>

        <aside className="border-l border-slate-800 p-4">
          <h2 className="font-semibold">Compiled Query</h2>
          <pre className="mt-4 rounded-lg bg-slate-950 p-4 text-sm text-emerald-300">
            {`{ "$and": [] }`}
          </pre>
        </aside>
      </div>
    </main>
  );
}
