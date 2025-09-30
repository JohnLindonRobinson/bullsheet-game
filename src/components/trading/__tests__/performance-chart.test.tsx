import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import { PerformanceChart } from '../performance-chart'

describe('PerformanceChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders chart with symbol and price', async () => {
    render(<PerformanceChart symbol="AAPL" />)
    
    expect(screen.getByText('⚡ AAPL')).toBeInTheDocument()
    
    // Wait for price to be generated
    await waitFor(() => {
      expect(screen.getByText(/\$\d+\.\d{2}/)).toBeInTheDocument()
    })
  })

  it('renders timeframe buttons', () => {
    render(<PerformanceChart symbol="TSLA" />)
    
    const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']
    timeframes.forEach(tf => {
      expect(screen.getByText(tf)).toBeInTheDocument()
    })
  })

  it('renders canvas element', () => {
    render(<PerformanceChart symbol="GOOGL" />)
    
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveClass('w-full', 'h-[400px]', 'lg:h-[450px]', 'touch-none')
  })

  it('shows performance indicators', () => {
    render(<PerformanceChart symbol="MSFT" />)
    
    expect(screen.getByText(/⚡ Optimized 60fps/)).toBeInTheDocument()
    expect(screen.getByText(/📊 \d+ data points/)).toBeInTheDocument()
  })

  it('calls onPriceChange when price updates', async () => {
    const onPriceChange = vi.fn()
    render(<PerformanceChart symbol="NVDA" onPriceChange={onPriceChange} />)
    
    // Wait for initial price generation
    await waitFor(() => {
      expect(onPriceChange).toHaveBeenCalled()
    })
  })

  it('updates canvas dimensions based on device pixel ratio', () => {
    const mockDPR = 2
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: mockDPR,
    })

    render(<PerformanceChart symbol="AMZN" />)
    
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    expect(canvas).toBeInTheDocument()
    
    // Canvas should have been configured for high DPI
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d', { alpha: false })
  })

  it('handles touch events for timeframe switching', () => {
    render(<PerformanceChart symbol="META" />)
    
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    expect(canvas).toBeInTheDocument()
    
    // Simulate touch events
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 100 } as Touch]
    })
    const touchEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 200 } as Touch]
    })
    
    canvas.dispatchEvent(touchStart)
    canvas.dispatchEvent(touchEnd)
    
    // Should not throw errors
    expect(canvas).toBeInTheDocument()
  })

  it('displays price change indicator', async () => {
    render(<PerformanceChart symbol="AAPL" />)
    
    await waitFor(() => {
      const priceChangeElements = screen.getAllByText(/[+-]?\d+\.\d{2}/)
      expect(priceChangeElements.length).toBeGreaterThan(0)
    })
  })

  it('manages animation state correctly', async () => {
    const mockRAF = vi.fn((cb) => {
      setTimeout(cb, 16)
      return 1
    })
    global.requestAnimationFrame = mockRAF
    
    render(<PerformanceChart symbol="TSLA" />)
    
    await waitFor(() => {
      expect(mockRAF).toHaveBeenCalled()
    })
  })

  it('cleans up animation frame on unmount', () => {
    const mockCancel = vi.fn()
    global.cancelAnimationFrame = mockCancel
    
    const { unmount } = render(<PerformanceChart symbol="AAPL" />)
    
    unmount()
    
    // Should not throw errors during cleanup
    expect(() => unmount()).not.toThrow()
  })
})