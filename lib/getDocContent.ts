import fs from "fs/promises";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";
import { slugify } from "@/lib/slugify";

export async function getDocContent(slugParts: string[]) {
  const docsPath = path.join(process.cwd(), "docs", ...slugParts) + ".md";

  try {
    const file = await fs.readFile(docsPath, "utf8");
    const { content, data } = matter(file);
    const processed = await remark().use(html).process(content);
    return {
      title: data.title || slugParts.at(-1),
      html: processed.toString(),
    };
  } catch (err) {
    console.error("File not found:", docsPath);
    return null;
  }
}

// Utility: Recursively scan all .md files and build a map of uiLink -> doc path
export async function buildUiLinkMap(docsRoot: string): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  async function walk(dir: string, relPath: string[] = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, [...relPath, entry.name]);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const file = await fs.readFile(fullPath, "utf8");
        const { data } = matter(file);
        if (data.uiLink && typeof data.uiLink === "string") {
          // Normalize: only use the part after 'feature-card:' if present
          const key = data.uiLink.startsWith("feature-card:")
            ? data.uiLink.replace("feature-card:", "").trim().toLowerCase()
            : data.uiLink.trim().toLowerCase();
          // Build slug path for this doc
          const slugParts = [...relPath, entry.name.replace(/\.md$/, "")].map(slugify);
          map[key] = "/docs/" + slugParts.join("/");
        }
      }
    }
  }
  await walk(docsRoot);
  return map;
}
