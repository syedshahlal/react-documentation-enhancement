import fs from "fs/promises";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";

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
