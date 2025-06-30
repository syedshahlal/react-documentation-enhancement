import { promises as fs } from "fs"
import path from "path"

export interface SlugMapping {
  urlSlug: string
  folderName: string
  fileName?: string
}

// Create a mapping between URL-friendly slugs and actual folder/file names
export async function createSlugMapping(): Promise<SlugMapping[]> {
  const mappings: SlugMapping[] = []
  const docsPath = path.join(process.cwd(), "docs")
  
  try {
    await fs.access(docsPath)
  } catch {
    return mappings
  }

  try {
    const items = await fs.readdir(docsPath, { withFileTypes: true })
    
    for (const item of items) {
      if (item.isDirectory()) {
        const folderPath = path.join(docsPath, item.name)
        
        // Create URL-safe slug from folder name
        const folderSlug = item.name
          .replace(/^\d+_/, "") // Remove number prefix
          .replace(/_/g, "-")   // Replace underscores with hyphens
          .toLowerCase()        // Convert to lowercase
          .replace(/\s+/g, "-") // Replace spaces with hyphens
        
        // Add folder mapping
        mappings.push({
          urlSlug: folderSlug,
          folderName: item.name
        })
        
        // Get files in the folder
        try {
          const files = await fs.readdir(folderPath, { withFileTypes: true })
          
          for (const file of files) {
            if (file.isFile() && file.name.endsWith('.md')) {
              const fileSlug = file.name
                .replace(/\.md$/, "")  // Remove .md extension
                .replace(/\s+/g, "-")  // Replace spaces with hyphens
                .toLowerCase()         // Convert to lowercase
              
              mappings.push({
                urlSlug: `${folderSlug}/${fileSlug}`,
                folderName: item.name,
                fileName: file.name.replace(/\.md$/, "")
              })
            }
          }
        } catch (error) {
          console.error(`Error reading files in ${folderPath}:`, error)
        }
      }
    }
  } catch (error) {
    console.error("Error creating slug mapping:", error)
  }
  
  return mappings
}

// Find the actual file path from a URL slug
export async function resolveSlugToPath(slug: string[]): Promise<{ folderName: string; fileName?: string } | null> {
  const mappings = await createSlugMapping()
  const urlSlug = slug.join('/')
  
  // Find exact match first
  const exactMatch = mappings.find(mapping => mapping.urlSlug === urlSlug)
  if (exactMatch) {
    return {
      folderName: exactMatch.folderName,
      fileName: exactMatch.fileName
    }
  }
  
  // If no exact match, try to find folder match
  const folderMatch = mappings.find(mapping => 
    mapping.urlSlug === slug[0] && !mapping.fileName
  )
  
  if (folderMatch) {
    // Look for a default file in the folder
    const docsPath = path.join(process.cwd(), "docs", folderMatch.folderName)
    try {
      const files = await fs.readdir(docsPath, { withFileTypes: true })
      const defaultFiles = ["introduction.md", "index.md", "readme.md", "main.md"]
      
      for (const defaultFile of defaultFiles) {
        if (files.some(f => f.name.toLowerCase() === defaultFile)) {
          return {
            folderName: folderMatch.folderName,
            fileName: defaultFile.replace(/\.md$/, "")
          }
        }
      }
      
      // If no default file, return the first .md file
      const firstMdFile = files.find(f => f.isFile() && f.name.endsWith('.md'))
      if (firstMdFile) {
        return {
          folderName: folderMatch.folderName,
          fileName: firstMdFile.name.replace(/\.md$/, "")
        }
      }
    } catch (error) {
      console.error(`Error reading folder ${docsPath}:`, error)
    }
  }
  
  return null
}
