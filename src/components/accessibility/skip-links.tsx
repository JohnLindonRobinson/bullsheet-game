import React from 'react'
import { useSkipLinks } from './focus-manager'

export function SkipLinks() {
  const { skipToContent, skipToNavigation } = useSkipLinks()

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault()
          skipToContent()
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:no-underline"
      >
        Skip to main content
      </a>
      <a
        href="#main-navigation"
        onClick={(e) => {
          e.preventDefault()
          skipToNavigation()
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:no-underline"
      >
        Skip to navigation
      </a>
    </div>
  )
}

// Screen reader only utility class
export function ScreenReaderOnly({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="sr-only" {...props}>
      {children}
    </span>
  )
}