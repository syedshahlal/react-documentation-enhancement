import { promises as fs } from "fs"
import path from "path"

interface HomepageSection {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

const COLOR_PALETTE = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-cyan-500", "bg-indigo-500", "bg-pink-500", "bg-teal-500"
]
const ICONS = ["Book", "Users", "Code", "Layers", "Wrench", "Search", "Database", "FileText"]

function folderNameToTitle(folderName: string): string {
  return folderName
    .replace(/^[0-9]+_/, "")
    .replace(/_/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

async function findMainDocument(folderPath: string): Promise<string | null> {
  try {
    const items = await fs.readdir(folderPath, { withFileTypes: true })
    const mdFiles = items.filter(item => item.isFile() && item.name.endsWith(".md"))
    if (mdFiles.length > 0) {
      return mdFiles[0].name.replace(".md", "")
    }
    return null
  } catch (error) {
    return null
  }
}

export async function getHomepageSections(version?: string): Promise<HomepageSection[]> {
  try {
    const docsPath = version
      ? path.join(process.cwd(), "docs", version)
      : path.join(process.cwd(), "docs")
    try {
      await fs.access(docsPath)
    } catch {
      return []
    }
    const items = await fs.readdir(docsPath, { withFileTypes: true })
    const sections: HomepageSection[] = []
    const sortedFolders = items
      .filter(item => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
    for (const [index, folder] of sortedFolders.entries()) {
      const folderPath = path.join(docsPath, folder.name)
      const displayTitle = folderNameToTitle(folder.name)
      const color = COLOR_PALETTE[index % COLOR_PALETTE.length]
      const icon = ICONS[index % ICONS.length]
      const mainDoc = await findMainDocument(folderPath)
      const href = mainDoc
        ? `/docs/${version}/${encodeURIComponent(folder.name)}/${encodeURIComponent(mainDoc)}`
        : `/docs/${version}/${encodeURIComponent(folder.name)}`
      let description = displayTitle
      if (mainDoc) {
        try {
          const fileContent = await fs.readFile(path.join(folderPath, mainDoc + ".md"), "utf-8")
          const lines = fileContent.split("\n").map(l => l.trim()).filter(Boolean)
          if (lines.length > 1) {
            description = lines[1]
          }
        } catch (e) {}
      }
      sections.push({
        title: displayTitle,
        description,
        icon,
        href,
        color,
      })
    }
    return sections
  } catch (error) {
    return []
  }
}
