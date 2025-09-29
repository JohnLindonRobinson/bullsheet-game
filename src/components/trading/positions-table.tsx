import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolioStore } from "@/stores/portfolioStore"
import { formatCurrency, formatPercentage } from "@/lib/utils"

export function PositionsTable() {
  const { portfolio } = usePortfolioStore()
  
  if (portfolio.positions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-handwrite">📋 Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📈</div>
            <p>No positions yet</p>
            <p className="text-sm">Make your first trade to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-handwrite">📋 Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-notebook">
            <thead>
              <tr className="border-b border-grid-blue">
                <th className="text-left py-2 font-medium">Symbol</th>
                <th className="text-right py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Avg Price</th>
                <th className="text-right py-2 font-medium">Current</th>
                <th className="text-right py-2 font-medium">P&L</th>
                <th className="text-right py-2 font-medium">P&L%</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.positions.map((position) => (
                <tr key={position.symbol} className="border-b border-grid-blue/50">
                  <td className="py-2 font-medium">{position.symbol}</td>
                  <td className="text-right py-2">{position.quantity}</td>
                  <td className="text-right py-2">{formatCurrency(position.avgPrice)}</td>
                  <td className="text-right py-2">{formatCurrency(position.currentPrice)}</td>
                  <td className={`text-right py-2 font-medium ${
                    position.unrealizedPnL >= 0 ? 'text-finance-green' : 'text-coral-red'
                  }`}>
                    {formatCurrency(position.unrealizedPnL)}
                  </td>
                  <td className={`text-right py-2 font-medium ${
                    position.unrealizedPnLPercentage >= 0 ? 'text-finance-green' : 'text-coral-red'
                  }`}>
                    {formatPercentage(position.unrealizedPnLPercentage)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 pt-4 border-t border-grid-blue">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Portfolio Value:</span>
            <span className="font-bold text-lg">{formatCurrency(portfolio.totalValue)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-muted-foreground">Total P&L:</span>
            <span className={`font-medium ${
              portfolio.totalPnL >= 0 ? 'text-finance-green' : 'text-coral-red'
            }`}>
              {formatCurrency(portfolio.totalPnL)} ({formatPercentage(portfolio.totalPnLPercentage)})
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-muted-foreground">Buying Power:</span>
            <span className="font-medium">{formatCurrency(portfolio.buyingPower)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}