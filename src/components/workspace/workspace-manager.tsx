import React, { useState, useCallback, useEffect } from 'react'
import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import { PanelContainer } from './panel-container'
import { PanelConfig, PanelState, PanelType, WorkspaceLayout } from './panel-types'
import { ChartPanel } from './panels/chart-panel'
import { OrderPanel } from './panels/order-panel'
import { PositionsPanel } from './panels/positions-panel'
import { NewsPanel } from './panels/news-panel'
import { ChallengesPanel } from './panels/challenges-panel'
import { MarketScannerPanel } from './panels/market-scanner-panel'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import 'react-mosaic-component/react-mosaic-component.css'

// Panel registry
const PANEL_COMPONENTS: Record<PanelType, React.ComponentType<any>> = {
  'chart': ChartPanel,
  'order-ticket': OrderPanel,
  'positions': PositionsPanel,
  'news': NewsPanel,
  'challenges': ChallengesPanel,
  'market-scanner': MarketScannerPanel,
  'economic-calendar': () => <div className="p-4 text-center text-muted-foreground">Economic Calendar - Coming Soon</div>,
  'options-chain': () => <div className="p-4 text-center text-muted-foreground">Options Chain - Coming Soon</div>,
}

const PANEL_CONFIGS: Record<PanelType, Omit<PanelConfig, 'id'>> = {
  'chart': {
    type: 'chart',
    title: 'Chart',
    icon: '📈',
    component: ChartPanel,
    minWidth: 400,
    minHeight: 300,
    defaultSize: { width: 600, height: 400 }
  },
  'order-ticket': {
    type: 'order-ticket',
    title: 'Order Ticket',
    icon: '📋',
    component: OrderPanel,
    minWidth: 300,
    minHeight: 400,
    defaultSize: { width: 350, height: 500 }
  },
  'positions': {
    type: 'positions',
    title: 'Positions',
    icon: '💼',
    component: PositionsPanel,
    minWidth: 400,
    minHeight: 200,
    defaultSize: { width: 500, height: 300 }
  },
  'news': {
    type: 'news',
    title: 'News Feed',
    icon: '📰',
    component: NewsPanel,
    minWidth: 300,
    minHeight: 200,
    defaultSize: { width: 400, height: 400 }
  },
  'challenges': {
    type: 'challenges',
    title: 'Challenges',
    icon: '🎮',
    component: ChallengesPanel,
    minWidth: 300,
    minHeight: 300,
    defaultSize: { width: 400, height: 500 }
  },
  'market-scanner': {
    type: 'market-scanner',
    title: 'Market Scanner',
    icon: '🔍',
    component: MarketScannerPanel,
    minWidth: 350,
    minHeight: 250,
    defaultSize: { width: 450, height: 350 }
  },
  'economic-calendar': {
    type: 'economic-calendar',
    title: 'Economic Calendar',
    icon: '📅',
    component: () => <div>Economic Calendar</div>,
    minWidth: 400,
    minHeight: 300,
    defaultSize: { width: 500, height: 400 }
  },
  'options-chain': {
    type: 'options-chain',
    title: 'Options Chain',
    icon: '⛓️',
    component: () => <div>Options Chain</div>,
    minWidth: 450,
    minHeight: 300,
    defaultSize: { width: 600, height: 400 }
  }
}

// Predefined workspace layouts
const DEFAULT_LAYOUTS: WorkspaceLayout[] = [
  {
    id: 'default',
    name: 'Default Layout',
    description: 'Basic trading setup with chart, order ticket, and positions',
    panels: [],
    layout: {
      direction: 'row',
      first: {
        direction: 'column',
        first: 'chart-1',
        second: 'positions-1',
        splitPercentage: 70
      },
      second: {
        direction: 'column',
        first: 'order-ticket-1',
        second: 'challenges-1',
        splitPercentage: 60
      },
      splitPercentage: 75
    },
    isDefault: true
  },
  {
    id: 'advanced',
    name: 'Advanced Trading',
    description: 'Multi-panel setup for professional traders',
    panels: [],
    layout: {
      direction: 'row',
      first: {
        direction: 'column',
        first: {
          direction: 'row',
          first: 'chart-1',
          second: 'market-scanner-1',
          splitPercentage: 70
        },
        second: 'positions-1',
        splitPercentage: 75
      },
      second: {
        direction: 'column',
        first: 'order-ticket-1',
        second: {
          direction: 'row',
          first: 'challenges-1',
          second: 'news-1',
          splitPercentage: 50
        },
        splitPercentage: 50
      },
      splitPercentage: 70
    }
  },
  {
    id: 'analysis',
    name: 'Analysis Focus',
    description: 'Chart-focused layout for technical analysis',
    panels: [],
    layout: {
      direction: 'column',
      first: {
        direction: 'row',
        first: 'chart-1',
        second: 'chart-2',
        splitPercentage: 50
      },
      second: {
        direction: 'row',
        first: 'market-scanner-1',
        second: {
          direction: 'row',
          first: 'positions-1',
          second: 'order-ticket-1',
          splitPercentage: 60
        },
        splitPercentage: 40
      },
      splitPercentage: 75
    }
  }
]

interface WorkspaceManagerProps {
  initialLayout?: string
}

