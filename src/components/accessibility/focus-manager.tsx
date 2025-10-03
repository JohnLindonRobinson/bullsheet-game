import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

interface FocusManagerContextType {
  trapFocus: (container: HTMLElement) => () => void
  restoreFocus: (element?: HTMLElement) => void
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
  isKeyboardNavigation: boolean
}

const FocusManagerContext = createContext<FocusManagerContextType | undefined>(undefined)

interface FocusManagerProps {
  children: React.ReactNode
}

export function FocusManager({ children }: FocusManagerProps) {
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)
  const announcementAreaRef = useRef<HTMLDivElement | null>(null)

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardNavigation(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Create screen reader announcement area
  useEffect(() => {
    const announcementArea = document.createElement('div')
    announcementArea.setAttribute('aria-live', 'polite')
    announcementArea.setAttribute('aria-atomic', 'true')
    announcementArea.style.position = 'absolute'
    announcementArea.style.left = '-10000px'
    announcementArea.style.width = '1px'
    announcementArea.style.height = '1px'
    announcementArea.style.overflow = 'hidden'
    
    document.body.appendChild(announcementArea)
    announcementAreaRef.current = announcementArea

    return () => {
      if (announcementArea.parentNode) {
        announcementArea.parentNode.removeChild(announcementArea)
      }
    }
  }, [])

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Store the previously focused element
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement

    // Focus the first element
    if (firstElement) {
      firstElement.focus()
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        restoreFocus()
      }
    }

    container.addEventListener('keydown', handleTabKey)
    container.addEventListener('keydown', handleEscapeKey)

    return () => {
      container.removeEventListener('keydown', handleTabKey)
      container.removeEventListener('keydown', handleEscapeKey)
    }
  }

  const restoreFocus = (element?: HTMLElement) => {
    const elementToFocus = element || previouslyFocusedElementRef.current
    if (elementToFocus && elementToFocus.focus) {
      elementToFocus.focus()
    }
    previouslyFocusedElementRef.current = null
  }

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementAreaRef.current) return

    const announcement = announcementAreaRef.current
    announcement.setAttribute('aria-live', priority)
    announcement.textContent = message

    // Clear the message after a delay to allow for repeated announcements
    setTimeout(() => {
      announcement.textContent = ''
    }, 1000)
  }

  const value: FocusManagerContextType = {
    trapFocus,
    restoreFocus,
    announceToScreenReader,
    isKeyboardNavigation
  }

  return (
    <FocusManagerContext.Provider value={value}>
      <div className={isKeyboardNavigation ? 'keyboard-navigation' : ''}>
        {children}
      </div>
    </FocusManagerContext.Provider>
  )
}

export function useFocusManager() {
  const context = useContext(FocusManagerContext)
  if (context === undefined) {
    throw new Error('useFocusManager must be used within a FocusManager')
  }
  return context
}

// Custom hook for skip links
export function useSkipLinks() {
  const skipToContent = () => {
    const content = document.getElementById('main-content')
    if (content) {
      content.focus()
      content.scrollIntoView()
    }
  }

  const skipToNavigation = () => {
    const nav = document.getElementById('main-navigation')
    if (nav) {
      nav.focus()
      nav.scrollIntoView()
    }
  }

  return { skipToContent, skipToNavigation }
}