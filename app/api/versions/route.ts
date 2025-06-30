import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    const docsPath = path.join(process.cwd(), "docs")
    const items = await fs.readdir(docsPath, { withFileTypes: true })
    const versions = items
      .filter(item => item.isDirectory() && item.name.startsWith("gcp-"))
      .map(item => item.name)
    return NextResponse.json(versions)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}
