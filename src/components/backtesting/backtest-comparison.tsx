// import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBacktestStore } from '@/stores/backtestStore'
import { GitCompare } from 'lucide-react'

export function BacktestComparison() {
  const { backtestHistory } = useBacktestStore()

  if (backtestHistory.length < 2) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-muted-foreground">
            <GitCompare className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Strategy Comparison</p>
            <p className="text-sm">Run at least 2 backtests to compare strategies</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const getTopStrategies = () => {
    return backtestHistory
      .slice()
      .sort((a, b) => b.performance.totalReturn - a.performance.totalReturn)
      .slice(0, 5)
  }

  const topStrategies = getTopStrategies()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Strategy Comparison</h3>
        <Badge variant="outline">
          Top {Math.min(5, backtestHistory.length)} strategies
        </Badge>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Strategy</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Total Return</th>
                  <th className="text-left p-2">Sharpe Ratio</th>
                  <th className="text-left p-2">Win Rate</th>
                  <th className="text-left p-2">Max Drawdown</th>
                  <th className="text-left p-2">Total Trades</th>
                </tr>
              </thead>
              <tbody>
                {topStrategies.map((results, index) => (
                  <tr key={`${results.strategy.id}-${index}`} className="border-b">
                    <td className="p-2 font-medium">
                      {results.strategy.name}
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {results.strategy.category.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className={`p-2 font-semibold ${
                      results.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(results.performance.totalReturn)}
                    </td>
                    <td className={`p-2 font-semibold ${
                      results.performance.sharpeRatio >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {results.performance.sharpeRatio.toFixed(2)}
                    </td>
                    <td className="p-2 font-semibold text-blue-600">
                      {formatPercentage(results.performance.winRate)}
                    </td>
                    <td className="p-2 font-semibold text-red-600">
                      {formatPercentage(results.performance.maxDrawdown)}
                    </td>
                    <td className="p-2">
                      {results.performance.totalTrades}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['momentum', 'mean_reversion', 'breakout'].map(category => {
              const categoryResults = backtestHistory.filter(
                r => r.strategy.category === category
              )
              
              if (categoryResults.length === 0) return null
              
              const avgReturn = categoryResults.reduce(
                (sum, r) => sum + r.performance.totalReturn, 0
              ) / categoryResults.length
              
              const avgSharpe = categoryResults.reduce(
                (sum, r) => sum + r.performance.sharpeRatio, 0
              ) / categoryResults.length

              return (
                <div key={category} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium capitalize mb-2">
                    {category.replace('_', ' ')}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Avg Return:</span>
                      <span className={avgReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercentage(avgReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Sharpe:</span>
                      <span className={avgSharpe >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {avgSharpe.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Backtests:</span>
                      <span>{categoryResults.length}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}