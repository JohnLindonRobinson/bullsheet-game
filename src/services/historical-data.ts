import { HistoricalDataPoint, BacktestPeriod, MarketDataCache } from '@/types/backtesting'

/**
 * Historical Data Service
 * Fetches and caches historical market data for backtesting
 */
export class HistoricalDataService {
  private cache: MarketDataCache = {}
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  /**
   * Fetch historical data for a symbol within a date range
   */
  async fetchHistoricalData(
    symbol: string, 
    period: BacktestPeriod
  ): Promise<HistoricalDataPoint[]> {
    // Check cache first
    if (this.isCacheValid(symbol)) {
      const cachedData = this.cache[symbol].data
      return this.filterDataByPeriod(cachedData, period)
    }

    try {
      // For demo purposes, we'll generate realistic mock data
      // In production, this would call Yahoo Finance API or similar
      const data = await this.generateMockData(symbol, period)
      
      // Cache the data
      this.cacheData(symbol, data)
      
      return data
    } catch (error) {
      console.error(`Failed to fetch data for ${symbol}:`, error)
      throw new Error(`Failed to fetch historical data for ${symbol}`)
    }
  }

  /**
   * Generate realistic mock historical data
   */
  private async generateMockData(
    symbol: string, 
    period: BacktestPeriod
  ): Promise<HistoricalDataPoint[]> {
    const startDate = new Date(period.startDate)
    const endDate = new Date(period.endDate)
    const data: HistoricalDataPoint[] = []
    
    // Base price and volatility based on symbol
    const basePrice = this.getBasePriceForSymbol(symbol)
    const volatility = this.getVolatilityForSymbol(symbol)
    const trend = this.getTrendForSymbol(symbol)
    
    const currentDate = new Date(startDate)
    let previousClose = basePrice
    
    while (currentDate <= endDate) {
      // Skip weekends (simplified)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }
      
      // Generate daily price movement
      const randomReturn = this.generateRandomReturn(volatility, trend)
      const open = previousClose * (1 + randomReturn * 0.2) // Gap
      const dayRange = Math.abs(randomReturn) * 2
      
      const high = Math.max(open, previousClose) * (1 + dayRange * Math.random())
      const low = Math.min(open, previousClose) * (1 - dayRange * Math.random())
      const close = previousClose * (1 + randomReturn)
      
      // Generate volume
      const baseVolume = this.getBaseVolumeForSymbol(symbol)
      const volumeMultiplier = 0.5 + Math.random() * 1.5 // Random volume variation
      const volume = Math.floor(baseVolume * volumeMultiplier)
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        timestamp: currentDate.getTime(),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        adjustedClose: Number(close.toFixed(2))
      })
      
      previousClose = close
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return data
  }

  /**
   * Get base price for symbol (mock data)
   */
  private getBasePriceForSymbol(symbol: string): number {
    const basePrices: Record<string, number> = {
      'AAPL': 150,
      'GOOGL': 2500,
      'MSFT': 300,
      'TSLA': 200,
      'AMZN': 3200,
      'META': 280,
      'NVDA': 400,
      'BTC-USD': 45000,
      'ETH-USD': 3000,
      'SPY': 420
    }
    return basePrices[symbol] || 100
  }

  /**
   * Get volatility for symbol (annualized)
   */
  private getVolatilityForSymbol(symbol: string): number {
    const volatilities: Record<string, number> = {
      'AAPL': 0.25,
      'GOOGL': 0.30,
      'MSFT': 0.22,
      'TSLA': 0.60,
      'AMZN': 0.35,
      'META': 0.40,
      'NVDA': 0.50,
      'BTC-USD': 1.2,
      'ETH-USD': 1.5,
      'SPY': 0.18
    }
    return volatilities[symbol] || 0.30
  }

  /**
   * Get trend bias for symbol
   */
  private getTrendForSymbol(symbol: string): number {
    const trends: Record<string, number> = {
      'AAPL': 0.08,   // 8% annual growth bias
      'GOOGL': 0.12,  // 12% annual growth bias
      'MSFT': 0.10,
      'TSLA': 0.15,
      'AMZN': 0.09,
      'META': 0.06,
      'NVDA': 0.20,
      'BTC-USD': 0.50, // High growth bias for crypto
      'ETH-USD': 0.60,
      'SPY': 0.07
    }
    return trends[symbol] || 0.05
  }

  /**
   * Get base volume for symbol
   */
  private getBaseVolumeForSymbol(symbol: string): number {
    const volumes: Record<string, number> = {
      'AAPL': 50000000,
      'GOOGL': 1200000,
      'MSFT': 25000000,
      'TSLA': 20000000,
      'AMZN': 3000000,
      'META': 15000000,
      'NVDA': 30000000,
      'BTC-USD': 1000000,
      'ETH-USD': 800000,
      'SPY': 60000000
    }
    return volumes[symbol] || 1000000
  }

  /**
   * Generate random return with trend bias
   */
  private generateRandomReturn(volatility: number, trend: number): number {
    // Convert annual volatility to daily
    const dailyVol = volatility / Math.sqrt(252)
    const dailyTrend = trend / 252
    
    // Box-Muller transform for normal distribution
    const u1 = Math.random()
    const u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    
    return dailyTrend + dailyVol * z
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(symbol: string): boolean {
    const cached = this.cache[symbol]
    if (!cached) return false
    
    const now = Date.now()
    return (now - cached.lastUpdated) < this.CACHE_DURATION
  }

  /**
   * Cache historical data
   */
  private cacheData(symbol: string, data: HistoricalDataPoint[]): void {
    this.cache[symbol] = {
      data,
      lastUpdated: Date.now(),
      indicators: {}
    }
  }

  /**
   * Filter data by period
   */
  private filterDataByPeriod(
    data: HistoricalDataPoint[], 
    period: BacktestPeriod
  ): HistoricalDataPoint[] {
    const startTime = new Date(period.startDate).getTime()
    const endTime = new Date(period.endDate).getTime()
    
    return data.filter(point => 
      point.timestamp >= startTime && point.timestamp <= endTime
    )
  }

  /**
   * Get available symbols for backtesting
   */
  getAvailableSymbols(): string[] {
    return [
      'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA',
      'BTC-USD', 'ETH-USD', 'SPY'
    ]
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {}
  }
}

// Singleton instance
export const historicalDataService = new HistoricalDataService()