import { useState, useEffect } from 'react'
import { MobileNav } from '@/components/ui/mobile-nav'
import { MobileOrderTicket } from '@/components/trading/mobile-order-ticket'
import { PositionsTable } from '@/components/trading/positions-table'
import { MobileChart } from '@/components/trading/mobile-chart'
import { ChallengeCard } from '@/components/gamification/challenge-card'
import { NewsFeed } from '@/components/news/news-feed'
import { useChallengeStore } from '@/stores/challengeStore'

export function MobileDashboard() {
  const [activePanel, setActivePanel] = useState('chart')
  const { challenges, initializeChallenges } = useChallengeStore()

  // Initialize challenges on mount
  useEffect(() => {
    if (challenges.length === 0) {
      initializeChallenges()
    }
  }, [challenges.length, initializeChallenges])

  const activeChallenge = challenges.find(c => c.status === 'in_progress')
  const availableChallenges = challenges.filter(c => c.status === 'available')

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'chart':
        return (
          <div className="h-full">
            <MobileChart symbol="AAPL" />
          </div>
        )
      
      case 'trade':
        return <MobileOrderTicket />
      
      case 'positions':
        return <PositionsTable />
      
      case 'challenges':
        return (
          <div className="space-y-4">
            {activeChallenge && (
              <div>
                <h3 className="text-lg font-handwrite mb-3">🎯 Active Challenge</h3>
                <ChallengeCard challenge={activeChallenge} isActive={true} />
              </div>
            )}
            
            {availableChallenges.length > 0 && (
              <div>
                <h3 className="text-lg font-handwrite mb-3">🎮 Available Challenges</h3>
                <div className="space-y-3">
                  {availableChallenges.slice(0, 3).map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      
      case 'news':
        return <NewsFeed />
      
      default:
        return <div>Panel not found</div>
    }
  }

  return (
    <div className="lg:hidden min-h-screen bg-paper">
      <MobileNav activePanel={activePanel} onPanelChange={setActivePanel} />
      
      {/* Main Content Area */}
      <main className="pb-12 pt-4"> {/* Bottom padding for nav, top padding for content */}
        <div className="container mx-auto px-4">
          {renderActivePanel()}
        </div>
      </main>
    </div>
  )
}