import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHotkeys, formatHotkey, HOTKEY_CATEGORIES } from '../useHotkeys'

describe('useHotkeys', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers keyboard event listener', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    const mockAction = vi.fn()
    
    renderHook(() => useHotkeys({
      actions: [{
        keys: ['b'],
        description: 'Test action',
        action: mockAction,
      }]
    }))
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const mockAction = vi.fn()
    
    const { unmount } = renderHook(() => useHotkeys({
      actions: [{
        keys: ['b'],
        description: 'Test action',
        action: mockAction,
      }]
    }))
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('triggers action on matching key', () => {
    const mockAction = vi.fn()
    
    renderHook(() => useHotkeys({
      actions: [{
        keys: ['b'],
        description: 'Buy action',
        action: mockAction,
      }]
    }))
    
    // Simulate 'b' key press with proper target
    const event = new KeyboardEvent('keydown', { 
      key: 'b',
      bubbles: true 
    })
    Object.defineProperty(event, 'target', { 
      value: document.body, 
      enumerable: true 
    })
    document.dispatchEvent(event)
    
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('handles modifier keys correctly', () => {
    const mockAction = vi.fn()
    
    renderHook(() => useHotkeys({
      actions: [{
        keys: ['mod+k'],
        description: 'Command palette',
        action: mockAction,
      }]
    }))
    
    // Simulate Ctrl+K with proper target
    const event = new KeyboardEvent('keydown', { 
      key: 'k', 
      ctrlKey: true,
      bubbles: true
    })
    Object.defineProperty(event, 'target', { 
      value: document.body, 
      enumerable: true 
    })
    document.dispatchEvent(event)
    
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('ignores disabled actions', () => {
    const mockAction = vi.fn()
    
    renderHook(() => useHotkeys({
      actions: [{
        keys: ['b'],
        description: 'Disabled action',
        action: mockAction,
        enabled: false,
      }]
    }))
    
    const event = new KeyboardEvent('keydown', { key: 'b' })
    document.dispatchEvent(event)
    
    expect(mockAction).not.toHaveBeenCalled()
  })

  it('ignores keys when hotkeys are globally disabled', () => {
    const mockAction = vi.fn()
    
    renderHook(() => useHotkeys({
      actions: [{
        keys: ['b'],
        description: 'Test action',
        action: mockAction,
      }],
      enabled: false,
    }))
    
    const event = new KeyboardEvent('keydown', { key: 'b' })
    document.dispatchEvent(event)
    
    expect(mockAction).not.toHaveBeenCalled()
  })

  it('skips form elements by default', () => {
    const mockAction = vi.fn()
    
    renderHook(() => useHotkeys({
      actions: [{
        keys: ['b'],
        description: 'Test action',
        action: mockAction,
      }]
    }))
    
    // Create input element and dispatch event from it
    const input = document.createElement('input')
    document.body.appendChild(input)
    
    const event = new KeyboardEvent('keydown', { 
      key: 'b',
      bubbles: true 
    })
    Object.defineProperty(event, 'target', { value: input })
    document.dispatchEvent(event)
    
    expect(mockAction).not.toHaveBeenCalled()
    
    document.body.removeChild(input)
  })

  it('allows form elements when enabled', () => {
    const mockAction = vi.fn()
    
    renderHook(() => useHotkeys({
      actions: [{
        keys: ['escape'],
        description: 'Escape action',
        action: mockAction,
      }]
    }, { enableOnFormElements: true }))
    
    const input = document.createElement('input')
    document.body.appendChild(input)
    
    const event = new KeyboardEvent('keydown', { 
      key: 'escape',
      bubbles: true 
    })
    Object.defineProperty(event, 'target', { value: input })
    document.dispatchEvent(event)
    
    expect(mockAction).toHaveBeenCalledTimes(1)
    
    document.body.removeChild(input)
  })

  it('returns helper functions', () => {
    const { result } = renderHook(() => useHotkeys({
      actions: [{
        keys: ['b'],
        description: 'Test action',
        action: vi.fn(),
      }]
    }))
    
    expect(result.current.getHotkeys).toBeDefined()
    expect(result.current.isEnabled).toBeDefined()
    expect(result.current.getHotkeys()).toHaveLength(1)
    expect(result.current.isEnabled()).toBe(true)
  })
})

describe('formatHotkey', () => {
  it('formats simple keys', () => {
    expect(formatHotkey(['b'])).toBe('B')
    expect(formatHotkey(['space'])).toBe('Space')
    expect(formatHotkey(['escape'])).toBe('Esc')
  })

  it('formats modifier combinations', () => {
    expect(formatHotkey(['mod+k'])).toContain('K')
    expect(formatHotkey(['alt+f4'])).toContain('⌥') // Mac version
    expect(formatHotkey(['shift+tab'])).toContain('⇧')
  })

  it('handles platform-specific modifiers', () => {
    const originalPlatform = navigator.platform
    
    // Mock Mac platform
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true
    })
    
    expect(formatHotkey(['mod+k'])).toContain('⌘')
    
    // Mock Windows platform
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true
    })
    
    expect(formatHotkey(['mod+k'])).toContain('Ctrl')
    
    // Restore original
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true
    })
  })
})

describe('HOTKEY_CATEGORIES', () => {
  it('exports predefined categories', () => {
    expect(HOTKEY_CATEGORIES.TRADING).toBe('Trading')
    expect(HOTKEY_CATEGORIES.NAVIGATION).toBe('Navigation')
    expect(HOTKEY_CATEGORIES.GENERAL).toBe('General')
    expect(HOTKEY_CATEGORIES.HELP).toBe('Help')
  })
})