// lib/slugify.ts
export function slugify(input: string): string {
  return input
    .replace(/_/g, " ")            // turn _ into space (optional)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")          // replace spaces with -
}
