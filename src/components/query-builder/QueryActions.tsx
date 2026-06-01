"use client";

import { ChangeEvent, useCallback, useRef, useEffect } from "react";
import { Copy, Download, Upload } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { generateQuery } from "@/lib/query-engine/generate-query";
import { formatQuery } from "@/lib/query-engine/format-query";
import { isValidImportedRootGroup } from "@/lib/query-engine/validate-import";


export default function QueryActions() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const rootGroup = useQueryStore((state) => state.rootGroup);
  const selectedSchemaId = useQueryStore((state) => state.selectedSchemaId);
  const setSelectedSchema = useQueryStore((state) => state.setSelectedSchema);
  const setRootGroup = useQueryStore((state) => state.setRootGroup);

  const handleCopy = async () => {
    const query = generateQuery(rootGroup);
    await navigator.clipboard.writeText(formatQuery(query));
  };

  const handleExport = useCallback(() => {
  const payload = {
    selectedSchemaId,
    rootGroup,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "queryflow-query.json";
  anchor.click();

  URL.revokeObjectURL(url);
  }, [rootGroup, selectedSchemaId]);

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        !("rootGroup" in parsed) ||
        !isValidImportedRootGroup(parsed.rootGroup)
      ) {
          throw new Error("Invalid query JSON");
        }

      const importedSchemaId =
        "selectedSchemaId" in parsed &&
        typeof parsed.selectedSchemaId === "string"
        ? parsed.selectedSchemaId
        : selectedSchemaId;

      setSelectedSchema(importedSchemaId);
      setRootGroup(parsed.rootGroup);
    } catch {
      alert("Invalid query JSON. Please upload a valid QueryFlow export.");
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
      event.preventDefault();
      handleExport();
    }

    if (event.ctrlKey && event.key.toLowerCase() === "i") {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
  }, [handleExport]);

  return (
    <div className="flex items-center gap-2 text-slate-400">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />

      <button
        type="button"
        aria-label="Upload query"
        onClick={() => fileInputRef.current?.click()}
        className="rounded p-1.5 transition hover:bg-slate-800 hover:text-slate-100"
      >
        <Upload size={14} />
      </button>

      <button
        type="button"
        aria-label="Download query"
        onClick={handleExport}
        className="rounded p-1.5 transition hover:bg-slate-800 hover:text-slate-100"
      >
        <Download size={14} />
      </button>

      <span className="h-5 w-px bg-slate-800" />

      <button
        type="button"
        aria-label="Copy query"
        onClick={handleCopy}
        className="rounded p-1.5 transition hover:bg-slate-800 hover:text-slate-100"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}