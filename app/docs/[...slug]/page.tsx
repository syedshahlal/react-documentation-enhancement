import { notFound } from "next/navigation"
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { Sidebar } from "@/components/sidebar"
import { DocContent } from "@/components/doc-content"
import { Breadcrumb } from "@/components/breadcrumb"
import { PageNavigation } from "@/components/page-navigation"
import { TableOfContents } from "@/components/table-of-contents"
import { Header } from "@/components/header"
import { slugify } from "@/lib/slugify"
import ClientHeaderWrapper from "@/components/ClientHeaderWrapper"

// --- Navigation order (used for prev/next)
const navigationOrder = [
  { slug: "introduction", title: "Introduction to GRA Core Platform" },
  { slug: "user-guide", title: "User Guide" },
  { slug: "api-reference", title: "API Reference" },
  { slug: "examples", title: "Examples & Tutorials" },
  { slug: "development", title: "Development Guide" },
  { slug: "architecture", title: "Platform Architecture" },
]

// --- Match .md file path from slug
const findMatchingFilePath = async (slugParts: string[]): Promise<string | null> => {
  const baseDir = path.join(process.cwd(), "docs");
  let currentDir = baseDir;

  for (const part of slugParts.slice(0, -1)) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    // Always match by slugified name, but use the real name for the path
    const match = entries.find(
      (e) => e.isDirectory() && slugify(e.name) === part
    );
    if (!match) {
      // Optionally log for debugging:
      // console.warn(`Directory not found for slug: ${part} in ${currentDir}`);
      return null;
    }
    currentDir = path.join(currentDir, match.name);
  }

  const finalEntries = await fs.readdir(currentDir, { withFileTypes: true });
  const fileMatch = finalEntries.find(
    (f) =>
      f.isFile() &&
      f.name.toLowerCase().endsWith(".md") &&
      slugify(f.name.replace(/\.md$/, "")) === slugify(slugParts.at(-1)!)
  );

  return fileMatch ? path.join(currentDir, fileMatch.name) : null;
}

// --- Helper: resolve feature-card reference to URL
function resolveFeatureCardLink(sectionId: string, selectedVersion: string, folderTree: any[]): { href: string, title: string } | null {
  const sectionSlugMap: Record<string, string> = {
    "platform-introduction": slugify("01_GRA_Core_Platform Introduction"),
    "user-guide": slugify("02_User Guide"),
    "api-reference": slugify("03_API Reference"),
    "examples-tutorials": slugify("04_Examples & Tutorials"),
    "development-guide": slugify("05_Development Guide"),
    "gcp-feature-in-depth": slugify("06_GCP Feature InDepth"),
  }
  const sectionTitleMap: Record<string, string> = {
    "platform-introduction": "GRA Core Platform Introduction",
    "user-guide": "User Guide",
    "api-reference": "API Reference",
    "examples-tutorials": "Examples & Tutorials",
    "development-guide": "Development Guide",
    "gcp-feature-in-depth": "GCP Feature In-Depth",
  }
  function findFirstFileSlug(node: any, parentSlugs: string[] = []): string[] | null {
    if (!node) return null
    if (node.type === "file") {
      return [...parentSlugs, slugify(node.name.replace(/\.md$/, ""))]
    }
    if (node.type === "folder" && node.children) {
      for (const child of node.children) {
        const found = findFirstFileSlug(child, [...parentSlugs, slugify(node.name)])
        if (found) return found
      }
    }
    return null
  }
  function findFolderNodeBySlug(nodes: any[], slug: string) {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      if (node.type === "folder" && slugify(node.name) === slug) return node
    }
    return null
  }
  const folderSlug = sectionSlugMap[sectionId]
  if (!folderSlug) return null
  const folderNode = findFolderNodeBySlug(folderTree, folderSlug)
  if (!folderNode) return null
  const fileSlugArr = findFirstFileSlug(folderNode, [folderSlug])
  if (!fileSlugArr) return null
  return { href: `/docs/${selectedVersion}/${fileSlugArr.join("/")}`, title: sectionTitleMap[sectionId] || sectionId }
}

// --- Load .md content and parse frontmatter (with next/prev/uiLink logic)
const getDocContent = async (slug: string[], folderTree: any[], selectedVersion: string) => {
  const filePath = await findMatchingFilePath(slug)
  if (!filePath) return null
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const stats = await fs.stat(filePath)
    const { content, data } = matter(raw)
    const title = data.title || content.match(/^#\s+(.+)$/m)?.[1]?.trim() || slug[slug.length - 1]
    const processed = await remark().use(html).process(content)
    // Resolve next/prev links
    let nextPage: { href: string, title: string } | null = null
    let previousPage: { href: string, title: string } | null = null
    let uiLink: { href: string, title: string } | null = null
    if (data.next) {
      if (typeof data.next === "string" && data.next.startsWith("feature-card:")) {
        nextPage = resolveFeatureCardLink(data.next.replace("feature-card:", ""), selectedVersion, folderTree)
      } else if (typeof data.next === "string") {
        nextPage = { href: data.next, title: "Next" }
      }
    }
    if (data.prev) {
      if (typeof data.prev === "string" && data.prev.startsWith("feature-card:")) {
        previousPage = resolveFeatureCardLink(data.prev.replace("feature-card:", ""), selectedVersion, folderTree)
      } else if (typeof data.prev === "string") {
        previousPage = { href: data.prev, title: "Previous" }
      }
    }
    if (data.uiLink && typeof data.uiLink === "string" && data.uiLink.startsWith("feature-card:")) {
      uiLink = resolveFeatureCardLink(data.uiLink.replace("feature-card:", ""), selectedVersion, folderTree)
    } else if (data.uiLink && typeof data.uiLink === "string") {
      uiLink = { href: data.uiLink, title: "UI Link" }
    }
    return {
      title,
      content: processed.toString(),
      lastUpdated: stats.mtime.toISOString().split("T")[0],
      nextPage,
      previousPage,
      uiLink, // available for use, not rendered in markdown
    }
  } catch {
    return null
  }
}

