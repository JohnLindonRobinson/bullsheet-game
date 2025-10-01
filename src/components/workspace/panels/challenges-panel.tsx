import { ChallengeCard } from '@/components/gamification/challenge-card'
import { ChallengeStats } from '@/components/gamification/challenge-stats'
import { useChallengeStore } from '@/stores/challengeStore'
import { useEffect } from 'react'

export function ChallengesPanel() {
  const { challenges, initializeChallenges } = useChallengeStore()
  
  useEffect(() => {
    if (challenges.length === 0) {
      initializeChallenges()
    }
  }, [challenges.length, initializeChallenges])
  
  const activeChallenge = challenges.find(c => c.status === 'in_progress')
  const availableChallenges = challenges.filter(c => c.status === 'available').slice(0, 3)
  
  return (
    <div className="h-full p-2 space-y-4 overflow-y-auto">
      {/* Challenge Statistics */}
      <ChallengeStats />
      
      {/* Active Challenge */}
      {activeChallenge && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Challenge</h3>
          <ChallengeCard challenge={activeChallenge} isActive={true} />
        </div>
      )}
      
      {/* Available Challenges */}
      {availableChallenges.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Available Challenges</h3>
          <div className="space-y-3">
            {availableChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}