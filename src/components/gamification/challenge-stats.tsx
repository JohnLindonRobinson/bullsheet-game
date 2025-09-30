import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useChallengeStore } from "@/stores/challengeStore"

export function ChallengeStats() {
  const { streakData, completedChallenges } = useChallengeStore()
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  
  const today = new Date().toDateString()
  const todayTrades = streakData.dailyTrades.find(d => d.date === today)?.count || 0
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-handwrite flex items-center gap-2">
          📊 Trading Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted-lilac/10 rounded-lg">
            <div className="text-2xl font-bold text-finance-green">
              {streakData.consecutiveWins}
            </div>
            <div className="text-xs text-muted-foreground">
              🔥 Current Streak
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted-lilac/10 rounded-lg">
            <div className="text-2xl font-bold text-paper-blue">
              {streakData.tradedSymbols.size}
            </div>
            <div className="text-xs text-muted-foreground">
              🌐 Symbols Traded
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted-lilac/10 rounded-lg">
            <div className="text-2xl font-bold text-amber-500">
              {todayTrades}
            </div>
            <div className="text-xs text-muted-foreground">
              ⚡ Today's Trades
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted-lilac/10 rounded-lg">
            <div className="text-2xl font-bold text-coral-red">
              {streakData.consecutiveTradingDays}
            </div>
            <div className="text-xs text-muted-foreground">
              🏃 Trading Days
            </div>
          </div>
        </div>
        
        <div className="border-t border-grid-blue pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Volume</span>
              <span className="font-mono font-medium">
                {formatCurrency(streakData.totalVolume)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Challenges Completed</span>
              <span className="font-mono font-medium text-finance-green">
                {completedChallenges.length}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Symbols Traded</span>
              <span className="font-mono text-xs text-muted-foreground">
                {Array.from(streakData.tradedSymbols).slice(0, 5).join(', ')}
                {streakData.tradedSymbols.size > 5 && ` +${streakData.tradedSymbols.size - 5} more`}
              </span>
            </div>
          </div>
        </div>
        
        {streakData.lastTradingDate && (
          <div className="text-xs text-muted-foreground text-center">
            Last traded: {new Date(streakData.lastTradingDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}