// --- Recursively walk all .md files in a version, preserving order
async function getAllMarkdownSlugs(version: string) {
  const docsDir = path.join(process.cwd(), "docs", version)
  async function walk(dir: string, parentSlugs: string[] = []): Promise<{ slug: string[]; title: string; filePath: string }[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    let files: { slug: string[]; title: string; filePath: string }[] = []
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await walk(fullPath, [...parentSlugs, slugify(entry.name)])))
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push({
          slug: [...parentSlugs, slugify(entry.name.replace(/\.md$/, ""))],
          title: entry.name.replace(/\.md$/, ""),
          filePath: fullPath,
        })
      }
    }
    return files
  }
  return walk(docsDir, [version])
}

// --- Prev/Next Navigation (chronological by file order)
async function getPageNavigationChronological(slug: string[]) {
  const version = slug[0]
  const allFiles = await getAllMarkdownSlugs(version)
  const currentIdx = allFiles.findIndex((f) => f.slug.join("/") === slug.join("/"))
  if (currentIdx === -1) return { previousPage: null, nextPage: null }
  const previousPage =
    currentIdx > 0
      ? {
          title: allFiles[currentIdx - 1].title,
          href: `/docs/${allFiles[currentIdx - 1].slug.join("/")}`,
        }
      : null
  const nextPage =
    currentIdx < allFiles.length - 1
      ? {
          title: allFiles[currentIdx + 1].title,
          href: `/docs/${allFiles[currentIdx + 1].slug.join("/")}`,
        }
      : null

  return { previousPage, nextPage }
}

// --- Main Page
export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  // Get all available versions (folders in /docs)
  const docsDir = path.join(process.cwd(), "docs")
  const versionDirs = (await fs.readdir(docsDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
  const selectedVersion = slug[0]
  const versionRoot = path.join(docsDir, selectedVersion)
  const folderTree = await getFolderTree(versionRoot)
  const doc = await getDocContent(slug, folderTree, selectedVersion)
  if (!doc) notFound()

  // Get folder tree for the selected version
  async function getFolderTree(dir: string): Promise<any> {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          return {
            name: entry.name,
            type: "folder",
            children: await getFolderTree(fullPath),
          }
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          return {
            name: entry.name,
            type: "file",
          }
        }
        return null
      })
    ).then((children) => children.filter(Boolean))
  }
  const { previousPage: autoPrev, nextPage: autoNext } = await getPageNavigationChronological(slug)
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <ClientHeaderWrapper
        selectedVersion={selectedVersion}
        versions={versionDirs}
        slug={slug}
      />
      <div className="flex">
        {/* Sidebar: pass folderTree as prop */}
        <div className="fixed left-0 top-30 bottom-0 w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto pt-20">
          <Sidebar folderTree={folderTree} version={selectedVersion} />
        </div>
        {/* Main Content */}
        <main className="flex-1 ml-80 mr-80">
          <div className="max-w-none px-8 py-6">
            <Breadcrumb slug={slug} />
            <div className="mt-6">
              <DocContent title={doc.title} content={doc.content} lastUpdated={doc.lastUpdated} />
              <PageNavigation previousPage={doc.previousPage ?? autoPrev ?? undefined} nextPage={doc.nextPage ?? autoNext ?? undefined} />
            </div>
          </div>
        </main>
        {/* TOC */}
        <div className="fixed right-0 top-0 bottom-0 w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto pt-20">
          <div className="p-6">
            <TableOfContents key={slug.join("-")} content={doc.content} />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Static Paths
export async function generateStaticParams() {
  const docsDir = path.join(process.cwd(), "docs")

  async function walk(dir: string): Promise<string[][]> {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const paths: string[][] = []

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const nested = await walk(fullPath)
        paths.push(...(nested as string[][]))
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const relativePath = path.relative(docsDir, fullPath).replace(/\.md$/, "")
        const slugParts = relativePath.split(path.sep).map(slugify)
        paths.push(slugParts as string[])
      }
    }

    return paths
  }

  const allSlugs = await walk(docsDir)
  return allSlugs.map((slugArr) => ({ slug: slugArr }))
}