"use client";

import { useQueryStore } from "@/store/query-store";
import QueryGroup from "./QueryGroup";

export default function QueryBuilder() {
  const rootGroup = useQueryStore((state) => state.rootGroup);

  return <QueryGroup group={rootGroup} isRoot />;
}
