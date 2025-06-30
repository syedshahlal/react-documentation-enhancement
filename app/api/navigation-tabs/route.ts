import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface NavigationTab {
  id: string
  title: string
  href: string
  isActive?: boolean
}

// Configuration for navigation tabs based on folder structure
const TAB_CONFIG: Record<string, { title: string; priority: number }> = {
  "01_GRA_Core_Platform Introduction": {
    title: "About",
    priority: 1
  },
  "02_User Guide": {
    title: "User Guide", 
    priority: 2
  },
  "04_Examples & Tutorials": {
    title: "Examples",
    priority: 3
  },
  "05_Development Guide": {
    title: "Development",
    priority: 4
  },
  "06_GCP Feature InDepth": {
    title: "GCP Features",
    priority: 5
  }
}

// Function to find the main document in a folder
async function findMainDocument(folderPath: string): Promise<string | null> {
  try {
    const items = await fs.readdir(folderPath, { withFileTypes: true })
    
    // Look for common main document names
    const mainDocNames = ["introduction.md", "index.md", "readme.md", "main.md"]
    
    for (const mainDocName of mainDocNames) {
      const mainDoc = items.find(item => item.isFile() && item.name.toLowerCase() === mainDocName)
      if (mainDoc) {
        return mainDoc.name.replace(".md", "")
      }
    }
    
    // If no main document found, return the first .md file
    const firstMdFile = items.find(item => item.isFile() && item.name.endsWith(".md"))
    return firstMdFile ? firstMdFile.name.replace(".md", "") : null
  } catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error)
    return null
  }
}

export async function GET() {
  try {
    const docsPath = path.join(process.cwd(), "docs")
    
    // Check if docs directory exists
    try {
      await fs.access(docsPath)
    } catch {
      return NextResponse.json([])
    }

    const items = await fs.readdir(docsPath, { withFileTypes: true })
    const tabs: NavigationTab[] = []

    // Sort folders by their numeric prefix
    const sortedFolders = items
      .filter(item => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))

    for (const folder of sortedFolders) {
      const config = TAB_CONFIG[folder.name]
      
      if (config) {
        const folderPath = path.join(docsPath, folder.name)
        const mainDoc = await findMainDocument(folderPath)
        
        // Create the href path
        const href = mainDoc 
          ? `/docs/${folder.name}/${mainDoc}` 
          : `/docs/${folder.name.replace(/^\d+_/, "").replace(/_/g, " ").toLowerCase().replace(/ /g, "-")}`

        tabs.push({
          id: folder.name,
          title: config.title,
          href,
          isActive: false // Will be determined by the client based on current route
        })
      }
    }

    // Sort tabs by priority
    tabs.sort((a, b) => {
      const priorityA = TAB_CONFIG[a.id]?.priority || 999
      const priorityB = TAB_CONFIG[b.id]?.priority || 999
      return priorityA - priorityB
    })

    return NextResponse.json(tabs)
  } catch (error) {
    console.error("Error generating navigation tabs:", error)
    return NextResponse.json({ error: "Failed to read navigation tabs" }, { status: 500 })
  }
}
