/* --------------------------------------------------------------
   components/nav-center.tsx
   Next-/React navigation bar with dropdowns that OPEN on click
   and stay open until you click a submenu item or move the
   pointer away.
---------------------------------------------------------------- */

"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ----------------------------------------------------------------
   Navigation data
---------------------------------------------------------------- */
const navItems = [
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
      { label: "How To Use", href: "#gcp-bow-howto" },
    ],
  },
];

/* ----------------------------------------------------------------
   Component
---------------------------------------------------------------- */
export function NavCenter() {
  const [open, setOpen] = useState<string | null>(null);

  /** Open the given menu; close when clicking same item again */
  const toggleMenu = (label: string) =>
    setOpen(open === label ? null : label);

  /** Close on mouse-leave of the whole pop-over */
  const closeMenu = () => setOpen(null);

  return (
    <nav className="flex-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 min-w-0 whitespace-nowrap">
      {navItems.map((item) =>
        item.dropdown ? (
          /* --------------- Item with dropdown --------------- */
          <div
            key={item.label}
            className="relative"
            onMouseLeave={closeMenu} // keeps menu open while pointer is inside
          >
            {/* parent button ------------------------------------------------ */}
            <button
              type="button"
              onClick={() => toggleMenu(item.label)}
              className={`flex items-center gap-1 pb-1 text-sm font-medium transition ${
                open === item.label
                  ? "font-semibold text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
              aria-expanded={open === item.label}
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

            {/* dropdown ------------------------------------------------------ */}
            {open === item.label && (
              <div
                className="absolute left-0 mt-2 w-44 rounded border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-50"
                onMouseEnter={() => setOpen(item.label)} // keep open
                onMouseLeave={closeMenu}
              >
                {item.dropdown.map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.href}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={closeMenu}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* --------------- Simple link --------------- */
          <Link
            key={item.label}
            href={item.href as string}
            className="pb-1 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
