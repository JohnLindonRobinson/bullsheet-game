import { 
  StrategyDefinition, 
  BacktestPeriod, 
  BacktestConfiguration, 
  BacktestResults, 
  BacktestTrade, 
  TradingSignal, 
  HistoricalDataPoint,
  PerformanceMetrics,
  EquityPoint,
  DrawdownPoint,
  MonthlyReturn,
  TechnicalIndicator
} from '@/types/backtesting'
import { historicalDataService } from './historical-data'
import { technicalIndicatorsService } from './technical-indicators'

/**
 * Backtest Execution Engine
 * Runs backtests against historical data using defined strategies
 */
export class BacktestEngine {
  private config: BacktestConfiguration

  constructor(config: BacktestConfiguration) {
    this.config = config
  }

  /**
   * Execute a backtest for a given strategy
   */
  async executeBacktest(
    strategy: StrategyDefinition,
    symbol: string,
    period: BacktestPeriod
  ): Promise<BacktestResults> {
    try {
      // Fetch historical data
      const data = await historicalDataService.fetchHistoricalData(symbol, period)
      
      if (data.length === 0) {
        throw new Error('Insufficient historical data')
      }

      // Calculate technical indicators
      const indicators = this.calculateIndicators(data, strategy)
      
      // Generate trading signals
      const signals = this.generateSignals(data, indicators, strategy)
      
      // Execute trades based on signals
      const trades = this.executeTrades(data, signals, strategy)
      
      // Calculate performance metrics
      const performance = this.calculatePerformance(trades, data)
      
      // Generate equity curve
      const equityCurve = this.generateEquityCurve(trades, data)
      
      // Generate drawdown curve
      const drawdownCurve = this.generateDrawdownCurve(equityCurve)
      
      // Calculate monthly returns
      const monthlyReturns = this.calculateMonthlyReturns(equityCurve)

      return {
        strategy,
        period,
        trades,
        performance,
        equityCurve,
        drawdownCurve,
        monthlyReturns
      }
    } catch (error) {
      console.error('Backtest execution failed:', error)
      throw error
    }
  }

  /**
   * Calculate required technical indicators for strategy
   */
  private calculateIndicators(
    data: HistoricalDataPoint[], 
    strategy: StrategyDefinition
  ): Record<string, TechnicalIndicator> {
    const indicators: Record<string, TechnicalIndicator> = {}
    
    // Determine which indicators are needed
    const neededIndicators = this.getRequiredIndicators(strategy)
    
    for (const indicatorKey of neededIndicators) {
      switch (indicatorKey) {
        case 'SMA_FAST':
          indicators[indicatorKey] = technicalIndicatorsService.calculateSMA(
            data, 
            strategy.parameters.fastPeriod as number
          )
          break
          
        case 'SMA_SLOW':
          indicators[indicatorKey] = technicalIndicatorsService.calculateSMA(
            data, 
            strategy.parameters.slowPeriod as number
          )
          break
          
        case 'SMA_50':
          indicators[indicatorKey] = technicalIndicatorsService.calculateSMA(data, 50)
          break
          
        case 'SMA_200':
          indicators[indicatorKey] = technicalIndicatorsService.calculateSMA(data, 200)
          break
          
        case 'RSI':
          indicators[indicatorKey] = technicalIndicatorsService.calculateRSI(
            data, 
            strategy.parameters.rsiPeriod as number || 14
          )
          break
          
        case 'MACD_LINE':
        case 'MACD_SIGNAL': {
          const macd = technicalIndicatorsService.calculateMACD(
            data,
            strategy.parameters.macdFast as number || 12,
            strategy.parameters.macdSlow as number || 26,
            strategy.parameters.macdSignal as number || 9
          )
          indicators['MACD_LINE'] = macd
          indicators['MACD_SIGNAL'] = {
            name: 'MACD_SIGNAL',
            values: (macd.parameters as any).signalLine as number[],
            parameters: macd.parameters
          }
          break
        }
          
        case 'BB_UPPER':
        case 'BB_LOWER': {
          const bb = technicalIndicatorsService.calculateBollingerBands(
            data,
            strategy.parameters.bollingerPeriod as number || 20,
            strategy.parameters.bollingerStdDev as number || 2
          )
          indicators['BB_UPPER'] = {
            name: 'BB_UPPER',
            values: (bb.parameters as any).upperBand as number[],
            parameters: bb.parameters
          }
          indicators['BB_LOWER'] = {
            name: 'BB_LOWER',
            values: (bb.parameters as any).lowerBand as number[],
            parameters: bb.parameters
          }
          break
        }
          
        case 'STOCH_K': {
          const stoch = technicalIndicatorsService.calculateStochastic(
            data,
            strategy.parameters.stochPeriod as number || 14
          )
          indicators[indicatorKey] = stoch
          break
        }
          
        case 'EMA_8':
          indicators[indicatorKey] = technicalIndicatorsService.calculateEMA(data, 8)
          break
        case 'EMA_21':
          indicators[indicatorKey] = technicalIndicatorsService.calculateEMA(data, 21)
          break
        case 'EMA_55':
          indicators[indicatorKey] = technicalIndicatorsService.calculateEMA(data, 55)
          break
      }
    }
    
    return indicators
  }

