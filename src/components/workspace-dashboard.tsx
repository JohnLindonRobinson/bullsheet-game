import { useEffect } from 'react'
import { XpBar } from "@/components/ui/xp-bar"
import { Button } from "@/components/ui/button"
import { AudioControls } from "@/components/ui/audio-controls"
import { WorkspaceManager } from "@/components/workspace/workspace-manager"
import { useChallengeStore } from "@/stores/challengeStore"

export function WorkspaceDashboard() {
  const { challenges, initializeChallenges } = useChallengeStore()
  
  // Initialize challenges on mount
  useEffect(() => {
    if (challenges.length === 0) {
      initializeChallenges()
    }
  }, [challenges.length, initializeChallenges])
  
  return (
    <div className="min-h-screen bg-paper">
      {/* Header with XP Bar */}
      <header className="sticky top-0 z-50 border-b border-grid-blue bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold font-handwrite text-paper-blue">
                📊 BullSheet Pro
              </h1>
              <span className="text-sm text-muted-foreground bg-muted-lilac/20 px-2 py-1 rounded-full">
                v0.2 Workspace
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Audio Controls */}
              <AudioControls isCompact />
              
              <Button variant="outline" size="sm">
                💾 Save Layout
              </Button>
              <Button variant="outline" size="sm">
                📁 Load Layout
              </Button>
              <Button variant="ghost" size="sm">
                ⚙️ Settings
              </Button>
            </div>
          </div>
          
          <XpBar />
        </div>
      </header>

      {/* Workspace Area */}
      <main className="h-[calc(100vh-8rem)]">
        <WorkspaceManager initialLayout="default" />
      </main>
      
      {/* Footer */}
      <footer className="bg-paper border-t border-grid-blue p-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>🟢 Connected</span>
              <span>📡 Real-time Updates</span>
              <span>🎮 {challenges.filter(c => c.status === 'completed').length} Challenges Completed</span>
            </div>
            <div className="flex items-center gap-4">
              <span>💻 Workspace Mode</span>
              <span>⌨️ Press Ctrl+K for commands</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}