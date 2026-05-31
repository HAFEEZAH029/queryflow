"use client";

import { useMemo } from "react";

import { useQueryStore } from "@/store/query-store";

import {
  generateQuery,
} from "@/lib/query-engine/generate-query";

import {
  formatQuery,
} from "@/lib/query-engine/format-query";

export default function QueryPreview() {
  const rootGroup = useQueryStore(
    (state) => state.rootGroup,
  );

  const query = useMemo(
    () => generateQuery(rootGroup),
    [rootGroup],
  );

  return (
    <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-emerald-300">
      {formatQuery(query)}
    </pre>
  );
}