  /**
   * Extract required indicators from strategy rules
   */
  private getRequiredIndicators(strategy: StrategyDefinition): Set<string> {
    const indicators = new Set<string>()
    
    const allRules = [
      ...strategy.rules.entry,
      ...strategy.rules.exit
    ]
    
    for (const rule of allRules) {
      if (rule.type === 'indicator' && rule.indicator) {
        indicators.add(rule.indicator)
        if (typeof rule.value === 'string' && rule.value.includes('_')) {
          indicators.add(rule.value)
        }
      }
    }
    
    return indicators
  }

  /**
   * Generate trading signals based on strategy rules
   */
  private generateSignals(
    data: HistoricalDataPoint[],
    indicators: Record<string, TechnicalIndicator>,
    strategy: StrategyDefinition
  ): TradingSignal[] {
    const signals: TradingSignal[] = []
    
    for (let i = 1; i < data.length; i++) {
      const point = data[i]
      
      // Check entry conditions
      const entrySignal = this.evaluateRules(
        strategy.rules.entry, 
        data, 
        indicators, 
        i
      )
      
      if (entrySignal) {
        signals.push({
          type: 'BUY',
          strength: entrySignal.strength,
          price: point.close,
          timestamp: point.timestamp,
          reason: entrySignal.reason
        })
      }
      
      // Check exit conditions
      const exitSignal = this.evaluateRules(
        strategy.rules.exit, 
        data, 
        indicators, 
        i
      )
      
      if (exitSignal) {
        signals.push({
          type: 'SELL',
          strength: exitSignal.strength,
          price: point.close,
          timestamp: point.timestamp,
          reason: exitSignal.reason
        })
      }
    }
    
    return signals
  }

  /**
   * Evaluate strategy rules at a given data point
   */
  private evaluateRules(
    rules: any[],
    data: HistoricalDataPoint[],
    indicators: Record<string, TechnicalIndicator>,
    index: number
  ): { strength: number; reason: string } | null {
    let conditionsMet = 0
    const reasons: string[] = []
    
    for (const rule of rules) {
      if (this.evaluateRule(rule, data, indicators, index)) {
        conditionsMet++
        reasons.push(rule.id)
      }
    }
    
    // All conditions must be met
    if (conditionsMet === rules.length && rules.length > 0) {
      return {
        strength: conditionsMet / rules.length,
        reason: reasons.join(', ')
      }
    }
    
    return null
  }

  /**
   * Evaluate a single rule
   */
  private evaluateRule(
    rule: any,
    data: HistoricalDataPoint[],
    indicators: Record<string, TechnicalIndicator>,
    index: number
  ): boolean {
    const lookbackIndex = Math.max(0, index - (rule.lookback || 0))
    
    try {
      switch (rule.type) {
        case 'indicator':
          return this.evaluateIndicatorRule(rule, indicators, index, lookbackIndex)
          
        case 'price':
          return this.evaluatePriceRule(rule, data, indicators, index)
          
        default:
          return false
      }
    } catch (error) {
      console.warn(`Rule evaluation error for ${rule.id}:`, error)
      return false
    }
  }

