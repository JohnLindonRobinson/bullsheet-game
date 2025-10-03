import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BacktestResults as BacktestResultsType } from '@/types/backtesting'
import { 
  TrendingUp, 
  TrendingDown, 
  // DollarSign, 
  Calendar, 
  Target,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react'

interface BacktestResultsProps {
  results: BacktestResultsType
}

export function BacktestResults({ results }: BacktestResultsProps) {
  const { performance, strategy, period, trades } = results

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? TrendingUp : TrendingDown
  }

  const getRiskScore = () => {
    // Simple risk scoring based on Sharpe ratio and max drawdown
    const sharpeScore = Math.min(performance.sharpeRatio * 20, 50)
    const drawdownScore = Math.max(50 - (performance.maxDrawdown * 500), 0)
    return Math.round((sharpeScore + drawdownScore) / 2)
  }

  return (
    <div className="space-y-6">
      {/* Strategy Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{strategy.name}</h2>
              <p className="text-muted-foreground">{strategy.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="capitalize">
                  {strategy.category.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {period.totalDays} days
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performance.totalReturn)}`}>
                  {formatPercentage(performance.totalReturn)}
                </p>
              </div>
              {React.createElement(getPerformanceIcon(performance.totalReturn), {
                className: `h-8 w-8 ${getPerformanceColor(performance.totalReturn)}`
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performance.sharpeRatio)}`}>
                  {performance.sharpeRatio.toFixed(2)}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPercentage(performance.winRate)}
                </p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatPercentage(performance.maxDrawdown)}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-lg font-semibold">{performance.totalTrades}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit Factor</p>
                <p className={`text-lg font-semibold ${getPerformanceColor(performance.profitFactor - 1)}`}>
                  {performance.profitFactor.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Win</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(performance.averageWin)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Loss</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(performance.averageLoss)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Largest Win</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(performance.largestWin)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Largest Loss</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(performance.largestLoss)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Risk Score</span>
                <span>{getRiskScore()}/100</span>
              </div>
              <Progress value={getRiskScore()} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Volatility</p>
                <p className="text-lg font-semibold">
                  {formatPercentage(performance.volatility)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calmar Ratio</p>
                <p className="text-lg font-semibold">
                  {performance.calmarRatio.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Winning Trades</p>
                <p className="text-lg font-semibold text-green-600">
                  {performance.winningTrades}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Losing Trades</p>
                <p className="text-lg font-semibold text-red-600">
                  {performance.losingTrades}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">P&L</th>
                  <th className="text-left p-2">Hold Period</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(-10).reverse().map((trade) => (
                  <tr key={trade.id} className="border-b">
                    <td className="p-2">
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'}>
                        {trade.type}
                      </Badge>
                    </td>
                    <td className="p-2">{trade.quantity}</td>
                    <td className="p-2">{formatCurrency(trade.price)}</td>
                    <td className={`p-2 ${trade.pnl ? getPerformanceColor(trade.pnl) : ''}`}>
                      {trade.pnl ? formatCurrency(trade.pnl) : '-'}
                    </td>
                    <td className="p-2">
                      {trade.holdingPeriod ? `${trade.holdingPeriod} days` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {trades.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing last 10 trades of {trades.length} total
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}