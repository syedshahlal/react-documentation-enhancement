"use client"
import { useState, useEffect } from "react"
import FeatureCards from "@/components/feature-cards"
import { Header } from "@/components/header"
import { Banner } from "@/components/banner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import VersionCompare from "@/components/VersionCompare"

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

const LazyExample = dynamic(() => import("@/components/LazyExample"), { ssr: false, loading: () => <div>Loading...</div> })

interface HomeClientProps {
  initialSections: HomepageSection[]
  initialSeeAlso: SeeAlsoLink[]
  versions: string[]
  initialVersion: string
}

export default function HomeClient({ initialSections, initialSeeAlso, versions, initialVersion }: HomeClientProps) {
  const [selectedVersion, setSelectedVersion] = useState(initialVersion)
  const [documentationSections, setDocumentationSections] = useState(initialSections)
  const [seeAlsoLinks, setSeeAlsoLinks] = useState(initialSeeAlso)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedVersion === initialVersion) return
    setLoading(true)
    setError(null)
    Promise.all([
      fetch(`/api/homepage-sections?version=${selectedVersion}`).then(r => r.json()),
      fetch(`/api/see-also-links?version=${selectedVersion}`).then(r => r.json())
    ])
      .then(([sections, links]) => {
        setDocumentationSections(sections)
        setSeeAlsoLinks(links)
      })
      .catch(err => setError("Failed to fetch data"))
      .finally(() => setLoading(false))
  }, [selectedVersion, initialVersion])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Banner />
      <Header
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        versions={versions}
      />
      <main className="container mx-auto px-4 py-12 pt-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GRA Core Platform Documentation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive documentation and guides to help you master GRA Core Platform with our enterprise-grade tools
            and workflows.
          </p>
        </div>
        <FeatureCards selectedVersion={selectedVersion} />
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
        <div className="border-t border-slate-200 dark:border-slate-700 pt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">See Also</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seeAlsoLinks.map((link: SeeAlsoLink, index: number) => (
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
        <VersionCompare versions={versions} />
        <LazyExample />
        {loading && <div className="mt-8 text-center text-blue-500">Loading...</div>}
        {error && <div className="mt-8 text-center text-red-500">{error}</div>}
      </main>
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
