import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface SeeAlsoLink {
  title: string
  href: string
}

// Function to find specific important documents
async function findImportantDocs(docsPath: string): Promise<SeeAlsoLink[]> {
  const links: SeeAlsoLink[] = []
  
  try {
    // Look for Getting Started guide in the Introduction folder
    const introFolder = path.join(docsPath, "01_GRA_Core_Platform Introduction")
    try {
      await fs.access(introFolder)
      const introItems = await fs.readdir(introFolder, { withFileTypes: true })
      const introDoc = introItems.find(item => item.isFile() && item.name.endsWith(".md"))
      if (introDoc) {
        links.push({
          title: "Getting Started",
          href: `/docs/${path.basename(docsPath)}/01_GRA_Core_Platform%20Introduction/${encodeURIComponent(introDoc.name.replace(".md", ""))}`
        })
      }
    } catch {
      // Skip if folder doesn't exist
    }

    // Look for API Reference
    const apiFolder = path.join(docsPath, "03_API Reference")
    try {
      await fs.access(apiFolder)
      const apiItems = await fs.readdir(apiFolder, { withFileTypes: true })
      const apiDoc = apiItems.find(item => item.isFile() && item.name.endsWith(".md"))
      if (apiDoc) {
        links.push({
          title: "API Reference",
          href: `/docs/${path.basename(docsPath)}/03_API%20Reference/${encodeURIComponent(apiDoc.name.replace(".md", ""))}`
        })
      }
    } catch {
      // Skip if folder doesn't exist
    }

    // Look for Examples
    const examplesFolder = path.join(docsPath, "04_Examples & Tutorials")
    try {
      await fs.access(examplesFolder)
      const exampleItems = await fs.readdir(examplesFolder, { withFileTypes: true })
      const exampleDoc = exampleItems.find(item => item.isFile() && item.name.endsWith(".md"))
      if (exampleDoc) {
        links.push({
          title: "Examples & Tutorials",
          href: `/docs/${path.basename(docsPath)}/04_Examples%20%26%20Tutorials/${encodeURIComponent(exampleDoc.name.replace(".md", ""))}`
        })
      }
    } catch {
      // Skip if folder doesn't exist
    }

    // Add Development Guide if available
    const devFolder = path.join(docsPath, "05_Development Guide")
    try {
      await fs.access(devFolder)
      const devItems = await fs.readdir(devFolder, { withFileTypes: true })
      const devDoc = devItems.find(item => item.isFile() && item.name.endsWith(".md"))
      if (devDoc) {
        links.push({
          title: "Development Guide",
          href: `/docs/${path.basename(docsPath)}/05_Development%20Guide/${encodeURIComponent(devDoc.name.replace(".md", ""))}`
        })
      }
    } catch {
      // Skip if folder doesn't exist
    }

    // If no links found, return fallback
    if (links.length === 0) {
      return [
        { title: "Getting Started", href: "/docs/getting-started" },
        { title: "API Reference", href: "/docs/api" },
        { title: "Examples", href: "/docs/examples" },
      ]
    }

    return links
  } catch (error) {
    console.error("Error finding important docs:", error)
    // Return fallback links on error
    return [
      { title: "Getting Started", href: "/docs/getting-started" },
      { title: "API Reference", href: "/docs/api" },
      { title: "Examples", href: "/docs/examples" },
    ]
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const version = searchParams.get("version")
    const docsPath = version
      ? path.join(process.cwd(), "docs", version)
      : path.join(process.cwd(), "docs")
    try {
      await fs.access(docsPath)
    } catch {
      // Fallback links if docs directory doesn't exist
      return NextResponse.json([
        { title: "Getting Started", href: "/docs/getting-started" },
        { title: "API Reference", href: "/docs/api" },
        { title: "Changelog", href: "/docs/changelog" },
      ])
    }

    const links = await findImportantDocs(docsPath)
    return NextResponse.json(links, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600"
      }
    })
  } catch (error) {
    console.error("Error generating see-also links:", error)
    return NextResponse.json({ error: "Failed to read see-also links" }, { status: 500 })
  }
}
