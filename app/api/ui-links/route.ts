// pages/api/ui-links.ts (for pages router)
// or app/api/ui-links/route.ts (for app router, use export { GET } = ...)

import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { slugify } from "@/lib/slugify";

async function buildUiLinkMap(docsRoot: string): Promise<Record<string, string>> {
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
          const key = data.uiLink.replace(/^feature-card:/, "").trim().toLowerCase();
          const slugParts = [...relPath, entry.name.replace(/\.md$/, "")].map(slugify);
          map[key] = "/docs/" + slugParts.join("/");
        }
      }
    }
  }
  await walk(docsRoot);
  return map;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docsRoot = path.join(process.cwd(), "docs");
  const map = await buildUiLinkMap(docsRoot);
  res.status(200).json(map);
}