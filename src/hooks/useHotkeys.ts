import { useEffect, useCallback, useRef } from 'react'

export interface HotkeyAction {
  keys: string[]
  description: string
  action: () => void
  category?: string
  enabled?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface HotkeyConfig {
  actions: HotkeyAction[]
  enabled?: boolean
}

interface UseHotkeysOptions {
  enableOnFormElements?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
}

export function useHotkeys(
  config: HotkeyConfig,
  options: UseHotkeysOptions = {}
) {
  const {
    enableOnFormElements = false,
    preventDefault = true,
    stopPropagation = true,
  } = options

  const configRef = useRef(config)
  configRef.current = config

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { actions, enabled = true } = configRef.current

    if (!enabled) return

    // Skip if disabled on form elements
    if (!enableOnFormElements) {
      const target = event.target as HTMLElement
      if (target && target.tagName) {
        const tagName = target.tagName.toLowerCase()
        const isFormElement = ['input', 'textarea', 'select', 'button'].includes(tagName)
        const isContentEditable = target.contentEditable === 'true'
        
        if (isFormElement || isContentEditable) {
          return
        }
      }
    }

    // Create key combination string
    const modifiers: string[] = []
    if (event.ctrlKey || event.metaKey) modifiers.push('mod')
    if (event.altKey) modifiers.push('alt')
    if (event.shiftKey) modifiers.push('shift')
    
    const key = event.key.toLowerCase()
    const combination = [...modifiers, key].join('+')

    // Find matching action
    const matchingAction = actions.find(action => {
      if (action.enabled === false) return false
      
      return action.keys.some(hotkey => {
        const normalizedHotkey = hotkey.toLowerCase().replace(/cmd/g, 'mod')
        return normalizedHotkey === combination || normalizedHotkey === key
      })
    })

    if (matchingAction) {
      if (matchingAction.preventDefault ?? preventDefault) {
        event.preventDefault()
      }
      if (matchingAction.stopPropagation ?? stopPropagation) {
        event.stopPropagation()
      }
      
      matchingAction.action()
    }
  }, [enableOnFormElements, preventDefault, stopPropagation])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    // Helper to get all registered hotkeys
    getHotkeys: () => configRef.current.actions,
    
    // Helper to check if hotkeys are enabled
    isEnabled: () => configRef.current.enabled ?? true,
  }
}

// Utility function to format hotkey display
export function formatHotkey(keys: string[]): string {
  return keys[0]
    .split('+')
    .map(key => {
      switch (key.toLowerCase()) {
        case 'mod':
          return navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'
        case 'alt':
          return navigator.platform.includes('Mac') ? '⌥' : 'Alt'
        case 'shift':
          return '⇧'
        case 'space':
          return 'Space'
        case 'escape':
          return 'Esc'
        case 'enter':
          return '↵'
        case 'tab':
          return '⇥'
        case 'backspace':
          return '⌫'
        case 'delete':
          return '⌦'
        case 'arrowup':
          return '↑'
        case 'arrowdown':
          return '↓'
        case 'arrowleft':
          return '←'
        case 'arrowright':
          return '→'
        default:
          return key.toUpperCase()
      }
    })
    .join(' + ')
}

// Pre-defined hotkey categories
export const HOTKEY_CATEGORIES = {
  TRADING: 'Trading',
  NAVIGATION: 'Navigation',
  GENERAL: 'General',
  HELP: 'Help',
} as const