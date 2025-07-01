import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const docId = searchParams.get("docId")
  const version = searchParams.get("version")
  if (!docId || !version) {
    return NextResponse.json({ error: "docId and version are required" }, { status: 400 })
  }
  try {
    // Assume docId is the folder and file name, e.g. '01_GRA_Core_Platform_Introduction/intro'
    const [folder, file] = docId.split("/")
    const filePath = path.join(process.cwd(), "docs", version, folder, `${file}.md`)
    const content = await fs.readFile(filePath, "utf-8")
    return NextResponse.json({ content })
  } catch (e) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }
}
