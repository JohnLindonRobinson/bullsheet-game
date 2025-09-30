import { useEffect } from 'react'
import { XpBar } from "@/components/ui/xp-bar"
import { OrderTicket } from "@/components/trading/order-ticket"
import { PositionsTable } from "@/components/trading/positions-table"
import { EnhancedChart } from "@/components/trading/enhanced-chart"
import { ChallengeCard } from "@/components/gamification/challenge-card"
import { NewsFeed } from "@/components/news/news-feed"
import { Button } from "@/components/ui/button"
import { useChallengeStore } from "@/stores/challengeStore"

export function Dashboard() {
  const { challenges, initializeChallenges } = useChallengeStore()
  
  // Initialize challenges on mount
  useEffect(() => {
    if (challenges.length === 0) {
      initializeChallenges()
    }
  }, [challenges.length, initializeChallenges])
  
  const activeChallenge = challenges.find(c => c.status === 'in_progress')
  const availableChallenges = challenges.filter(c => c.status === 'available').slice(0, 2)
  
  return (
    <div className="min-h-screen bg-paper">
      {/* Header with XP Bar */}
      <header className="sticky top-0 z-50 border-b border-grid-blue bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold font-handwrite text-paper-blue">
                📊 BullSheet
              </h1>
              <span className="text-sm text-muted-foreground bg-muted-lilac/20 px-2 py-1 rounded-full">
                v0.1 MVP
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                💾 Save Portfolio
              </Button>
              <Button variant="ghost" size="sm">
                ⚙️ Settings
              </Button>
            </div>
          </div>
          
          <XpBar />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Order Ticket */}
          <div className="lg:col-span-3">
            <OrderTicket />
          </div>

          {/* Center - Chart Area */}
          <div className="lg:col-span-6">
            <EnhancedChart symbol="AAPL" />
          </div>

          {/* Right Sidebar - Challenges & News */}
          <div className="lg:col-span-3 space-y-6">
            {/* Active Challenge */}
            {activeChallenge && (
              <ChallengeCard challenge={activeChallenge} isActive={true} />
            )}
            
            {/* Available Challenges */}
            {availableChallenges.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-handwrite text-graphite">🎮 Available Challenges</h3>
                {availableChallenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            )}

            {/* News Feed */}
            <NewsFeed />
          </div>
        </div>

        {/* Bottom Section - Positions */}
        <div className="mt-8">
          <PositionsTable />
        </div>
      </main>
    </div>
  )
}