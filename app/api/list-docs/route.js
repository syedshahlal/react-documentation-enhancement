import fs from "fs";
import path from "path";

export async function GET(req) {
  const url = new URL(req.url, "http://localhost");
  const version = url.searchParams.get("version");
  if (!version) {
    return new Response(JSON.stringify({ files: [] }), { status: 400 });
  }
  const docsDir = path.join(process.cwd(), "docs", version);
  let files = [];
  try {
    const folders = fs.readdirSync(docsDir);
    for (const folder of folders) {
      const folderPath = path.join(docsDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const mdFiles = fs.readdirSync(folderPath)
          .filter((f) => f.endsWith(".md"))
          .map((f) => path.join(version, folder, f));
        files.push(...mdFiles);
      }
    }
  } catch (e) {
    return new Response(JSON.stringify({ files: [] }), { status: 200 });
  }
  return new Response(JSON.stringify({ files }), { status: 200 });
}
