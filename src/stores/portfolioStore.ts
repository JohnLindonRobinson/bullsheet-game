import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Portfolio, Trade, Position } from '../types'
import { calculatePnL, calculatePnLPercentage } from '../lib/utils'

interface PortfolioState {
  portfolio: Portfolio
  trades: Trade[]
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void
  updatePositions: (marketData: Record<string, number>) => void
  getPosition: (symbol: string) => Position | null
}

const initialPortfolio: Portfolio = {
  totalValue: 100000, // Starting with $100k paper money
  totalPnL: 0,
  totalPnLPercentage: 0,
  buyingPower: 100000,
  positions: []
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      portfolio: initialPortfolio,
      trades: [],
      
      addTrade: (tradeData) => {
        const trade: Trade = {
          ...tradeData,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          status: 'filled' // For simplicity, all trades are immediately filled
        }
        
        const { portfolio, trades } = get()
        const newTrades = [...trades, trade]
        
        // Update position
        const existingPositionIndex = portfolio.positions.findIndex(
          p => p.symbol === trade.symbol
        )
        
        const newPositions = [...portfolio.positions]
        
        if (existingPositionIndex >= 0) {
          const position = newPositions[existingPositionIndex]
          const newQuantity = trade.side === 'buy' 
            ? position.quantity + trade.quantity 
            : position.quantity - trade.quantity
          
          if (newQuantity === 0) {
            // Close position
            newPositions.splice(existingPositionIndex, 1)
          } else {
            // Update average price
            const totalCost = (position.avgPrice * position.quantity) + 
              (trade.side === 'buy' ? trade.price * trade.quantity : -trade.price * trade.quantity)
            const newAvgPrice = totalCost / newQuantity
            
            newPositions[existingPositionIndex] = {
              ...position,
              quantity: newQuantity,
              avgPrice: newAvgPrice
            }
          }
        } else if (trade.side === 'buy') {
          // New position
          newPositions.push({
            symbol: trade.symbol,
            quantity: trade.quantity,
            avgPrice: trade.price,
            currentPrice: trade.price,
            unrealizedPnL: 0,
            unrealizedPnLPercentage: 0
          })
        }
        
        // Update buying power
        const tradeCost = trade.price * trade.quantity
        const newBuyingPower = trade.side === 'buy' 
          ? portfolio.buyingPower - tradeCost 
          : portfolio.buyingPower + tradeCost
        
        set({
          trades: newTrades,
          portfolio: {
            ...portfolio,
            buyingPower: newBuyingPower,
            positions: newPositions
          }
        })
      },
      
      updatePositions: (marketData) => {
        const { portfolio } = get()
        const updatedPositions = portfolio.positions.map(position => {
          const currentPrice = marketData[position.symbol] || position.currentPrice
          const unrealizedPnL = calculatePnL(position.avgPrice, currentPrice, position.quantity)
          const unrealizedPnLPercentage = calculatePnLPercentage(position.avgPrice, currentPrice)
          
          return {
            ...position,
            currentPrice,
            unrealizedPnL,
            unrealizedPnLPercentage
          }
        })
        
        // Calculate total portfolio value and P&L
        const totalUnrealizedPnL = updatedPositions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0)
        const totalPositionValue = updatedPositions.reduce((sum, pos) => sum + (pos.currentPrice * pos.quantity), 0)
        const totalValue = portfolio.buyingPower + totalPositionValue
        const totalPnLPercentage = (totalValue - 100000) / 100000 // Assuming $100k starting capital
        
        set({
          portfolio: {
            ...portfolio,
            positions: updatedPositions,
            totalValue,
            totalPnL: totalUnrealizedPnL,
            totalPnLPercentage
          }
        })
      },
      
      getPosition: (symbol) => {
        const { portfolio } = get()
        return portfolio.positions.find(p => p.symbol === symbol) || null
      }
    }),
    {
      name: 'bullsheet-portfolio'
    }
  )
)