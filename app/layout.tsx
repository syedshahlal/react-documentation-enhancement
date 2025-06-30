// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LoadThemeFromCookie } from "@/components/load-theme-from-cookie" // client-side

export const metadata: Metadata = {
  title: "GRA Core Platform Documentation",
  description: "Created with GRA Tech",
  generator: "GRA Tech",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        {/* LoadThemeFromCookie – fine to keep this commented out */}
        {children}
      </ThemeProvider>
    </body>
  </html>

  )
}
