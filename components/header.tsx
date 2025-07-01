"use client"

import * as React from "react";
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Menu } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/BofA_logo"
import { useVersionsWithStatus, VersionWithStatus } from "@/lib/version-status"
import { useRef, useState as useLocalState } from "react";
import { VersionDropdown } from "@/components/VersionDropdown";


function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative inline-flex h-8 w-16 items-center rounded-full bg-orange-500 transition-colors">
        <div className="absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform">
          <svg className="h-3 w-3 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </div>
        <div className="absolute left-2 flex items-center justify-center">
          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </div>
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-slate-300 dark:border-slate-600 ${
        isDark ? "bg-slate-900 hover:bg-slate-800" : "bg-orange-500 hover:bg-orange-600"
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Toggle Handle */}
      <div
        className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ${
          isDark ? "translate-x-9" : "translate-x-1"
        }`}
      >
        {/* Handle Icon */}
        {isDark ? (
          <svg className="h-3 w-3 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="h-3 w-3 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        )}
      </div>

      {/* Background Icons */}
      {isDark ? (
        // Dark mode: Moon and stars on the left
        <div className="absolute left-2 flex items-center justify-center">
          <div className="relative">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                clipRule="evenodd"
              />
            </svg>
            {/* Small stars */}
            <div className="absolute -top-1 -right-1">
              <svg className="h-1.5 w-1.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="absolute -top-0.5 -left-2">
              <svg className="h-1 w-1 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="absolute top-1 -left-1">
              <svg className="h-1 w-1 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        // Light mode: Sun with rays on the left
        <div className="absolute left-2 flex items-center justify-center">
          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </div>
      )}
    </button>
  )
}

export interface HeaderProps {
  selectedVersion: string
  versions: string[]
  setSelectedVersion?: (version: string) => void // make optional
}

export function Header({
  selectedVersion,
  setSelectedVersion,
  versions
}: HeaderProps): React.ReactElement {
  const backendVersions = useVersionsWithStatus();
  const displayVersions: VersionWithStatus[] = backendVersions.length > 0
    ? backendVersions
    : versions.map(v => ({ version: v, releaseDate: '', status: 'previous' }));

  // Group versions by status from JSON
  const grouped = {
    current: displayVersions.filter(v => v.status === 'current'),
    previous: displayVersions.filter(v => v.status === 'previous'),
    development: displayVersions.filter(v => v.status === 'development'),
    future: displayVersions.filter(v => v.status === 'future'),
  };

  // Custom dropdown state
  const [open, setOpen] = useLocalState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleSelect(ver: VersionWithStatus) {
    if (ver.status !== 'future') {
      if (setSelectedVersion) {
        setSelectedVersion(ver.version);
      }
      setOpen(false);
    }
  }

  function getBadge(ver: VersionWithStatus) {
    if (ver.status === 'current') return <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] align-middle">stable</span>;
    if (ver.status === 'previous') return <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-300 text-gray-800 text-[10px] align-middle">legacy</span>;
    if (ver.status === 'development') return <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-200 text-orange-900 text-[10px] align-middle">development</span>;
    if (ver.status === 'future') return <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] align-middle">not yet started</span>;
    return null;
  }

  function getSectionHeading(status: string) {
    if (status === 'current') return <div className="px-4 py-1 text-blue-900 dark:text-blue-200 text-[10px] font-semibold bg-blue-100 dark:bg-blue-900">STABLE</div>;
    if (status === 'previous') return <div className="px-4 pt-3 pb-1 text-gray-700 dark:text-gray-300 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800">LEGACY</div>;
    if (status === 'development') return <div className="px-4 pt-3 pb-1 text-orange-900 dark:text-orange-200 text-[10px] font-semibold bg-orange-100 dark:bg-orange-900">DEVELOPMENT</div>;
    if (status === 'future') return <div className="px-4 pt-3 pb-1 text-purple-900 dark:text-purple-200 text-[10px] font-semibold bg-purple-100 dark:bg-purple-900">NOT YET STARTED</div>;
    return null;
  }

  return (
    <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 left-0 right-0 z-50 w-full">
      <div className="w-full px-0 py-4">
        <div className="flex items-center justify-between w-full pr-4 sm:pr-6 md:pr-8 lg:pr-10 xl:pr-16 2xl:pr-24 pl-2">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">GRA Core Platform</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Documentation</p>
              </div>
            </Link>
            {/* Custom Version Dropdown */}
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                className="appearance-none pr-8 pl-3 py-1.5 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-100 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm hover:bg-purple-100 dark:hover:bg-purple-800 cursor-pointer min-w-[140px] flex items-center"
                onClick={() => setOpen(!open)}
                aria-haspopup="listbox"
                aria-expanded={open}
              >
                {(() => {
                  const ver = displayVersions.find(v => v.version === selectedVersion) || grouped.current[0];
                  return (
                    <>
                      {ver ? ver.version.replace(/^gcp-(\d+(?:\.\d+)?)/i, (m, v) => `GCP-${v}`) : 'Select version'}
                      {ver && getBadge(ver)}
                    </>
                  );
                })()}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-200">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/></svg>
                </span>
              </button>
              {open && (
                <div className="absolute z-50 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-2 text-xs">
                  {/* Current */}
                  {grouped.current.length > 0 && getSectionHeading('current')}
                  {grouped.current.map(ver => (
                    <div
                      key={ver.version}
                      className={`flex items-center px-4 py-2 cursor-pointer rounded ${selectedVersion === ver.version ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
                      onClick={() => handleSelect(ver)}
                    >
                      <span>{ver.version.replace(/^gcp-(\d+(?:\.\d+)?)/i, (m, v) => `GCP-${v}`)}</span>
                      {getBadge(ver)}
                    </div>
                  ))}
                  {/* Development */}
                  {grouped.development.length > 0 && getSectionHeading('development')}
                  {grouped.development.map(ver => (
                    <div
                      key={ver.version}
                      className={`flex items-center px-4 py-2 cursor-pointer rounded ${selectedVersion === ver.version ? 'bg-orange-100 dark:bg-orange-800' : ''}`}
                      onClick={() => handleSelect(ver)}
                    >
                      <span>{ver.version.replace(/^gcp-(\d+(?:\.\d+)?)/i, (m, v) => `GCP-${v}`)}</span>
                      {getBadge(ver)}
                    </div>
                  ))}
                  {/* Future */}
                  {grouped.future.length > 0 && getSectionHeading('future')}
                  {grouped.future.map(ver => (
                    <div
                      key={ver.version}
                      className="flex items-center px-4 py-2 rounded cursor-not-allowed opacity-60 relative group bg-purple-50 dark:bg-purple-800"
                      title="Not released yet, no documentation available"
                    >
                      <span>{ver.version.replace(/^gcp-(\d+(?:\.\d+)?)/i, (m, v) => `GCP-${v}`)}</span>
                      {getBadge(ver)}
                      <span className="ml-2 text-xs text-purple-400 group-hover:block hidden absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded shadow">Not released yet, no documentation available</span>
                    </div>
                  ))}
                  {/* Previous Versions */}
                  {grouped.previous.length > 0 && getSectionHeading('previous')}
                  {grouped.previous.map(ver => (
                    <div
                      key={ver.version}
                      className={`flex items-center px-4 py-2 cursor-pointer rounded ${selectedVersion === ver.version ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                      onClick={() => handleSelect(ver)}
                    >
                      <span>{ver.version.replace(/^gcp-(\d+(?:\.\d+)?)/i, (m, v) => `GCP-${v}`)}</span>
                      {getBadge(ver)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="flex-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 min-w-0 overflow-x-auto whitespace-nowrap">
            <Link href="#about" className="text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1">About</Link>
            <Link href="#user-guide" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 pb-1">User Guide</Link>
            <Link href="#example" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 pb-1">Example</Link>
            <Link href="#create-doc" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 pb-1">Create Doc</Link>
            <Link href="#gcp-bow" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 pb-1">GCP BOW</Link>
          </nav>

          {/* Theme Toggle Pill Button and Action Buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <Button variant="outline" size="sm" className="min-w-[220px] flex items-center justify-start px-4">
              <Search className="w-4 h-4 mr-2" />
              <span className="truncate text-left">Search</span>
            </Button>
            <Button variant="outline" size="sm" className="md:hidden bg-transparent">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}


export default function ExampleHeader() {
  const [selectedVersion, setSelectedVersion] = useState("gcp-5.6"); // or your default

  return (
    <VersionDropdown
      selected={selectedVersion}
      onSelect={setSelectedVersion}
    />
  );
}