  /**
   * Evaluate indicator-based rules
   */
  private evaluateIndicatorRule(
    rule: any,
    indicators: Record<string, TechnicalIndicator>,
    index: number,
    lookbackIndex: number
  ): boolean {
    const indicator = indicators[rule.indicator]
    if (!indicator || index >= indicator.values.length) return false
    
    const currentValue = indicator.values[index]
    if (isNaN(currentValue)) return false
    
    switch (rule.operator) {
      case 'gt':
        if (typeof rule.value === 'string') {
          const compareIndicator = indicators[rule.value]
          return compareIndicator && currentValue > compareIndicator.values[index]
        }
        return currentValue > rule.value
        
      case 'lt':
        if (typeof rule.value === 'string') {
          const compareIndicator = indicators[rule.value]
          return compareIndicator && currentValue < compareIndicator.values[index]
        }
        return currentValue < rule.value
        
      case 'cross_above': {
        if (lookbackIndex >= indicator.values.length) return false
        const prevValue = indicator.values[lookbackIndex]
        if (typeof rule.value === 'string') {
          const compareIndicator = indicators[rule.value]
          if (!compareIndicator) return false
          const currentCompare = compareIndicator.values[index]
          const prevCompare = compareIndicator.values[lookbackIndex]
          return prevValue <= prevCompare && currentValue > currentCompare
        }
        return prevValue <= rule.value && currentValue > rule.value
      }
        
      case 'cross_below': {
        if (lookbackIndex >= indicator.values.length) return false
        const prevVal = indicator.values[lookbackIndex]
        if (typeof rule.value === 'string') {
          const compareIndicator = indicators[rule.value]
          if (!compareIndicator) return false
          const currentCompare = compareIndicator.values[index]
          const prevCompare = compareIndicator.values[lookbackIndex]
          return prevVal >= prevCompare && currentValue < currentCompare
        }
        return prevVal >= rule.value && currentValue < rule.value
      }
        
      default:
        return false
    }
  }

  /**
   * Evaluate price-based rules
   */
  private evaluatePriceRule(
    rule: any,
    data: HistoricalDataPoint[],
    indicators: Record<string, TechnicalIndicator>,
    index: number
  ): boolean {
    const currentPrice = data[index].close
    
    switch (rule.operator) {
      case 'gt':
        if (typeof rule.value === 'string') {
          const indicator = indicators[rule.value]
          return indicator && currentPrice > indicator.values[index]
        }
        return currentPrice > rule.value
        
      case 'lt':
        if (typeof rule.value === 'string') {
          const indicator = indicators[rule.value]
          return indicator && currentPrice < indicator.values[index]
        }
        return currentPrice < rule.value
        
      default:
        return false
    }
  }

  /**
   * Execute trades based on signals
   */
  private executeTrades(
    _data: HistoricalDataPoint[],
    signals: TradingSignal[],
    strategy: StrategyDefinition
  ): BacktestTrade[] {
    const trades: BacktestTrade[] = []
    let position = 0
    let entryPrice = 0
    let entryTime = 0
    let tradeId = 1
    
    for (const signal of signals) {
      const commission = this.config.commission
      
      if (signal.type === 'BUY' && position === 0) {
        // Enter long position
        const quantity = this.calculatePositionSize(signal.price, strategy)
        position = quantity
        entryPrice = signal.price
        entryTime = signal.timestamp
        
        trades.push({
          id: `trade-${tradeId++}`,
          type: 'BUY',
          symbol: 'SYMBOL', // Would be passed from caller
          quantity,
          price: signal.price,
          timestamp: signal.timestamp,
          commission
        })
        
      } else if (signal.type === 'SELL' && position > 0) {
        // Exit long position
        const pnl = (signal.price - entryPrice) * position - (commission * 2)
        const holdingPeriod = Math.floor((signal.timestamp - entryTime) / (24 * 60 * 60 * 1000))
        
        trades.push({
          id: `trade-${tradeId++}`,
          type: 'SELL',
          symbol: 'SYMBOL',
          quantity: position,
          price: signal.price,
          timestamp: signal.timestamp,
          commission,
          pnl,
          holdingPeriod
        })
        
        position = 0
      }
      
      // Apply risk management rules
      if (position > 0) {
        const shouldExit = this.checkRiskManagement(
          strategy.rules.riskManagement,
          entryPrice,
          signal.price
        )
        
        if (shouldExit) {
          // Force exit due to risk management
          const pnl = (signal.price - entryPrice) * position - (commission * 2)
          const holdingPeriod = Math.floor((signal.timestamp - entryTime) / (24 * 60 * 60 * 1000))
          
          trades.push({
            id: `trade-${tradeId++}`,
            type: 'SELL',
            symbol: 'SYMBOL',
            quantity: position,
            price: signal.price,
            timestamp: signal.timestamp,
            commission,
            pnl,
            holdingPeriod
          })
          
          position = 0
        }
      }
    }
    
    return trades
  }

