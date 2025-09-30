import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePortfolioStore } from "@/stores/portfolioStore"
import { useUserStore } from "@/stores/userStore"
import { useChallengeStore } from "@/stores/challengeStore"
import { gamification } from "@/lib/gamification"
import { useTradingHotkeys } from '@/hooks/useTradingHotkeys'
import { HotkeyIndicator } from '@/components/ui/hotkey-indicator'
import { HotkeyHelpModal } from '@/components/ui/hotkey-help-modal'

export function OrderTicket() {
  const [symbol, setSymbol] = useState('AAPL')
  const [quantity, setQuantity] = useState(10)
  const [price, setPrice] = useState(150.00)
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [showHelpModal, setShowHelpModal] = useState(false)
  
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
  
  // Set up trading hotkeys
  const { hotkeys, triggerQuickBuy, triggerQuickSell, lastQuickTrade } = useTradingHotkeys({
    currentSymbol: symbol,
    quickQuantity: quantity,
    onQuickBuy: (sym, qty) => {
      setSymbol(sym)
      setQuantity(qty)
      setSide('buy')
      handleSubmitOrder()
    },
    onQuickSell: (sym, qty) => {
      setSymbol(sym)
      setQuantity(qty)
      setSide('sell')
      handleSubmitOrder()
    },
    onShowHelp: () => setShowHelpModal(true),
  })
  
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
            className="w-full flex items-center justify-center gap-2"
          >
            Buy
            <HotkeyIndicator keys={['b']} size="sm" />
          </Button>
          <Button
            variant={side === 'sell' ? 'destructive' : 'outline'}
            onClick={() => setSide('sell')}
            className="w-full flex items-center justify-center gap-2"
          >
            Sell
            <HotkeyIndicator keys={['s']} size="sm" />
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmitOrder}
          className="w-full mt-4 flex items-center justify-center gap-2"
          size="lg"
        >
          Submit Order
          <HotkeyIndicator keys={['space']} size="sm" />
        </Button>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>📊 Earn 25 XP per trade!</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelpModal(true)}
            className="h-auto p-1 text-xs"
          >
            <HotkeyIndicator keys={['?']} size="sm" />
            Help
          </Button>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-grid-blue">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerQuickBuy}
            className="text-xs flex items-center gap-1"
          >
            ⚡ Quick Buy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerQuickSell}
            className="text-xs flex items-center gap-1"
          >
            ⚡ Quick Sell
          </Button>
        </div>
        
        {lastQuickTrade && (
          <div className="text-xs text-center text-muted-foreground mt-2 bg-muted-lilac/10 rounded p-2">
            Last: {lastQuickTrade.side.toUpperCase()} {lastQuickTrade.quantity} {lastQuickTrade.symbol}
          </div>
        )}
        
        <HotkeyHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          hotkeys={hotkeys}
        />
      </CardContent>
    </Card>
  )
}