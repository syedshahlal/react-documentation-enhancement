"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function PersistThemeCookie() {
  const { theme } = useTheme()

  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme}; path=/; max-age=31536000` // 1 year
    }
  }, [theme])

  return null
}
