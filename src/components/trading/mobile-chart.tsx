import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MobileChartProps {
  symbol: string
  onPriceChange?: (price: number) => void
}

export function MobileChart({ symbol, onPriceChange }: MobileChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPrice, setCurrentPrice] = useState(150.00)
  const [priceChange, setPriceChange] = useState(2.50)
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const [timeframe, setTimeframe] = useState('1D')
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  // Touch handling for swipe to change timeframes
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    
    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']
      const currentIndex = timeframes.indexOf(timeframe)
      
      if (diff > 0 && currentIndex < timeframes.length - 1) {
        // Swipe left - next timeframe
        setTimeframe(timeframes[currentIndex + 1])
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous timeframe
        setTimeframe(timeframes[currentIndex - 1])
      }
    }
    
    setTouchStartX(null)
  }

  // Generate initial price data
  useEffect(() => {
    const initialData: number[] = []
    let price = 145 + Math.random() * 10
    
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 0.02 * price
      price += change
      initialData.push(price)
    }
    
    setPriceHistory(initialData)
    setCurrentPrice(price)
    onPriceChange?.(price)
  }, [symbol, onPriceChange])

  // Enhanced mobile chart drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || priceHistory.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height
    const padding = 20 // Reduced padding for mobile

    // Clear canvas
    ctx.fillStyle = '#FDFCF7'
    ctx.fillRect(0, 0, width, height)

    // Draw grid (lighter for mobile)
    ctx.strokeStyle = '#E3EAF2'
    ctx.lineWidth = 0.5
    
    // Fewer grid lines for mobile
    for (let i = 0; i <= 3; i++) {
      const y = padding + (i * (height - 2 * padding)) / 3
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw price line with gradient
    if (priceHistory.length > 1) {
      const minPrice = Math.min(...priceHistory)
      const maxPrice = Math.max(...priceHistory)
      const priceRange = maxPrice - minPrice || 1

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)')
      gradient.addColorStop(1, 'rgba(76, 175, 80, 0.0)')

      // Draw filled area
      ctx.fillStyle = gradient
      ctx.beginPath()
      
      priceHistory.forEach((price, index) => {
        const x = padding + (index * (width - 2 * padding)) / (priceHistory.length - 1)
        const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding)
        
        if (index === 0) {
          ctx.moveTo(x, height - padding)
          ctx.lineTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.lineTo(width - padding, height - padding)
      ctx.closePath()
      ctx.fill()

      // Draw price line
      ctx.strokeStyle = '#4CAF50'
      ctx.lineWidth = 2
      ctx.beginPath()

      priceHistory.forEach((price, index) => {
        const x = padding + (index * (width - 2 * padding)) / (priceHistory.length - 1)
        const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding)
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Current price indicator
      const lastX = padding + ((priceHistory.length - 1) * (width - 2 * padding)) / (priceHistory.length - 1)
      const lastY = height - padding - ((currentPrice - minPrice) / priceRange) * (height - 2 * padding)
      
      ctx.fillStyle = '#4CAF50'
      ctx.beginPath()
      ctx.arc(lastX, lastY, 6, 0, 2 * Math.PI)
      ctx.fill()
      
      // Price line extending to edge
      ctx.strokeStyle = '#4CAF50'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(width - 10, lastY)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Mobile-optimized price labels
    ctx.fillStyle = '#2E2E2E'
    ctx.font = '12px Inter'
    ctx.textAlign = 'right'
    
    if (priceHistory.length > 0) {
      // Current price (larger on mobile)
      ctx.fillStyle = '#4CAF50'
      ctx.font = 'bold 14px Inter'
      ctx.fillText(`$${currentPrice.toFixed(2)}`, width - 15, height / 2)
    }
  }, [priceHistory, currentPrice])

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.5
      const newPrice = Math.max(currentPrice + change, 1)
      
      setCurrentPrice(newPrice)
      setPriceChange(change)
      onPriceChange?.(newPrice)
      
      setPriceHistory(prev => [...prev.slice(-99), newPrice])
    }, 2000)

    return () => clearInterval(interval)
  }, [currentPrice, onPriceChange])

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-handwrite">📈 {symbol}</CardTitle>
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
        
        {/* Mobile timeframe selector */}
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
          className="w-full h-[300px] touch-none" // Reduced height for mobile
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        
        <div className="px-4 py-2 border-t border-grid-blue bg-paper/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>📊 Swipe to change timeframe</span>
            <span>🔄 Live updates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}