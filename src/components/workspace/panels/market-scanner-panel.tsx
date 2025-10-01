// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface MarketScannerData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
}

const MOCK_SCANNER_DATA: MarketScannerData[] = [
  { symbol: 'AAPL', price: 175.23, change: 2.15, changePercent: 1.24, volume: 45230000 },
  { symbol: 'MSFT', price: 415.67, change: -1.23, changePercent: -0.29, volume: 32150000 },
  { symbol: 'GOOGL', price: 142.89, change: 5.67, changePercent: 4.13, volume: 28940000 },
  { symbol: 'TSLA', price: 248.42, change: -12.34, changePercent: -4.73, volume: 67890000 },
  { symbol: 'NVDA', price: 875.32, change: 23.45, changePercent: 2.75, volume: 41200000 },
  { symbol: 'META', price: 325.78, change: 8.92, changePercent: 2.82, volume: 19850000 },
  { symbol: 'AMZN', price: 145.67, change: -2.34, changePercent: -1.58, volume: 35670000 },
  { symbol: 'NFLX', price: 445.23, change: 15.67, changePercent: 3.64, volume: 12340000 }
]

export function MarketScannerPanel() {
  const [scannerData] = useState(MOCK_SCANNER_DATA)
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('change')
  
  const sortedData = [...scannerData].sort((a, b) => {
    switch (sortBy) {
      case 'symbol':
        return a.symbol.localeCompare(b.symbol)
      case 'price':
        return b.price - a.price
      case 'change':
        return b.changePercent - a.changePercent
      case 'volume':
        return b.volume - a.volume
      default:
        return 0
    }
  })
  
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`
    }
    return volume.toString()
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Scanner Controls */}
      <div className="p-2 bg-muted-lilac/5 border-b border-grid-blue">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <div className="flex gap-1">
            {[
              { key: 'change', label: '% Change' },
              { key: 'volume', label: 'Volume' },
              { key: 'price', label: 'Price' },
              { key: 'symbol', label: 'Symbol' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={sortBy === key ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setSortBy(key as any)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scanner Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {/* Header */}
          <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground pb-1 border-b border-grid-blue">
            <div>Symbol</div>
            <div className="text-right">Price</div>
            <div className="text-right">Change</div>
            <div className="text-right">%</div>
            <div className="text-right">Volume</div>
          </div>
          
          {/* Data Rows */}
          {sortedData.map((item) => (
            <div 
              key={item.symbol}
              className="grid grid-cols-5 gap-2 text-xs py-1 hover:bg-muted-lilac/10 rounded cursor-pointer transition-colors"
            >
              <div className="font-medium text-graphite">{item.symbol}</div>
              <div className="text-right font-mono">${item.price.toFixed(2)}</div>
              <div className={`text-right font-mono ${
                item.change >= 0 ? 'text-finance-green' : 'text-coral-red'
              }`}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
              </div>
              <div className={`text-right font-mono ${
                item.changePercent >= 0 ? 'text-finance-green' : 'text-coral-red'
              }`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </div>
              <div className="text-right font-mono text-muted-foreground">
                {formatVolume(item.volume)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scanner Footer */}
      <div className="p-2 bg-muted-lilac/5 border-t border-grid-blue">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>📊 Market Scanner</span>
          <span>🔄 Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}