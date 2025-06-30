export function getThemeFromCookie(cookieHeader?: string): "light" | "dark" | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/theme=(light|dark)/);
  return match ? (match[1] as "light" | "dark") : undefined;
}