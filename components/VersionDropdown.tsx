import React, { useState, useRef, useEffect } from "react";
import { useGroupedVersions, VersionWithStatus } from "@/lib/use-grouped-versions";

const STATUS_COLORS: Record<VersionWithStatus["status"], string> = {
  current: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  development: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  future: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  previous: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const STATUS_LABELS: Record<VersionWithStatus["status"], string> = {
  current: "Current",
  development: "Development",
  future: "Future",
  previous: "Previous",
};

export function VersionDropdown({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  const { data, loading, error } = useGroupedVersions();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (loading) return <div className="text-xs text-gray-400">Loading versions...</div>;
  if (error || !data) return <div className="text-xs text-red-500">Failed to load versions</div>;

  // Flatten for label
  const all = [
    ...data.current,
    ...data.development,
    ...data.future,
    ...data.previous,
  ];
  const selectedObj = all.find((v) => v.version === selected) || data.current[0];

  return (
    <div className="relative inline-block min-w-[160px]" ref={ref}>
      <button
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_COLORS[selectedObj?.status || "current"]}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selectedObj ? selectedObj.version.replace(/^gcp-(\d+(?:\.\d+)?)/i, (m, v) => `GCP-${v}`) : "Select version"}</span>
        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg shadow-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 py-2 text-sm">
          {(["current", "development", "future", "previous"] as const).map((status) =>
            data[status].length > 0 ? (
              <div key={status}>
                <div className={`px-4 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</div>
                {data[status].map((ver) => {
                  const isSelected = selected === ver.version;
                  const isFuture = status === "future";
                  let itemClass = `flex items-center px-4 py-2 cursor-pointer rounded transition-colors`;
                  if (isSelected) itemClass += ` ${STATUS_COLORS[status]} font-bold`;
                  if (!isFuture && !isSelected) itemClass += ` hover:bg-blue-100 dark:hover:bg-blue-800`;
                  return (
                    <div
                      key={ver.version}
                      className={itemClass}
                      onClick={() => {
                        if (!isFuture) {
                          onSelect(ver.version);
                          setOpen(false);
                        }
                      }}
                      title={isFuture ? "Not released yet" : undefined}
                      style={isFuture ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                    >
                      <span>{ver.version.replace(/^gcp-(\d+(?:\.\d+)?)/i, (m, v) => `GCP-${v}`)}</span>
                      <span className="ml-2 text-xs text-gray-400">{ver.releaseDate}</span>
                    </div>
                  );
                })}
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
