import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Minimize2, Maximize2, X, Move, MoreHorizontal } from 'lucide-react'
import { PanelConfig, PanelState } from './panel-types'

interface PanelContainerProps {
  config: PanelConfig
  state: PanelState
  onStateChange: (newState: Partial<PanelState>) => void
  onClose?: () => void
  children: React.ReactNode
}

export function PanelContainer({ 
  config, 
  state, 
  onStateChange, 
  onClose, 
  children 
}: PanelContainerProps) {
  const [isDragging] = useState(false)
  
  const handleMinimize = () => {
    onStateChange({ isMinimized: !state.isMinimized })
  }
  
  const handleMaximize = () => {
    onStateChange({ isMaximized: !state.isMaximized })
  }
  
  const handleFloat = () => {
    onStateChange({ 
      isFloating: !state.isFloating,
      position: state.isFloating ? undefined : { x: 100, y: 100 }
    })
  }
  
  return (
    <Card 
      className={`
        h-full transition-all duration-200 border-2 border-grid-blue
        ${state.isMaximized ? 'fixed inset-4 z-50 shadow-2xl' : ''}
        ${state.isFloating ? 'absolute z-40 shadow-lg' : ''}
        ${isDragging ? 'cursor-move' : ''}
        bg-paper/95 backdrop-blur-sm
      `}
      style={{
        ...(state.isFloating && state.position ? {
          left: state.position.x,
          top: state.position.y,
          width: state.size?.width || config.defaultSize?.width || 400,
          height: state.size?.height || config.defaultSize?.height || 300
        } : {})
      }}
    >
      <CardHeader className="pb-2 bg-muted-lilac/10 border-b border-grid-blue">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <h3 className="font-handwrite text-lg text-graphite">{config.title}</h3>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Panel Controls */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-paper-blue/20"
              onClick={handleMinimize}
              title={state.isMinimized ? "Restore" : "Minimize"}
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-paper-blue/20"
              onClick={handleMaximize}
              title={state.isMaximized ? "Restore" : "Maximize"}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-paper-blue/20"
              onClick={handleFloat}
              title={state.isFloating ? "Dock" : "Float"}
            >
              <Move className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-paper-blue/20"
              title="More options"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
            
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-coral-red/20 text-coral-red"
                onClick={onClose}
                title="Close panel"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {!state.isMinimized && (
        <CardContent className="p-0 h-[calc(100%-4rem)] overflow-hidden">
          <div className="h-full w-full">
            {children}
          </div>
        </CardContent>
      )}
      
      {/* Resize Handles for Floating Panels */}
      {state.isFloating && !state.isMaximized && (
        <>
          {/* Corner Resize Handle */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-paper-blue/30 hover:bg-paper-blue/50 transition-colors"
            style={{
              clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
            }}
          />
          
          {/* Edge Resize Handles */}
          <div className="absolute inset-y-0 right-0 w-1 cursor-e-resize hover:bg-paper-blue/30 transition-colors" />
          <div className="absolute inset-x-0 bottom-0 h-1 cursor-s-resize hover:bg-paper-blue/30 transition-colors" />
        </>
      )}
    </Card>
  )
}