export function WorkspaceManager({ initialLayout = 'default' }: WorkspaceManagerProps) {
  const [currentLayout, setCurrentLayout] = useState<any | null>(null)
  const [panelStates, setPanelStates] = useState<Record<string, PanelState>>({})
  const [floatingPanels, setFloatingPanels] = useState<string[]>([])
  const [selectedLayoutId, setSelectedLayoutId] = useState(initialLayout)
  
  // Initialize layout
  useEffect(() => {
    const layout = DEFAULT_LAYOUTS.find(l => l.id === selectedLayoutId)
    if (layout) {
      setCurrentLayout(layout.layout)
      
      // Initialize panel states
      const initialStates: Record<string, PanelState> = {}
      const extractPanelIds = (node: any): string[] => {
        if (typeof node === 'string') return [node]
        if (node.first && node.second) {
          return [...extractPanelIds(node.first), ...extractPanelIds(node.second)]
        }
        return []
      }
      
      const panelIds = extractPanelIds(layout.layout)
      panelIds.forEach(id => {
        initialStates[id] = {
          id,
          isMinimized: false,
          isMaximized: false,
          isFloating: false
        }
      })
      
      setPanelStates(initialStates)
    }
  }, [selectedLayoutId])
  
  const handlePanelStateChange = useCallback((panelId: string, newState: Partial<PanelState>) => {
    setPanelStates(prev => ({
      ...prev,
      [panelId]: { ...prev[panelId], ...newState }
    }))
    
    // Handle floating panels
    if (newState.isFloating !== undefined) {
      setFloatingPanels(prev => 
        newState.isFloating 
          ? [...prev, panelId]
          : prev.filter(id => id !== panelId)
      )
    }
  }, [])
  
  const renderTile = useCallback((id: string, path: any[]) => {
    // Extract panel type and instance from id (e.g., "chart-1" -> type: "chart", instance: "1")
    const [panelType, instance] = id.split('-')
    const config = PANEL_CONFIGS[panelType as PanelType]
    const state = panelStates[id]
    
    if (!config || !state) {
      return <div className="p-4 text-center text-muted-foreground">Panel not found: {id}</div>
    }
    
    const fullConfig: PanelConfig = {
      ...config,
      id
    }
    
    const Component = PANEL_COMPONENTS[config.type]
    
    return (
      <MosaicWindow<string>
        path={path}
        title={`${config.title} ${instance}`}
        createNode={() => 'new-panel'}
        renderToolbar={() => <div />}
      >
        <PanelContainer
          config={fullConfig}
          state={state}
          onStateChange={(newState) => handlePanelStateChange(id, newState)}
          onClose={() => {
            // Remove panel from layout
            setCurrentLayout((prev: any) => {
              // This is a simplified removal - in a real app you'd want more sophisticated layout management
              return prev
            })
          }}
        >
          <Component />
        </PanelContainer>
      </MosaicWindow>
    )
  }, [panelStates, handlePanelStateChange])
  
  const addPanel = (panelType: PanelType) => {
    const existingPanels = Object.keys(panelStates).filter(id => id.startsWith(panelType))
    const newInstance = existingPanels.length + 1
    const newId = `${panelType}-${newInstance}`
    
    // Add to floating panels for now (in a real app, you'd integrate with the layout)
    setPanelStates(prev => ({
      ...prev,
      [newId]: {
        id: newId,
        isMinimized: false,
        isMaximized: false,
        isFloating: true,
        position: { x: 100 + existingPanels.length * 50, y: 100 + existingPanels.length * 50 }
      }
    }))
    
    setFloatingPanels(prev => [...prev, newId])
  }
  
  return (
    <div className="h-full relative">
      {/* Workspace Toolbar */}
      <div className="bg-paper border-b border-grid-blue p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-handwrite text-lg text-graphite">🏢 Workspace</h2>
          
          <Select value={selectedLayoutId} onValueChange={setSelectedLayoutId}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_LAYOUTS.map((layout) => (
                <SelectItem key={layout.id} value={layout.id}>
                  <div>
                    <div className="font-medium">{layout.name}</div>
                    <div className="text-xs text-muted-foreground">{layout.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Add Panel:</span>
          {Object.entries(PANEL_CONFIGS).map(([type, config]) => (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => addPanel(type as PanelType)}
              title={`Add ${config.title}`}
            >
              {config.icon}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Workspace */}
      <div className="h-[calc(100%-4rem)]">
        {currentLayout && (
          <Mosaic<string>
            renderTile={renderTile}
            value={currentLayout}
            onChange={setCurrentLayout}
            className="mosaic-blueprint-theme"
          />
        )}
      </div>
      
      {/* Floating Panels */}
      {floatingPanels.map(panelId => {
        const [panelType] = panelId.split('-')
        const config = PANEL_CONFIGS[panelType as PanelType]
        const state = panelStates[panelId]
        
        if (!config || !state || !state.isFloating) return null
        
        const fullConfig: PanelConfig = {
          ...config,
          id: panelId
        }
        
        const Component = PANEL_COMPONENTS[config.type]
        
        return (
          <PanelContainer
            key={panelId}
            config={fullConfig}
            state={state}
            onStateChange={(newState) => handlePanelStateChange(panelId, newState)}
            onClose={() => {
              setPanelStates(prev => {
                const newStates = { ...prev }
                delete newStates[panelId]
                return newStates
              })
              setFloatingPanels(prev => prev.filter(id => id !== panelId))
            }}
          >
            <Component />
          </PanelContainer>
        )
      })}
    </div>
  )
}