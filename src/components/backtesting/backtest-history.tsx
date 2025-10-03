// import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBacktestStore } from '@/stores/backtestStore'
import { BacktestResults } from '@/types/backtesting'
import { Trash2, Eye, History, TrendingUp, TrendingDown } from 'lucide-react'

export function BacktestHistory() {
  const { backtestHistory, setStrategy } = useBacktestStore()

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const handleLoadStrategy = (results: BacktestResults) => {
    setStrategy(results.strategy)
  }

  if (backtestHistory.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-muted-foreground">
            <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No backtest history</p>
            <p className="text-sm">Run some backtests to see your history here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Backtest History</h3>
        <Badge variant="outline">
          {backtestHistory.length} backtests
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {backtestHistory.map((results, index) => (
          <Card key={`${results.strategy.id}-${index}`} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm truncate">
                  {results.strategy.name}
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className="capitalize text-xs"
                >
                  {results.strategy.category.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(results.period.startDate)} - {formatDate(results.period.endDate)}
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Total Return</span>
                  <div className={`font-semibold ${getPerformanceColor(results.performance.totalReturn)}`}>
                    {formatPercentage(results.performance.totalReturn)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Sharpe Ratio</span>
                  <div className={`font-semibold ${getPerformanceColor(results.performance.sharpeRatio)}`}>
                    {results.performance.sharpeRatio.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Win Rate</span>
                  <div className="font-semibold text-blue-600">
                    {formatPercentage(results.performance.winRate)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Max DD</span>
                  <div className="font-semibold text-red-600">
                    {formatPercentage(results.performance.maxDrawdown)}
                  </div>
                </div>
              </div>

              {/* Performance Indicator */}
              <div className="flex items-center justify-center py-2">
                {results.performance.totalReturn >= 0 ? (
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Profitable</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Loss</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadStrategy(results)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Load
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Trade Count */}
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  {results.performance.totalTrades} trades
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}