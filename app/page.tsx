"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Book, Users, Code, Layers, Wrench, Database, ArrowRight, Search, Menu, FileText, Folder, Home } from "lucide-react"
import Link from "next/link"
import { Banner } from "@/components/banner"
import { Logo } from "@/components/BofA_logo"
import { NavigationTabs } from "@/components/navigation-tabs"
import FeatureCards from "@/components/feature-cards"
import { Header } from "@/components/header"

interface HomepageSection {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

interface SeeAlsoLink {
  title: string
  href: string
}

// Icon mapping for dynamic icon rendering
const ICON_MAP = {
  Book,
  Users,
  Code,
  Layers,
  Wrench,
  Database,
  Search,
  FileText,
  Folder,
  Home,
  Menu
}

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
      </div>
    )
  }

  // Actual toggle button rendering (after mount)
  return (
    <button
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${theme === "dark" ? "bg-slate-800" : "bg-orange-500"}`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      type="button"
    >
      {/* Toggle Knob */}
      <div
        className={`absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${theme === "dark" ? "translate-x-8" : ""}`}
      >
        {theme === "dark" ? (
          <svg className="h-3 w-3 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.667-7.64 6.46-9.694a.75.75 0 01.818.162.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9c1.41 0 2.75-.29 3.99-.848a.75.75 0 01.762 1.25z" />
          </svg>
        ) : (
          <svg className="h-3 w-3 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        )}
      </div>
      {/* Background Icon (Sun/Moon) */}
      <div className="absolute left-2 flex items-center justify-center">
        {theme === "dark" ? (
          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        )}
      </div>
    </button>
  )
}

export default function HomePage() {
  const [documentationSections, setDocumentationSections] = useState<HomepageSection[]>([])
  const [seeAlsoLinks, setSeeAlsoLinks] = useState<SeeAlsoLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [versions, setVersions] = useState<string[]>([])
  const [latestVersion, setLatestVersion] = useState<string>("")
  const [selectedVersion, setSelectedVersion] = useState<string>("")

  // Fetch documentation sections and see-also links on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const versionParam = selectedVersion ? `?version=${selectedVersion}` : ""
        const [sectionsResponse, linksResponse] = await Promise.all([
          fetch(`/api/homepage-sections${versionParam}`),
          fetch(`/api/see-also-links${versionParam}`)
        ])
        if (!sectionsResponse.ok || !linksResponse.ok) {
          throw new Error('Failed to fetch data')
        }
        const [sections, links] = await Promise.all([
          sectionsResponse.json(),
          linksResponse.json()
        ])
        setDocumentationSections(sections)
        setSeeAlsoLinks(links)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    if (selectedVersion) fetchData()
  }, [selectedVersion])

  // Fetch versions and set both latestVersion and selectedVersion
  useEffect(() => {
    fetch("/api/versions")
      .then((res) => res.json())
      .then((data) => {
        setVersions(data)
        if (data.length > 0) {
          setLatestVersion(data[0])
          setSelectedVersion(data[0])
        }
      })
      .catch(() => setVersions([]))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Announcement Bar - Shows only on homepage and hides on scroll */}
      <Banner />

      {/* Header */}
      <Header
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        versions={versions}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GRA Core Platform Documentation
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive documentation and guides to help you master GRA Core Platform with our enterprise-grade tools
            and workflows.
          </p>
        </div>

        {/* Documentation Feature Cards (2x3 Grid, Collapsible) */}
        <FeatureCards selectedVersion={selectedVersion} />

        {/* Quick Start Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-16 border border-blue-100 dark:border-blue-800">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Need help getting started?</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Jump right into our comprehensive quick start guide
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/docs/quick-start">
                Quick Start Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* See Also Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">See Also</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seeAlsoLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <div className="group p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p>&copy; 2025 GRA Core Platform. Built with Next.js&nbsp;and&nbsp;MDX.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
