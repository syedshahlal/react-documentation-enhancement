"use client"

import { useEffect, useState, useMemo } from "react"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string // HTML string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  // Memoize TOC extraction to avoid re-parsing on every render
  const toc = useMemo(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headings: TocItem[] = []
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) => {
      const level = parseInt(el.tagName[1])
      const title = el.textContent || ""
      const id = el.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      headings.push({ id, title, level })
    })
    return headings
  }, [content])

  useEffect(() => {
    if (toc.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%" },
    )
    const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headingElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  return (
    <div>
      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">On this page</h4>
      <nav>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors",
                  item.level === 1 && "font-medium",
                  item.level === 2 && "pl-4",
                  item.level === 3 && "pl-8",
                  item.level >= 4 && "pl-12",
                  activeId === item.id && "text-blue-600 dark:text-blue-400 font-medium",
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
