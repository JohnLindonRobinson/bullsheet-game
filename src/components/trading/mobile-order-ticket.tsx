import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePortfolioStore } from "@/stores/portfolioStore"
import { useUserStore } from "@/stores/userStore"
import { useChallengeStore } from "@/stores/challengeStore"
import { gamification } from "@/lib/gamification"

export function MobileOrderTicket() {
  const [symbol, setSymbol] = useState('AAPL')
  const [quantity, setQuantity] = useState(10)
  const [price, setPrice] = useState(150.00)
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  
  const addTrade = usePortfolioStore(state => state.addTrade)
  const addXp = useUserStore(state => state.addXp)
  const checkTradeProgress = useChallengeStore(state => state.checkTradeProgress)
  
  const handleSubmitOrder = () => {
    const trade = {
      symbol,
      side,
      quantity,
      price,
      status: 'filled' as const
    }
    
    addTrade(trade)
    addXp(25)
    
    checkTradeProgress({
      ...trade,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      status: 'filled'
    })
    
    gamification.celebrateTrade()
    gamification.showXpGain(25)
  }

  const quickQuantities = [1, 5, 10, 25, 50, 100]
  const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA']
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-handwrite">📝 Quick Trade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Symbol Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Symbol</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {popularSymbols.map((sym) => (
              <Button
                key={sym}
                variant={symbol === sym ? 'default' : 'outline'}
                size="sm"
                className="h-10"
                onClick={() => setSymbol(sym)}
              >
                {sym}
              </Button>
            ))}
          </div>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-grid-blue rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-paper-blue text-center font-bold text-lg"
            placeholder="Enter symbol"
          />
        </div>
        
        {/* Quantity Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {quickQuantities.map((qty) => (
              <Button
                key={qty}
                variant={quantity === qty ? 'default' : 'outline'}
                size="sm"
                className="h-10"
                onClick={() => setQuantity(qty)}
              >
                {qty}
              </Button>
            ))}
          </div>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-3 border border-grid-blue rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-paper-blue text-center font-bold text-lg"
            min="1"
          />
        </div>
        
        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Price per Share</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-3 border border-grid-blue rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-paper-blue text-center font-bold text-lg"
            step="0.01"
            min="0"
          />
        </div>
        
        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={side === 'buy' ? 'success' : 'outline'}
            onClick={() => setSide('buy')}
            className="h-14 text-lg font-bold"
            size="lg"
          >
            🟢 BUY
          </Button>
          <Button
            variant={side === 'sell' ? 'destructive' : 'outline'}
            onClick={() => setSide('sell')}
            className="h-14 text-lg font-bold"
            size="lg"
          >
            🔴 SELL
          </Button>
        </div>
        
        {/* Trade Preview */}
        <div className="bg-grid-blue/10 rounded-lg p-4">
          <div className="text-center">
            <div className="text-lg font-handwrite mb-2">Trade Preview</div>
            <div className="text-2xl font-bold">
              {side.toUpperCase()} {quantity} {symbol}
            </div>
            <div className="text-xl font-mono mt-1">
              ${(price * quantity).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              💰 Earn 25 XP for this trade!
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <Button 
          onClick={handleSubmitOrder}
          className="w-full h-14 text-lg font-bold"
          size="lg"
        >
          🚀 Execute Trade
        </Button>
      </CardContent>
    </Card>
  )
}