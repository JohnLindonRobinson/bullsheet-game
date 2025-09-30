import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SimpleChartProps {
  symbol: string
  onPriceChange?: (price: number) => void
}

export function SimpleChart({ symbol, onPriceChange }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPrice, setCurrentPrice] = useState(150.00)
  const [priceChange, setPriceChange] = useState(2.50)
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const [timeframe, setTimeframe] = useState('1D')

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

  // Draw chart
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
    const padding = 40

    // Clear canvas
    ctx.fillStyle = '#FDFCF7' // paper color
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = '#E3EAF2' // grid-blue
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i * (width - 2 * padding)) / 10
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }

    // Draw price line
    if (priceHistory.length > 1) {
      const minPrice = Math.min(...priceHistory)
      const maxPrice = Math.max(...priceHistory)
      const priceRange = maxPrice - minPrice || 1

      ctx.strokeStyle = '#4CAF50' // finance-green
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

      // Draw current price dot
      const lastX = padding + ((priceHistory.length - 1) * (width - 2 * padding)) / (priceHistory.length - 1)
      const lastY = height - padding - ((currentPrice - minPrice) / priceRange) * (height - 2 * padding)
      
      ctx.fillStyle = '#4CAF50'
      ctx.beginPath()
      ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw price labels
    ctx.fillStyle = '#2E2E2E' // graphite
    ctx.font = '12px Inter'
    ctx.textAlign = 'right'
    
    if (priceHistory.length > 0) {
      const minPrice = Math.min(...priceHistory)
      const maxPrice = Math.max(...priceHistory)
      
      // Max price
      ctx.fillText(`$${maxPrice.toFixed(2)}`, width - padding - 5, padding + 15)
      
      // Min price
      ctx.fillText(`$${minPrice.toFixed(2)}`, width - padding - 5, height - padding - 5)
      
      // Current price
      ctx.fillStyle = '#4CAF50'
      ctx.font = 'bold 14px Inter'
      ctx.fillText(`$${currentPrice.toFixed(2)}`, width - padding - 5, height / 2)
    }
  }, [priceHistory, currentPrice])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.5
      const newPrice = Math.max(currentPrice + change, 1)
      
      setCurrentPrice(newPrice)
      setPriceChange(change)
      onPriceChange?.(newPrice)
      
      setPriceHistory(prev => [...prev.slice(-99), newPrice]) // Keep last 100 points
    }, 2000)

    return () => clearInterval(interval)
  }, [currentPrice, onPriceChange])

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-handwrite">📈 {symbol}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${currentPrice.toFixed(2)}</span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                priceChange >= 0 
                  ? 'text-finance-green bg-finance-green/10' 
                  : 'text-coral-red bg-coral-red/10'
              }`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({((priceChange / currentPrice) * 100).toFixed(2)}%)
              </span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <canvas 
          ref={canvasRef}
          className="w-full h-[400px] border border-grid-blue rounded-lg bg-squared-paper"
          style={{ backgroundImage: 'linear-gradient(to right, #E3EAF2 1px, transparent 1px), linear-gradient(to bottom, #E3EAF2 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        
        <div className="px-6 py-3 border-t border-grid-blue bg-paper/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>📊 Live Demo Data</span>
            <span>🔄 Updates every 2s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}