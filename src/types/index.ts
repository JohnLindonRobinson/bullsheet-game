export interface User {
  id: string
  username: string
  email: string
  xp: number
  level: number
  badges: Badge[]
  createdAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
}

export interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  timestamp: Date
  status: 'filled' | 'pending' | 'cancelled'
}

export interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  unrealizedPnL: number
  unrealizedPnLPercentage: number
}

export interface Portfolio {
  totalValue: number
  totalPnL: number
  totalPnLPercentage: number
  buyingPower: number
  positions: Position[]
}

export interface Challenge {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  badge?: Badge
  requirements: ChallengeRequirement[]
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  progress: number
}

export interface ChallengeRequirement {
  type: 'trades' | 'profit' | 'drawdown' | 'streak' | 'symbols' | 'time' | 'risk_mgmt' | 'volume'
  target: number
  current: number
  timeframe?: 'day' | 'week' | 'month'
  metadata?: Record<string, any>
}

export interface News {
  id: string
  title: string
  summary: string
  url: string
  timestamp: Date
  sentiment: 'positive' | 'negative' | 'neutral'
  symbols: string[]
}

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: Date
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface BacktestResult {
  id: string
  name: string
  strategy: string
  startDate: Date
  endDate: Date
  initialCapital: number
  finalValue: number
  totalReturn: number
  totalReturnPercentage: number
  maxDrawdown: number
  sharpeRatio: number
  winRate: number
  trades: Trade[]
  equityCurve: Array<{ date: Date; value: number }>
}