  /**
   * Calculate position size based on strategy parameters
   */
  private calculatePositionSize(price: number, strategy: StrategyDefinition): number {
    const positionSize = strategy.parameters.positionSize as number || 100
    const maxPositionValue = this.config.initialCapital * 0.25 // Max 25% of capital
    
    return Math.floor(Math.min(positionSize, maxPositionValue / price))
  }

  /**
   * Check risk management rules
   */
  private checkRiskManagement(
    riskRules: any[],
    entryPrice: number,
    currentPrice: number
  ): boolean {
    for (const rule of riskRules) {
      const priceChange = (currentPrice - entryPrice) / entryPrice
      
      switch (rule.type) {
        case 'stop_loss':
          if (rule.unit === 'percent' && priceChange <= -(rule.value / 100)) {
            return true
          }
          break
          
        case 'take_profit':
          if (rule.unit === 'percent' && priceChange >= (rule.value / 100)) {
            return true
          }
          break
      }
    }
    
    return false
  }

  /**
   * Calculate performance metrics
   */
  private calculatePerformance(
    trades: BacktestTrade[],
    data: HistoricalDataPoint[]
  ): PerformanceMetrics {
    if (trades.length === 0) {
      return this.getEmptyPerformanceMetrics()
    }

    const completedTrades = trades.filter(t => t.pnl !== undefined)
    const pnls = completedTrades.map(t => t.pnl!)
    const totalPnL = pnls.reduce((sum, pnl) => sum + pnl, 0)
    const totalReturn = totalPnL / this.config.initialCapital
    
    const winners = pnls.filter(pnl => pnl > 0)
    const losers = pnls.filter(pnl => pnl < 0)
    
    const winRate = winners.length / completedTrades.length
    const averageWin = winners.length > 0 ? winners.reduce((a, b) => a + b) / winners.length : 0
    const averageLoss = losers.length > 0 ? Math.abs(losers.reduce((a, b) => a + b)) / losers.length : 0
    const profitFactor = averageLoss > 0 ? (averageWin * winners.length) / (averageLoss * losers.length) : Infinity
    
    const periods = data.length
    const annualizedReturn = totalReturn * (252 / periods)
    
    // Calculate volatility and Sharpe ratio (simplified)
    const returns = this.calculateDailyReturns(data)
    const volatility = this.calculateVolatility(returns)
    const sharpeRatio = volatility > 0 ? (annualizedReturn - this.config.riskFreeRate) / volatility : 0
    
    return {
      totalReturn,
      annualizedReturn,
      sharpeRatio,
      sortino: 0, // Simplified
      maxDrawdown: 0, // Will be calculated separately
      maxDrawdownDuration: 0,
      winRate,
      profitFactor,
      averageWin,
      averageLoss,
      totalTrades: completedTrades.length,
      winningTrades: winners.length,
      losingTrades: losers.length,
      largestWin: Math.max(...pnls, 0),
      largestLoss: Math.min(...pnls, 0),
      averageHoldingPeriod: completedTrades.reduce((sum, t) => sum + (t.holdingPeriod || 0), 0) / completedTrades.length,
      volatility,
      calmarRatio: 0, // Will be calculated after drawdown
      recoveryFactor: 0
    }
  }

