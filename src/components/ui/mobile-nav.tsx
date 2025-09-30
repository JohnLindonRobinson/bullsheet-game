import { useState } from 'react'
import { Button } from './button'
import { XpBar } from './xp-bar'

interface MobileNavProps {
  activePanel: string
  onPanelChange: (panel: string) => void
}

export function MobileNav({ activePanel, onPanelChange }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const panels = [
    { id: 'chart', label: '📈 Chart', icon: '📊' },
    { id: 'trade', label: '💼 Trade', icon: '🎯' },
    { id: 'positions', label: '📋 Positions', icon: '💰' },
    { id: 'challenges', label: '🎮 Challenges', icon: '🏆' },
    { id: 'news', label: '📰 News', icon: '📱' }
  ]

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-paper border-b border-grid-blue">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-handwrite text-paper-blue">
              📊 BullSheet
            </h1>
            <span className="text-xs bg-muted-lilac/20 px-2 py-1 rounded-full">
              v0.2
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-8 w-8 p-0"
          >
            <span className="text-lg">{isMenuOpen ? '✕' : '☰'}</span>
          </Button>
        </div>
        
        {/* XP Bar - Always visible on mobile */}
        <div className="px-4 pb-3">
          <XpBar />
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-paper border-b border-grid-blue shadow-paper-lg">
            <div className="grid grid-cols-2 gap-2 p-4">
              {panels.map((panel) => (
                <Button
                  key={panel.id}
                  variant={activePanel === panel.id ? 'default' : 'outline'}
                  className="h-12 flex flex-col items-center justify-center gap-1"
                  onClick={() => {
                    onPanelChange(panel.id)
                    setIsMenuOpen(false)
                  }}
                >
                  <span className="text-base">{panel.icon}</span>
                  <span className="text-xs">{panel.label.split(' ')[1]}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper border-t border-grid-blue">
        <div className="grid grid-cols-5 gap-0">
          {panels.map((panel) => (
            <Button
              key={panel.id}
              variant={activePanel === panel.id ? 'default' : 'ghost'}
              className="h-12 rounded-none flex flex-col items-center justify-center gap-1 border-r border-grid-blue last:border-r-0"
              onClick={() => onPanelChange(panel.id)}
            >
              <span className="text-lg">{panel.icon}</span>
              <span className="text-xs">{panel.label.split(' ')[1]}</span>
            </Button>
          ))}
        </div>
      </nav>
    </>
  )
}