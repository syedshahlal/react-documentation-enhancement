import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface HomepageSection {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

// Utility to generate a color and icon based on index (for dynamic assignment)
const COLOR_PALETTE = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-cyan-500", "bg-indigo-500", "bg-pink-500", "bg-teal-500"
]
const ICONS = ["Book", "Users", "Code", "Layers", "Wrench", "Search", "Database", "FileText"]

// Function to convert folder name to display title
function folderNameToTitle(folderName: string): string {
  // Remove number prefix and convert to title case
  return folderName
    .replace(/^[0-9]+_/, "") // Remove number prefix like "01_"
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Function to find the main document in a folder
async function findMainDocument(folderPath: string): Promise<string | null> {
  try {
    const items = await fs.readdir(folderPath, { withFileTypes: true })
    // Prefer the first .md file alphabetically
    const mdFiles = items.filter(item => item.isFile() && item.name.endsWith(".md"))
    if (mdFiles.length > 0) {
      return mdFiles[0].name.replace(".md", "")
    }
    return null
  } catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const version = searchParams.get("version")
    const docsPath = version
      ? path.join(process.cwd(), "docs", version)
      : path.join(process.cwd(), "docs")

    // Check if docs directory exists
    try {
      await fs.access(docsPath)
    } catch {
      return NextResponse.json([])
    }

    const items = await fs.readdir(docsPath, { withFileTypes: true })
    const sections: HomepageSection[] = []

    // Sort folders by their numeric prefix
    const sortedFolders = items
      .filter(item => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))

    for (const [index, folder] of sortedFolders.entries()) {
      const folderPath = path.join(docsPath, folder.name)
      const displayTitle = folderNameToTitle(folder.name)
      // Dynamically generate color and icon
      const color = COLOR_PALETTE[index % COLOR_PALETTE.length]
      const icon = ICONS[index % ICONS.length]
      // Find the main document in the folder
      const mainDoc = await findMainDocument(folderPath)
      // Create the href path with URL-safe slugs (use folder name as-is for versioned docs)
      const href = mainDoc 
        ? `/docs/${version}/${encodeURIComponent(folder.name)}/${encodeURIComponent(mainDoc)}` 
        : `/docs/${version}/${encodeURIComponent(folder.name)}`
      // Use the first .md file's name (without extension) as the description if available, else fallback
      let description = displayTitle
      if (mainDoc) {
        try {
          const fileContent = await fs.readFile(path.join(folderPath, mainDoc + ".md"), "utf-8")
          // Try to extract the first non-empty line after the title as description
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

    return NextResponse.json(sections)
  } catch (error) {
    console.error("Error in GET /api/homepage-docs:", error)
    return NextResponse.json([], { status: 500 })
  }
}
