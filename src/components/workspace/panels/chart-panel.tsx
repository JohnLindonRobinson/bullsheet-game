import { EnhancedChart } from '@/components/trading/enhanced-chart'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ChartPanelProps {
  symbol?: string
  onSymbolChange?: (symbol: string) => void
}

const POPULAR_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 
  'NVDA', 'META', 'NFLX', 'BABA', 'AMD'
]

export function ChartPanel({ symbol = 'AAPL', onSymbolChange }: ChartPanelProps) {
  const [currentSymbol, setCurrentSymbol] = useState(symbol)
  
  const handleSymbolChange = (newSymbol: string) => {
    setCurrentSymbol(newSymbol)
    onSymbolChange?.(newSymbol)
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Chart Controls */}
      <div className="flex items-center gap-2 p-2 bg-muted-lilac/5 border-b border-grid-blue">
        <Select value={currentSymbol} onValueChange={handleSymbolChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {POPULAR_SYMBOLS.map((sym) => (
              <SelectItem key={sym} value={sym}>
                📈 {sym}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" size="sm" className="text-xs">
            🔄 Refresh
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            📊 Indicators
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            ✏️ Draw
          </Button>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 min-h-0">
        <EnhancedChart symbol={currentSymbol} />
      </div>
    </div>
  )
}