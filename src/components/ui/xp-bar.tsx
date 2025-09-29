import { Progress } from "./progress"
import { useUserStore } from "@/stores/userStore"

export function XpBar() {
  const { user } = useUserStore()
  
  if (!user) return null
  
  const xpForCurrentLevel = (user.level - 1) * 1000
  const xpForNextLevel = user.level * 1000
  const currentLevelProgress = user.xp - xpForCurrentLevel
  const progressPercentage = (currentLevelProgress / 1000) * 100
  
  return (
    <div className="flex items-center gap-4 bg-paper/80 backdrop-blur-sm rounded-lg p-3 border border-grid-blue shadow-paper">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-paper-blue rounded-full flex items-center justify-center text-paper font-bold text-sm">
          {user.level}
        </div>
        <span className="font-medium text-graphite">Level {user.level}</span>
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <Progress 
          value={progressPercentage} 
          className="h-2"
          showLabel={false}
        />
      </div>
      
      <div className="text-sm text-muted-foreground font-mono">
        {currentLevelProgress.toLocaleString()} / 1,000 XP
      </div>
    </div>
  )
}