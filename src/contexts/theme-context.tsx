import React, { createContext, useContext, useEffect, useState } from 'react'
import { Theme, themes, ThemeConfig } from '@/lib/design-tokens'

interface ThemeContextType {
  theme: Theme
  themeConfig: ThemeConfig
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDarkMode: boolean
  isHighContrast: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'bullsheet-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme
      if (stored && stored in themes) {
        return stored
      }
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    }
    return defaultTheme
  })

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme)
    }
  }

  const toggleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'highContrast']
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  const themeConfig = themes[theme]
  const isDarkMode = theme === 'dark'
  const isHighContrast = theme === 'highContrast'

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement
    const config = themes[theme]
    
    // Apply theme colors as CSS custom properties
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    // Apply theme class for any additional CSS rules
    root.className = root.className.replace(/theme-\w+/g, '')
    root.classList.add(`theme-${theme}`)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', config.primary)
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(storageKey)
      if (!stored) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [storageKey])

  const value: ThemeContextType = {
    theme,
    themeConfig,
    setTheme,
    toggleTheme,
    isDarkMode,
    isHighContrast
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook for accessing design tokens
export function useDesignTokens() {
  const { themeConfig } = useTheme()
  return {
    colors: themeConfig,
    // Add other design token access as needed
  }
}