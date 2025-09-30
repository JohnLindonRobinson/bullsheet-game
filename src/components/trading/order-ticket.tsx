import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePortfolioStore } from "@/stores/portfolioStore"
import { useUserStore } from "@/stores/userStore"
import { useChallengeStore } from "@/stores/challengeStore"
import { gamification } from "@/lib/gamification"

export function OrderTicket() {
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
    
    // Award XP for completing a trade
    addXp(25)
    
    // Check challenge progress
    checkTradeProgress({
      ...trade,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      status: 'filled'
    })
    
    // Gamification effects
    gamification.celebrateTrade()
    gamification.showXpGain(25)
    
    console.log(`${side.toUpperCase()} order submitted: ${quantity} shares of ${symbol} at $${price}`)
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-handwrite">📝 Order Ticket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-grid-blue rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-paper-blue"
            placeholder="AAPL"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-grid-blue rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-paper-blue"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-grid-blue rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-paper-blue"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={side === 'buy' ? 'success' : 'outline'}
            onClick={() => setSide('buy')}
            className="w-full"
          >
            Buy
          </Button>
          <Button
            variant={side === 'sell' ? 'destructive' : 'outline'}
            onClick={() => setSide('sell')}
            className="w-full"
          >
            Sell
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmitOrder}
          className="w-full mt-4"
          size="lg"
        >
          Submit Order
        </Button>
        
        <div className="text-xs text-muted-foreground text-center mt-2">
          📊 Earn 25 XP per trade!
        </div>
      </CardContent>
    </Card>
  )
}