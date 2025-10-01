export type PanelType = 
  | 'chart'
  | 'order-ticket'
  | 'positions'
  | 'news'
  | 'challenges'
  | 'market-scanner'
  | 'economic-calendar'
  | 'options-chain'

export interface PanelConfig {
  id: string
  type: PanelType
  title: string
  icon: string
  component: React.ComponentType<any>
  minWidth?: number
  minHeight?: number
  defaultSize?: {
    width: number
    height: number
  }
}

export interface WorkspaceLayout {
  id: string
  name: string
  description: string
  panels: PanelConfig[]
  layout: any // Mosaic layout structure
  isDefault?: boolean
}

export interface PanelState {
  id: string
  isMinimized: boolean
  isMaximized: boolean
  isFloating: boolean
  position?: {
    x: number
    y: number
  }
  size?: {
    width: number
    height: number
  }
}