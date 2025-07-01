/* components/nav-center.tsx  */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ----- menu data ----------------------------------------------------- */
const items = [
  { label: "Home", href: "#about" },
  {
    label: "User Guide",
    dropdown: [
      { label: "Introduction", href: "#guide-intro" },
      { label: "Advanced", href: "#guide-advanced" },
      { label: "FAQ", href: "#guide-faq" },
    ],
  },
  {
    label: "Example",
    dropdown: [
      { label: "Basic Example", href: "#example-basic" },
      { label: "Complex Example", href: "#example-complex" },
    ],
  },
  { label: "Create Doc", href: "#create-doc" },
  {
    label: "GCP BOW",
    dropdown: [
      { label: "Overview", href: "#gcp-bow-overview" },
      { label: "How to Use", href: "#gcp-bow-howto" },
    ],
  },
];

/* -------------------------------------------------------------------- */
export function NavCenter() {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  /* outside-click closes the menu ------------------------------------ */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-nav-root]")) setOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* helper ------------------------------------------------------------ */
  const startCloseTimer = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 150);
  };
  const cancelCloseTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <nav
      data-nav-root
      className="flex-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 min-w-0 whitespace-nowrap"
    >
      {items.map((item) =>
        item.dropdown ? (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={cancelCloseTimer}
            onMouseLeave={startCloseTimer}
          >
            {/* button --------------------------------------------------- */}
            <button
              type="button"
              aria-expanded={open === item.label}
              onClick={() =>
                setOpen(open === item.label ? null : item.label)
              }
              className={`flex items-center gap-1 pb-1 text-sm font-medium transition ${
                open === item.label
                  ? "font-semibold text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {item.label}
              <svg
                className="ml-1 h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* dropdown ------------------------------------------------- */}
            {open === item.label && (
              <div
                className="absolute left-0 mt-2 w-44 rounded border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-50"
                onMouseEnter={cancelCloseTimer}
                onMouseLeave={startCloseTimer}
              >
                {item.dropdown.map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.href}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => setOpen(null)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* simple link --------------------------------------------- */
          <Link
            key={item.label}
            href={item.href}
            className="pb-1 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
