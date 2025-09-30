import { useCallback, useState } from 'react'
import { useHotkeys, HotkeyAction, HOTKEY_CATEGORIES } from '@/hooks/useHotkeys'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useUserStore } from '@/stores/userStore'
import { gamification } from '@/lib/gamification'

interface TradingHotkeysConfig {
  onQuickBuy?: (symbol: string, quantity: number) => void
  onQuickSell?: (symbol: string, quantity: number) => void
  onCancelAllOrders?: () => void
  onShowHelp?: () => void
  onOpenCommandPalette?: () => void
  currentSymbol?: string
  quickQuantity?: number
  popularSymbols?: string[]
}

export function useTradingHotkeys(config: TradingHotkeysConfig = {}) {
  const {
    onQuickBuy,
    onQuickSell,
    onCancelAllOrders,
    onShowHelp,
    onOpenCommandPalette,
    currentSymbol = 'AAPL',
    quickQuantity = 10,
    popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX', 'ORCL'],
  } = config

  const { executeTrade } = usePortfolioStore()
  const { addXp } = useUserStore()
  
  const [lastQuickTrade, setLastQuickTrade] = useState({
    symbol: currentSymbol,
    quantity: quickQuantity,
    side: 'buy' as 'buy' | 'sell'
  })

  // Handle quick buy
  const handleQuickBuy = useCallback(() => {
    if (onQuickBuy) {
      onQuickBuy(currentSymbol, quickQuantity)
    } else {
      const price = 150 + Math.random() * 50 // Mock price
      executeTrade({
        symbol: currentSymbol,
        side: 'buy',
        quantity: quickQuantity,
        price,
        type: 'market'
      })
      
      setLastQuickTrade({ symbol: currentSymbol, quantity: quickQuantity, side: 'buy' })
      addXp(25) // Bonus XP for using hotkeys
      gamification.showFeedback('🚀 Quick Buy!', 'success')
    }
  }, [onQuickBuy, currentSymbol, quickQuantity, executeTrade, addXp])

  // Handle quick sell
  const handleQuickSell = useCallback(() => {
    if (onQuickSell) {
      onQuickSell(currentSymbol, quickQuantity)
    } else {
      const price = 150 + Math.random() * 50 // Mock price
      executeTrade({
        symbol: currentSymbol,
        side: 'sell',
        quantity: quickQuantity,
        price,
        type: 'market'
      })
      
      setLastQuickTrade({ symbol: currentSymbol, quantity: quickQuantity, side: 'sell' })
      addXp(25) // Bonus XP for using hotkeys
      gamification.showFeedback('💰 Quick Sell!', 'success')
    }
  }, [onQuickSell, currentSymbol, quickQuantity, executeTrade, addXp])

  // Handle quick trade (repeat last action)
  const handleQuickTrade = useCallback(() => {
    if (lastQuickTrade.side === 'buy') {
      handleQuickBuy()
    } else {
      handleQuickSell()
    }
    gamification.showFeedback('⚡ Quick Trade!', 'info')
  }, [lastQuickTrade.side, handleQuickBuy, handleQuickSell])

  // Handle symbol selection
  const handleSymbolSelect = useCallback((index: number) => {
    if (index >= 1 && index <= popularSymbols.length) {
      const symbol = popularSymbols[index - 1]
      gamification.showFeedback(`📊 ${symbol} Selected`, 'info')
      // This would typically update a symbol state in parent component
    }
  }, [popularSymbols])

  // Handle cancel all orders
  const handleCancelAllOrders = useCallback(() => {
    if (onCancelAllOrders) {
      onCancelAllOrders()
    } else {
      // Mock cancel all orders
      gamification.showFeedback('❌ All orders cancelled', 'warning')
    }
  }, [onCancelAllOrders])

  // Handle escape key
  const handleEscape = useCallback(() => {
    // Close any open modals/overlays
    gamification.showFeedback('Escape pressed', 'info')
  }, [])

  // Define hotkey actions
  const hotkeyActions: HotkeyAction[] = [
    // Trading actions
    {
      keys: ['space'],
      description: 'Quick trade (repeat last action)',
      action: handleQuickTrade,
      category: HOTKEY_CATEGORIES.TRADING,
    },
    {
      keys: ['b'],
      description: 'Quick buy order',
      action: handleQuickBuy,
      category: HOTKEY_CATEGORIES.TRADING,
    },
    {
      keys: ['s'],
      description: 'Quick sell order',
      action: handleQuickSell,
      category: HOTKEY_CATEGORIES.TRADING,
    },
    {
      keys: ['c'],
      description: 'Cancel all orders',
      action: handleCancelAllOrders,
      category: HOTKEY_CATEGORIES.TRADING,
    },
    
    // Symbol selection (1-9)
    ...popularSymbols.slice(0, 9).map((symbol, index) => ({
      keys: [(index + 1).toString()],
      description: `Select ${symbol}`,
      action: () => handleSymbolSelect(index + 1),
      category: HOTKEY_CATEGORIES.TRADING,
    })),
    
    // Navigation and general
    {
      keys: ['mod+k'],
      description: 'Open command palette',
      action: onOpenCommandPalette || (() => gamification.showFeedback('Command palette', 'info')),
      category: HOTKEY_CATEGORIES.NAVIGATION,
    },
    {
      keys: ['?'],
      description: 'Show keyboard shortcuts',
      action: onShowHelp || (() => {}),
      category: HOTKEY_CATEGORIES.HELP,
    },
    {
      keys: ['escape'],
      description: 'Close modals and overlays',
      action: handleEscape,
      category: HOTKEY_CATEGORIES.GENERAL,
    },
  ]

  // Use the hotkeys hook
  const { getHotkeys, isEnabled } = useHotkeys({
    actions: hotkeyActions,
    enabled: true,
  })

  return {
    hotkeys: getHotkeys(),
    isEnabled: isEnabled(),
    lastQuickTrade,
    
    // Manual action triggers (for UI buttons)
    triggerQuickBuy: handleQuickBuy,
    triggerQuickSell: handleQuickSell,
    triggerQuickTrade: handleQuickTrade,
    triggerCancelAll: handleCancelAllOrders,
  }
}