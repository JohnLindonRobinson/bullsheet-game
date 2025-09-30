import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PerformanceChartProps {
  symbol: string
  onPriceChange?: (price: number) => void
}

interface ChartPoint {
  x: number
  y: number
  price: number
  timestamp: number
}

export function PerformanceChart({ symbol, onPriceChange }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)
  const chartContextRef = useRef<CanvasRenderingContext2D | null>(null)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const offscreenContextRef = useRef<CanvasRenderingContext2D | null>(null)
  
  const [currentPrice, setCurrentPrice] = useState(150.00)
  const [priceChange, setPriceChange] = useState(2.50)
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const [timeframe, setTimeframe] = useState('1D')
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Memoized chart points to avoid recalculation
  const chartPoints = useMemo((): ChartPoint[] => {
    if (priceHistory.length === 0) return []
    
    const canvas = canvasRef.current
    if (!canvas) return []
    
    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const padding = 20
    
    const minPrice = Math.min(...priceHistory)
    const maxPrice = Math.max(...priceHistory)
    const priceRange = maxPrice - minPrice || 1
    
    return priceHistory.map((price, index) => ({
      x: padding + (index * (width - 2 * padding)) / (priceHistory.length - 1),
      y: height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding),
      price,
      timestamp: Date.now() - (priceHistory.length - 1 - index) * 2000
    }))
  }, [priceHistory])
  
  // Optimized drawing function using requestAnimationFrame
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = chartContextRef.current
    const offscreenCanvas = offscreenCanvasRef.current
    const offscreenCtx = offscreenContextRef.current
    
    if (!canvas || !ctx || !offscreenCanvas || !offscreenCtx || chartPoints.length === 0) {
      return
    }
    
    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const padding = 20
    
    // Clear offscreen canvas
    offscreenCtx.clearRect(0, 0, width, height)
    
    // Draw background
    offscreenCtx.fillStyle = '#FDFCF7'
    offscreenCtx.fillRect(0, 0, width, height)
    
    // Draw optimized grid (fewer lines)
    offscreenCtx.strokeStyle = '#E3EAF2'
    offscreenCtx.lineWidth = 0.5
    offscreenCtx.beginPath()
    
    // Horizontal grid lines
    for (let i = 0; i <= 3; i++) {
      const y = padding + (i * (height - 2 * padding)) / 3
      offscreenCtx.moveTo(padding, y)
      offscreenCtx.lineTo(width - padding, y)
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i * (width - 2 * padding)) / 4
      offscreenCtx.moveTo(x, padding)
      offscreenCtx.lineTo(x, height - padding)
    }
    
    offscreenCtx.stroke()
    
    // Draw area fill with gradient
    if (chartPoints.length > 1) {
      const gradient = offscreenCtx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgba(76, 175, 80, 0.2)')
      gradient.addColorStop(1, 'rgba(76, 175, 80, 0.0)')
      
      offscreenCtx.fillStyle = gradient
      offscreenCtx.beginPath()
      
      // Start from bottom left
      offscreenCtx.moveTo(chartPoints[0].x, height - padding)
      offscreenCtx.lineTo(chartPoints[0].x, chartPoints[0].y)
      
      // Draw the price line
      for (let i = 1; i < chartPoints.length; i++) {
        offscreenCtx.lineTo(chartPoints[i].x, chartPoints[i].y)
      }
      
      // Close the area
      offscreenCtx.lineTo(chartPoints[chartPoints.length - 1].x, height - padding)
      offscreenCtx.closePath()
      offscreenCtx.fill()
      
      // Draw price line
      offscreenCtx.strokeStyle = '#4CAF50'
      offscreenCtx.lineWidth = 2
      offscreenCtx.beginPath()
      
      offscreenCtx.moveTo(chartPoints[0].x, chartPoints[0].y)
      for (let i = 1; i < chartPoints.length; i++) {
        offscreenCtx.lineTo(chartPoints[i].x, chartPoints[i].y)
      }
      offscreenCtx.stroke()
      
      // Draw current price indicator
      const lastPoint = chartPoints[chartPoints.length - 1]
      offscreenCtx.fillStyle = '#4CAF50'
      offscreenCtx.beginPath()
      offscreenCtx.arc(lastPoint.x, lastPoint.y, 4, 0, 2 * Math.PI)
      offscreenCtx.fill()
      
      // Price line extending to edge
      offscreenCtx.strokeStyle = '#4CAF50'
      offscreenCtx.setLineDash([3, 3])
      offscreenCtx.beginPath()
      offscreenCtx.moveTo(lastPoint.x, lastPoint.y)
      offscreenCtx.lineTo(width - 10, lastPoint.y)
      offscreenCtx.stroke()
      offscreenCtx.setLineDash([])
      
      // Price label
      offscreenCtx.fillStyle = '#2E2E2E'
      offscreenCtx.font = 'bold 12px Inter'
      offscreenCtx.textAlign = 'right'
      offscreenCtx.fillText(`$${currentPrice.toFixed(2)}`, width - 15, lastPoint.y - 8)
    }
    
    // Copy offscreen canvas to main canvas (single operation)
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(offscreenCanvas, 0, 0)
    
    setIsAnimating(false)
  }, [chartPoints, currentPrice])
  
  // Throttled animation function
  const requestChartUpdate = useCallback(() => {
    if (isAnimating) return
    
    setIsAnimating(true)
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const now = performance.now()
      
      // Throttle to max 60fps
      if (now - lastUpdateRef.current > 16) {
        drawChart()
        lastUpdateRef.current = now
      } else {
        setIsAnimating(false)
      }
    })
  }, [drawChart, isAnimating])
  
  // Initialize canvas contexts
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    // Set up main canvas
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    const ctx = canvas.getContext('2d', { alpha: false })
    if (ctx) {
      ctx.scale(dpr, dpr)
      chartContextRef.current = ctx
    }
    
    // Set up offscreen canvas for double buffering
    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = rect.width * dpr
    offscreenCanvas.height = rect.height * dpr
    
    const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false })
    if (offscreenCtx) {
      offscreenCtx.scale(dpr, dpr)
      offscreenCanvasRef.current = offscreenCanvas
      offscreenContextRef.current = offscreenCtx
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])
  
  // Generate initial data
  useEffect(() => {
    const initialData: number[] = []
    let price = 145 + Math.random() * 10
    
    for (let i = 0; i < 50; i++) { // Reduced from 100 to 50 for better performance
      const change = (Math.random() - 0.5) * 0.02 * price
      price += change
      initialData.push(price)
    }
    
    setPriceHistory(initialData)
    setCurrentPrice(price)
    onPriceChange?.(price)
  }, [symbol, onPriceChange])
  
  // Optimized real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.5
      const newPrice = Math.max(currentPrice + change, 1)
      
      setCurrentPrice(newPrice)
      setPriceChange(change)
      onPriceChange?.(newPrice)
      
      // Efficient array update - remove first, add last
      setPriceHistory(prev => {
        const newHistory = prev.slice(-49) // Keep last 49, add 1 new = 50 total
        newHistory.push(newPrice)
        return newHistory
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [currentPrice, onPriceChange])
  
  // Trigger chart redraw when data changes
  useEffect(() => {
    requestChartUpdate()
  }, [requestChartUpdate])
  
  // Touch handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX === null) return
    
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    
    if (Math.abs(diff) > 50) {
      const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']
      const currentIndex = timeframes.indexOf(timeframe)
      
      if (diff > 0 && currentIndex < timeframes.length - 1) {
        setTimeframe(timeframes[currentIndex + 1])
      } else if (diff < 0 && currentIndex > 0) {
        setTimeframe(timeframes[currentIndex - 1])
      }
    }
    
    setTouchStartX(null)
  }, [touchStartX, timeframe])

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-handwrite">⚡ {symbol}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">${currentPrice.toFixed(2)}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              priceChange >= 0 
                ? 'text-finance-green bg-finance-green/10' 
                : 'text-coral-red bg-coral-red/10'
            }`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3 text-xs flex-shrink-0"
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <canvas 
          ref={canvasRef}
          className="w-full h-[400px] lg:h-[450px] touch-none"
          style={{ display: 'block' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        
        <div className="px-4 py-2 border-t border-grid-blue bg-paper/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>⚡ Optimized 60fps | Double-buffered</span>
            <span>📊 {priceHistory.length} data points</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}