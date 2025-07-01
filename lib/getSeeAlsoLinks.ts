import { promises as fs } from "fs"
import path from "path"

interface SeeAlsoLink {
  title: string
  href: string
}

export async function getSeeAlsoLinks(version?: string): Promise<SeeAlsoLink[]> {
  const links: SeeAlsoLink[] = []
  try {
    const docsPath = version
      ? path.join(process.cwd(), "docs", version)
      : path.join(process.cwd(), "docs")
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
    } catch {}
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
    } catch {}
    // Add more important docs as needed
    return links
  } catch (error) {
    return []
  }
}
