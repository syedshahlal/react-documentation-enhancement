'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { forcedTheme } = props

  React.useEffect(() => {
    if (forcedTheme) {
      document.cookie = `theme=${forcedTheme}; path=/; max-age=31536000`
    }
  }, [forcedTheme])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
