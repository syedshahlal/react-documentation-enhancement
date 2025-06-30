"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { getThemeFromCookie } from "@/lib/getThemeFromCookie"

export function LoadThemeFromCookie() {
  const { setTheme } = useTheme()

  useEffect(() => {
    const cookieHeader = document.cookie
    const theme = getThemeFromCookie(cookieHeader)
    if (theme) setTheme(theme)
  }, [setTheme])

  return null
}
