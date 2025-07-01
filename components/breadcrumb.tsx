import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbProps {
  navTab: string // e.g., "Documentation", "User Guide", etc.
  dropdown?: string // e.g., version or section, optional
  slug: string[]
}

export function Breadcrumb({ navTab, dropdown, slug }: BreadcrumbProps) {
  function formatTitle(segment: string) {
    // Remove leading numbers and separators (e.g., 01_, 02-, 03 )
    const cleaned = segment.replace(/^\d+[-_\s]*/, "");
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).replace(/-/g, " ");
  }

  const breadcrumbs = [
    { title: navTab, href: `/docs${dropdown ? `/${dropdown}` : ""}` },
    ...(dropdown ? [{ title: dropdown, href: `/docs/${dropdown}` }] : []),
    ...slug.map((segment, index) => ({
      title: formatTitle(segment),
      href: `/docs${dropdown ? `/${dropdown}` : ""}/${slug.slice(0, index + 1).join("/")}`,
    })),
  ]

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-8">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center space-x-2">
          {index === 0 && <Home className="w-4 h-4" />}
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-slate-900 dark:text-slate-100 font-medium">{crumb.title}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              {crumb.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
