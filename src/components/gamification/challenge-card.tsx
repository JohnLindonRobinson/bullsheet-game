import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Challenge } from "@/types"
import { useChallengeStore } from "@/stores/challengeStore"

interface ChallengeCardProps {
  challenge: Challenge
  isActive?: boolean
}

export function ChallengeCard({ challenge, isActive = false }: ChallengeCardProps) {
  const { startChallenge } = useChallengeStore()
  
  const getStatusEmoji = (status: Challenge['status']) => {
    switch (status) {
      case 'locked': return '🔒'
      case 'available': return '✨'
      case 'in_progress': return '⚡'
      case 'completed': return '✅'
      default: return '❓'
    }
  }
  
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-finance-green'
      case 'medium': return 'text-paper-blue'
      case 'hard': return 'text-coral-red'
      default: return 'text-muted-foreground'
    }
  }
  
  const canStart = challenge.status === 'available'
  const isInProgress = challenge.status === 'in_progress'
  const isCompleted = challenge.status === 'completed'
  const isLocked = challenge.status === 'locked'
  
  return (
    <Card 
      className={`transition-all duration-200 ${
        isActive ? 'ring-2 ring-paper-blue shadow-paper-lg' : ''
      } ${isLocked ? 'opacity-60' : ''}`}
      sticky={isActive}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{challenge.badge?.icon || '🎯'}</span>
            <div>
              <CardTitle className="text-lg font-handwrite flex items-center gap-2">
                {challenge.name}
                <span className="text-sm">{getStatusEmoji(challenge.status)}</span>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium uppercase tracking-wide ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">
                  🏆 {challenge.xpReward} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {challenge.description}
        </p>
        
        {/* Requirements */}
        <div className="space-y-2">
          {challenge.requirements.map((req, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{req.type}</span>
                <span className="font-mono">
                  {req.current}/{req.target}
                </span>
              </div>
              <Progress 
                value={(req.current / req.target) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
        
        {/* Progress bar for overall challenge */}
        {(isInProgress || isCompleted) && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span>Overall Progress</span>
              <span>{Math.round(challenge.progress)}%</span>
            </div>
            <Progress 
              value={challenge.progress}
              className="h-3"
            />
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {canStart && (
            <Button 
              onClick={() => startChallenge(challenge.id)}
              variant="success"
              size="sm"
              className="flex-1"
            >
              🚀 Start Challenge
            </Button>
          )}
          
          {isInProgress && (
            <Button 
              variant="outline"
              size="sm"
              className="flex-1"
              disabled
            >
              ⚡ In Progress...
            </Button>
          )}
          
          {isCompleted && (
            <Button 
              variant="success"
              size="sm"
              className="flex-1"
              disabled
            >
              ✅ Completed!
            </Button>
          )}
          
          {isLocked && (
            <Button 
              variant="ghost"
              size="sm"
              className="flex-1"
              disabled
            >
              🔒 Locked
            </Button>
          )}
        </div>
        
        {/* Badge preview */}
        {challenge.badge && (
          <div className="border-t border-grid-blue pt-3 mt-3">
            <div className="text-xs text-muted-foreground mb-1">Reward Badge:</div>
            <div className="flex items-center gap-2 p-2 bg-muted-lilac/10 rounded-lg">
              <span className="text-lg">{challenge.badge.icon}</span>
              <div>
                <div className="font-medium text-sm">{challenge.badge.name}</div>
                <div className="text-xs text-muted-foreground">{challenge.badge.description}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}