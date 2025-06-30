"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationTab {
  id: string
  title: string
  href: string
  isActive?: boolean
}

export function NavigationTabs() {
  const [tabs, setTabs] = useState<NavigationTab[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await fetch('/api/navigation-tabs')
        if (!response.ok) {
          throw new Error('Failed to fetch navigation tabs')
        }
        const tabsData = await response.json()
        setTabs(tabsData)
      } catch (err) {
        console.error('Error fetching navigation tabs:', err)
        // Fallback to static tabs if API fails
        setTabs([
          { id: "about", title: "About", href: "/", isActive: false },
          { id: "user-guide", title: "User Guide", href: "/docs/user-guide", isActive: false },
          { id: "examples", title: "Examples", href: "/docs/examples", isActive: false },
          { id: "development", title: "Development", href: "/docs/development", isActive: false },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTabs()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center space-x-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-8">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href))
        
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`text-sm font-medium pb-1 transition-colors ${
              isActive
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            {tab.title}
          </Link>
        )
      })}
    </div>
  )
}
