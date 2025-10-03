// Core backtesting types and interfaces
export interface HistoricalDataPoint {
  date: string
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjustedClose?: number
}

export interface BacktestPeriod {
  startDate: string
  endDate: string
  totalDays: number
}

export interface StrategyParameters {
  [key: string]: number | string | boolean
}

export interface TradingSignal {
  type: 'BUY' | 'SELL' | 'HOLD'
  strength: number // 0-1 confidence
  price: number
  timestamp: number
  reason: string
}

export interface BacktestTrade {
  id: string
  type: 'BUY' | 'SELL'
  symbol: string
  quantity: number
  price: number
  timestamp: number
  commission: number
  pnl?: number
  holdingPeriod?: number
}

export interface StrategyDefinition {
  id: string
  name: string
  description: string
  category: 'momentum' | 'mean_reversion' | 'breakout' | 'custom'
  parameters: StrategyParameters
  rules: {
    entry: StrategyRule[]
    exit: StrategyRule[]
    riskManagement: RiskRule[]
  }
}

export interface StrategyRule {
  id: string
  type: 'indicator' | 'price' | 'volume' | 'time' | 'custom'
  operator: 'gt' | 'lt' | 'eq' | 'cross_above' | 'cross_below'
  value: number | string
  indicator?: string
  lookback?: number
}

export interface RiskRule {
  type: 'stop_loss' | 'take_profit' | 'max_position_size' | 'max_daily_loss'
  value: number
  unit: 'percent' | 'dollars' | 'shares'
}

export interface BacktestResults {
  strategy: StrategyDefinition
  period: BacktestPeriod
  trades: BacktestTrade[]
  performance: PerformanceMetrics
  equityCurve: EquityPoint[]
  drawdownCurve: DrawdownPoint[]
  monthlyReturns: MonthlyReturn[]
}

export interface PerformanceMetrics {
  totalReturn: number
  annualizedReturn: number
  sharpeRatio: number
  sortino: number
  maxDrawdown: number
  maxDrawdownDuration: number
  winRate: number
  profitFactor: number
  averageWin: number
  averageLoss: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  largestWin: number
  largestLoss: number
  averageHoldingPeriod: number
  volatility: number
  calmarRatio: number
  recoveryFactor: number
}

export interface EquityPoint {
  date: string
  timestamp: number
  equity: number
  returns: number
  drawdown: number
}

export interface DrawdownPoint {
  date: string
  timestamp: number
  drawdown: number
  peak: number
  isRecovery: boolean
}

export interface MonthlyReturn {
  year: number
  month: number
  return: number
  trades: number
}

export interface BacktestConfiguration {
  initialCapital: number
  commission: number
  slippage: number
  allowShortSelling: boolean
  maxPositionSize: number
  riskFreeRate: number
}

export interface TechnicalIndicator {
  name: string
  values: number[]
  parameters: Record<string, number>
}

export interface MarketDataCache {
  [symbol: string]: {
    data: HistoricalDataPoint[]
    lastUpdated: number
    indicators: Record<string, TechnicalIndicator>
  }
}

// Gamification integration types
export interface BacktestChallenge {
  id: string
  name: string
  description: string
  strategy: StrategyDefinition
  requiredMetrics: {
    minReturn?: number
    maxDrawdown?: number
    minSharpe?: number
    minWinRate?: number
  }
  xpReward: number
  badgeId?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface BacktestAchievement {
  id: string
  name: string
  description: string
  condition: (results: BacktestResults) => boolean
  xpReward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// Error handling
export type BacktestError = 
  | 'INSUFFICIENT_DATA'
  | 'INVALID_PARAMETERS' 
  | 'STRATEGY_ERROR'
  | 'DATA_FETCH_ERROR'
  | 'CALCULATION_ERROR'