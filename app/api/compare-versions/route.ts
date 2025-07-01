import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

function getFolderDocs(version: string) {
  const docsPath = path.join(process.cwd(), "docs", version)
  return fs.readdir(docsPath, { withFileTypes: true })
    .then(items => items.filter(i => i.isDirectory()).map(i => i.name))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const v1 = searchParams.get("v1")
  const v2 = searchParams.get("v2")
  if (!v1 || !v2) {
    return NextResponse.json({ error: "Both v1 and v2 are required" }, { status: 400 })
  }
  try {
    const [docs1, docs2] = await Promise.all([
      getFolderDocs(v1),
      getFolderDocs(v2)
    ])
    const added = docs2.filter(x => !docs1.includes(x))
    const removed = docs1.filter(x => !docs2.includes(x))
    const unchanged = docs1.filter(x => docs2.includes(x))
    return NextResponse.json({ added, removed, unchanged })
  } catch (e) {
    return NextResponse.json({ error: "Failed to compare versions" }, { status: 500 })
  }
}