  /**
   * Generate equity curve
   */
  private generateEquityCurve(
    trades: BacktestTrade[],
    data: HistoricalDataPoint[]
  ): EquityPoint[] {
    const equityCurve: EquityPoint[] = []
    let currentEquity = this.config.initialCapital
    let tradeIndex = 0
    
    for (let i = 0; i < data.length; i++) {
      const point = data[i]
      
      // Check if there's a completed trade at this timestamp
      while (tradeIndex < trades.length && 
             trades[tradeIndex].timestamp <= point.timestamp &&
             trades[tradeIndex].pnl !== undefined) {
        currentEquity += trades[tradeIndex].pnl!
        tradeIndex++
      }
      
      const returns = i === 0 ? 0 : (currentEquity - this.config.initialCapital) / this.config.initialCapital
      
      equityCurve.push({
        date: point.date,
        timestamp: point.timestamp,
        equity: currentEquity,
        returns,
        drawdown: 0 // Will be calculated separately
      })
    }
    
    return equityCurve
  }

  /**
   * Generate drawdown curve
   */
  private generateDrawdownCurve(equityCurve: EquityPoint[]): DrawdownPoint[] {
    const drawdownCurve: DrawdownPoint[] = []
    let peak = equityCurve[0]?.equity || this.config.initialCapital
    
    for (const point of equityCurve) {
      if (point.equity > peak) {
        peak = point.equity
      }
      
      const drawdown = (peak - point.equity) / peak
      point.drawdown = drawdown
      
      drawdownCurve.push({
        date: point.date,
        timestamp: point.timestamp,
        drawdown,
        peak,
        isRecovery: point.equity >= peak * 0.95
      })
    }
    
    return drawdownCurve
  }

  /**
   * Calculate monthly returns
   */
  private calculateMonthlyReturns(equityCurve: EquityPoint[]): MonthlyReturn[] {
    const monthlyReturns: MonthlyReturn[] = []
    const monthlyData: Record<string, { start: number; end: number; trades: number }> = {}
    
    for (const point of equityCurve) {
      const date = new Date(point.timestamp)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      
      if (!monthlyData[key]) {
        monthlyData[key] = { start: point.equity, end: point.equity, trades: 0 }
      }
      monthlyData[key].end = point.equity
    }
    
    for (const [key, data] of Object.entries(monthlyData)) {
      const [year, month] = key.split('-').map(Number)
      const monthReturn = (data.end - data.start) / data.start
      
      monthlyReturns.push({
        year,
        month: month + 1,
        return: monthReturn,
        trades: data.trades
      })
    }
    
    return monthlyReturns.sort((a, b) => a.year - b.year || a.month - b.month)
  }

  /**
   * Helper methods
   */
  private calculateDailyReturns(data: HistoricalDataPoint[]): number[] {
    const returns: number[] = []
    for (let i = 1; i < data.length; i++) {
      const ret = (data[i].close - data[i - 1].close) / data[i - 1].close
      returns.push(ret)
    }
    return returns
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0
    
    const mean = returns.reduce((a, b) => a + b) / returns.length
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length
    return Math.sqrt(variance * 252) // Annualized
  }

  private getEmptyPerformanceMetrics(): PerformanceMetrics {
    return {
      totalReturn: 0,
      annualizedReturn: 0,
      sharpeRatio: 0,
      sortino: 0,
      maxDrawdown: 0,
      maxDrawdownDuration: 0,
      winRate: 0,
      profitFactor: 0,
      averageWin: 0,
      averageLoss: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      largestWin: 0,
      largestLoss: 0,
      averageHoldingPeriod: 0,
      volatility: 0,
      calmarRatio: 0,
      recoveryFactor: 0
    }
  }
}

// Default configuration
export const defaultBacktestConfig: BacktestConfiguration = {
  initialCapital: 100000,
  commission: 5,
  slippage: 0.001,
  allowShortSelling: false,
  maxPositionSize: 0.25,
  riskFreeRate: 0.02
}