import { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EnhancedChartProps {
  symbol: string
  onPriceChange?: (price: number) => void
}

interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type ChartType = 'candlestick' | 'line' | 'area'
type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'

const TIMEFRAME_CONFIG = {
  '1m': { interval: 60 * 1000, label: '1 Minute', dataPoints: 100 },
  '5m': { interval: 5 * 60 * 1000, label: '5 Minutes', dataPoints: 100 },
  '15m': { interval: 15 * 60 * 1000, label: '15 Minutes', dataPoints: 96 },
  '1h': { interval: 60 * 60 * 1000, label: '1 Hour', dataPoints: 168 },
  '4h': { interval: 4 * 60 * 60 * 1000, label: '4 Hours', dataPoints: 42 },
  '1d': { interval: 24 * 60 * 60 * 1000, label: '1 Day', dataPoints: 365 },
  '1w': { interval: 7 * 24 * 60 * 60 * 1000, label: '1 Week', dataPoints: 52 }
}

export function EnhancedChart({ symbol, onPriceChange }: EnhancedChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [currentPrice, setCurrentPrice] = useState(150.00)
  const [priceChange, setPriceChange] = useState(2.50)
  const [timeframe, setTimeframe] = useState<Timeframe>('1h')
  const [chartType, setChartType] = useState<ChartType>('candlestick')
  const [showVolume, setShowVolume] = useState(true)
  const [indicators, setIndicators] = useState<string[]>([])
  const [candleData, setCandleData] = useState<CandleData[]>([])
  
  // Generate realistic OHLCV data
  const generateCandleData = useCallback((count: number, interval: number): CandleData[] => {
    const data: CandleData[] = []
    const now = Date.now()
    let price = 145 + Math.random() * 10
    
    for (let i = count; i >= 0; i--) {
      const time = now - i * interval
      
      // Generate OHLC with realistic volatility
      const open = price
      const volatility = 0.02 * price * (Math.random() + 0.5)
      const change = (Math.random() - 0.5) * volatility
      
      const high = open + Math.abs(change) * (0.5 + Math.random() * 0.5)
      const low = open - Math.abs(change) * (0.5 + Math.random() * 0.5)
      const close = open + change
      
      // Ensure OHLC logic is correct
      const finalHigh = Math.max(open, close, high)
      const finalLow = Math.min(open, close, low)
      
      // Generate volume
      const volume = Math.floor(Math.random() * 1000000 + 100000)
      
      data.push({
        time,
        open: Number(open.toFixed(2)),
        high: Number(finalHigh.toFixed(2)),
        low: Number(finalLow.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume
      })
      
      price = close
    }
    
    return data.sort((a, b) => a.time - b.time)
  }, [])
  
  // Calculate Simple Moving Average
  const calculateSMA = useCallback((data: CandleData[], period: number) => {
    const smaData: Array<{ time: number; value: number }> = []
    
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0)
      const sma = sum / period
      
      smaData.push({
        time: data[i].time,
        value: Number(sma.toFixed(2))
      })
    }
    
    return smaData
  }, [])
  
  // Calculate Exponential Moving Average
  const calculateEMA = useCallback((data: CandleData[], period: number) => {
    const emaData: Array<{ time: number; value: number }> = []
    const multiplier = 2 / (period + 1)
    
    if (data.length === 0) return emaData
    
    let ema = data[0].close
    emaData.push({ time: data[0].time, value: Number(ema.toFixed(2)) })
    
    for (let i = 1; i < data.length; i++) {
      ema = (data[i].close * multiplier) + (ema * (1 - multiplier))
      emaData.push({
        time: data[i].time,
        value: Number(ema.toFixed(2))
      })
    }
    
    return emaData
  }, [])
  
  // Generate data when timeframe changes
  useEffect(() => {
    const config = TIMEFRAME_CONFIG[timeframe]
    const data = generateCandleData(config.dataPoints, config.interval)
    setCandleData(data)
    
    if (data.length > 0) {
      const lastCandle = data[data.length - 1]
      const prevCandle = data[data.length - 2] || lastCandle
      
      setCurrentPrice(lastCandle.close)
      setPriceChange(lastCandle.close - prevCandle.close)
      onPriceChange?.(lastCandle.close)
    }
  }, [timeframe, symbol, generateCandleData, onPriceChange])
  
  // Draw chart
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || candleData.length === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    const width = rect.width
    const height = rect.height
    const padding = 40
    const chartHeight = showVolume ? height * 0.7 : height - 2 * padding
    const volumeHeight = showVolume ? height * 0.25 : 0
    
    // Clear canvas
    ctx.fillStyle = '#FDFCF7'
    ctx.fillRect(0, 0, width, height)
    
    // Calculate price range
    const prices = candleData.flatMap(d => [d.high, d.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice || 1
    
    // Calculate volume range for volume chart
    const volumes = candleData.map(d => d.volume)
    const maxVolume = Math.max(...volumes) || 1
    
    // Draw grid
    ctx.strokeStyle = '#E3EAF2'
    ctx.lineWidth = 1
    
    // Horizontal grid lines for price
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight) / 5
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
    
    // Draw candles or line based on chart type
    const candleWidth = Math.max(1, (width - 2 * padding) / candleData.length - 1)
    
    candleData.forEach((candle, index) => {
      const x = padding + (index * (width - 2 * padding)) / (candleData.length - 1)
      
      if (chartType === 'candlestick') {
        // Draw candlestick
        const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight
        const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight
        const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight
        const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight
        
        const isGreen = candle.close > candle.open
        
        // Draw wick
        ctx.strokeStyle = isGreen ? '#4CAF50' : '#F44336'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, highY)
        ctx.lineTo(x, lowY)
        ctx.stroke()
        
        // Draw body
        ctx.fillStyle = isGreen ? '#4CAF50' : '#F44336'
        const bodyHeight = Math.abs(closeY - openY)
        const bodyY = Math.min(openY, closeY)
        ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight || 1)
        
      } else if (chartType === 'line') {
        // Draw line chart
        const y = padding + ((maxPrice - candle.close) / priceRange) * chartHeight
        
        if (index === 0) {
          ctx.beginPath()
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        
        if (index === candleData.length - 1) {
          ctx.strokeStyle = '#758BFD'
          ctx.lineWidth = 2
          ctx.stroke()
        }
        
      } else if (chartType === 'area') {
        // Draw area chart
        const y = padding + ((maxPrice - candle.close) / priceRange) * chartHeight
        
        if (index === 0) {
          ctx.beginPath()
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        
        if (index === candleData.length - 1) {
          // Close the area
          ctx.lineTo(x, padding + chartHeight)
          ctx.lineTo(padding, padding + chartHeight)
          ctx.closePath()
          
          // Fill area
          const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
          gradient.addColorStop(0, 'rgba(117, 139, 253, 0.3)')
          gradient.addColorStop(1, 'rgba(117, 139, 253, 0.05)')
          ctx.fillStyle = gradient
          ctx.fill()
          
          // Draw line
          ctx.beginPath()
          candleData.forEach((c, i) => {
            const lineX = padding + (i * (width - 2 * padding)) / (candleData.length - 1)
            const lineY = padding + ((maxPrice - c.close) / priceRange) * chartHeight
            if (i === 0) ctx.moveTo(lineX, lineY)
            else ctx.lineTo(lineX, lineY)
          })
          ctx.strokeStyle = '#758BFD'
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }
      
      // Draw volume bars if enabled
      if (showVolume) {
        const volumeY = height - padding
        const volumeBarHeight = (candle.volume / maxVolume) * volumeHeight
        const isGreen = candle.close > candle.open
        
        ctx.fillStyle = isGreen ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)'
        ctx.fillRect(x - candleWidth / 2, volumeY - volumeBarHeight, candleWidth, volumeBarHeight)
      }
    })
    
    // Draw technical indicators
    if (indicators.includes('SMA20')) {
      const sma20Data = calculateSMA(candleData, 20)
      if (sma20Data.length > 0) {
        ctx.beginPath()
        ctx.strokeStyle = '#FF6B6B'
        ctx.lineWidth = 2
        
        sma20Data.forEach((point, index) => {
          const dataIndex = candleData.findIndex(d => d.time === point.time)
          if (dataIndex !== -1) {
            const x = padding + (dataIndex * (width - 2 * padding)) / (candleData.length - 1)
            const y = padding + ((maxPrice - point.value) / priceRange) * chartHeight
            
            if (index === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
        })
        ctx.stroke()
      }
    }
    
    if (indicators.includes('EMA50')) {
      const ema50Data = calculateEMA(candleData, 50)
      if (ema50Data.length > 0) {
        ctx.beginPath()
        ctx.strokeStyle = '#4ECDC4'
        ctx.lineWidth = 2
        
        ema50Data.forEach((point, index) => {
          const dataIndex = candleData.findIndex(d => d.time === point.time)
          if (dataIndex !== -1) {
            const x = padding + (dataIndex * (width - 2 * padding)) / (candleData.length - 1)
            const y = padding + ((maxPrice - point.value) / priceRange) * chartHeight
            
            if (index === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
        })
        ctx.stroke()
      }
    }
    
    // Draw price labels
    ctx.fillStyle = '#2E2E2E'
    ctx.font = '12px Inter'
    ctx.textAlign = 'right'
    
    // Max price
    ctx.fillText(`$${maxPrice.toFixed(2)}`, width - padding - 5, padding + 15)
    
    // Min price
    ctx.fillText(`$${minPrice.toFixed(2)}`, width - padding - 5, padding + chartHeight - 5)
    
    // Current price
    ctx.fillStyle = '#4CAF50'
    ctx.font = 'bold 14px Inter'
    ctx.fillText(`$${currentPrice.toFixed(2)}`, width - padding - 5, padding + chartHeight / 2)
    
    // Volume label if enabled
    if (showVolume) {
      ctx.fillStyle = '#2E2E2E'
      ctx.font = '10px Inter'
      ctx.fillText('Volume', width - padding - 5, height - padding - volumeHeight + 15)
    }
    
  }, [candleData, chartType, showVolume, indicators, currentPrice, calculateSMA, calculateEMA])
  
  // Redraw chart when data or settings change
  useEffect(() => {
    drawChart()
  }, [drawChart])
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(drawChart, 100)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawChart])
  
  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    )
  }
  
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
          
          <div className="flex items-center gap-2">
            {/* Chart Type Selector */}
            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candlestick">📊 Candles</SelectItem>
                <SelectItem value="line">📈 Line</SelectItem>
                <SelectItem value="area">📉 Area</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Timeframe Buttons */}
            <div className="flex gap-1">
              {(Object.keys(TIMEFRAME_CONFIG) as Timeframe[]).map((tf) => (
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
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant={showVolume ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
          >
            📊 Volume
          </Button>
          
          <Button
            variant={indicators.includes('SMA20') ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleIndicator('SMA20')}
          >
            SMA 20
          </Button>
          
          <Button
            variant={indicators.includes('EMA50') ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleIndicator('EMA50')}
          >
            EMA 50
          </Button>
          
          <div className="ml-auto text-xs text-muted-foreground">
            📡 {TIMEFRAME_CONFIG[timeframe].label} • Enhanced Trading Chart
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div ref={containerRef} className="w-full border border-grid-blue rounded-lg bg-paper">
          <canvas 
            ref={canvasRef}
            className="w-full h-[500px] cursor-crosshair"
            style={{ 
              backgroundImage: 'linear-gradient(to right, #E3EAF2 1px, transparent 1px), linear-gradient(to bottom, #E3EAF2 1px, transparent 1px)', 
              backgroundSize: '20px 20px' 
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}