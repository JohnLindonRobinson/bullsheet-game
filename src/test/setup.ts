import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment setup
beforeEach(() => {
  // Mock window.crypto for UUID generation
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: vi.fn(() => 'mock-uuid-1234'),
    },
  })

  // Mock canvas and 2D context for chart tests
  const canvasElement = HTMLCanvasElement.prototype
  canvasElement.getContext = vi.fn((contextId) => {
    if (contextId === '2d') {
      return {
        canvas: { width: 800, height: 600 },
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
        putImageData: vi.fn(),
        createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        fillText: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        translate: vi.fn(),
        createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
        setLineDash: vi.fn(),
        measureText: vi.fn(() => ({ width: 100 })),
        rect: vi.fn(),
        clip: vi.fn(),
        transform: vi.fn(),
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        font: '10px sans-serif',
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        lineDashOffset: 0,
        miterLimit: 10,
        shadowBlur: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        textAlign: 'start',
        textBaseline: 'alphabetic',
        direction: 'inherit'
      }
    }
    return null
  }) as any

  // Mock ResizeObserver
  ;(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock requestAnimationFrame
  ;(globalThis as any).requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16))
  ;(globalThis as any).cancelAnimationFrame = vi.fn()

  // Mock local storage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })

  // Mock window.matchMedia for responsive design tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})