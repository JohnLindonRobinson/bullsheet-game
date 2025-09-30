import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HotkeyAction, formatHotkey, HOTKEY_CATEGORIES } from '@/hooks/useHotkeys'

interface HotkeyHelpModalProps {
  isOpen: boolean
  onClose: () => void
  hotkeys: HotkeyAction[]
}

export function HotkeyHelpModal({ isOpen, onClose, hotkeys }: HotkeyHelpModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Group hotkeys by category
  const groupedHotkeys = hotkeys.reduce((groups, hotkey) => {
    const category = hotkey.category || HOTKEY_CATEGORIES.GENERAL
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(hotkey)
    return groups
  }, {} as Record<string, HotkeyAction[]>)
  
  // Filter hotkeys based on search term
  const filteredGroups = Object.entries(groupedHotkeys).reduce((filtered, [category, actions]) => {
    const filteredActions = actions.filter(action => {
      const searchLower = searchTerm.toLowerCase()
      return (
        action.description.toLowerCase().includes(searchLower) ||
        action.keys.some(key => key.toLowerCase().includes(searchLower)) ||
        category.toLowerCase().includes(searchLower)
      )
    })
    
    if (filteredActions.length > 0) {
      filtered[category] = filteredActions
    }
    
    return filtered
  }, {} as Record<string, HotkeyAction[]>)
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⌨️ Keyboard Shortcuts
            <Badge variant="secondary" className="text-xs">
              {hotkeys.length} shortcuts
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              🔍
            </div>
          </div>
          
          {/* Hotkey Groups */}
          <div className="overflow-y-auto max-h-[60vh] space-y-6">
            {Object.entries(filteredGroups).map(([category, actions]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-handwrite text-lg text-graphite border-b border-grid-blue pb-1">
                  {category}
                </h3>
                
                <div className="space-y-2">
                  {actions.map((action, index) => (
                    <div
                      key={`${category}-${index}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted-lilac/10 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.description}</p>
                      </div>
                      
                      <div className="flex gap-1">
                        {action.keys.map((key, keyIndex) => (
                          <kbd
                            key={keyIndex}
                            className="px-2 py-1 text-xs font-mono bg-muted border rounded shadow-sm"
                          >
                            {formatHotkey([key])}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(filteredGroups).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">🔍</div>
                <p>No shortcuts found for "{searchTerm}"</p>
                <p className="text-sm mt-1">Try searching for "trade", "buy", or "help"</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-grid-blue">
            <div className="text-xs text-muted-foreground">
              💡 Tip: Press <kbd className="px-1 py-0.5 text-xs bg-muted border rounded">?</kbd> anytime to open this help
            </div>
            <Button onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}