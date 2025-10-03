import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { 
  StrategyDefinition, 
  BacktestResults, 
  BacktestPeriod, 
  BacktestConfiguration,
  BacktestError 
} from '@/types/backtesting'
import { BacktestEngine, defaultBacktestConfig } from '@/services/backtest-engine'
import { strategyTemplates } from '@/data/strategy-templates'

interface BacktestState {
  // Current backtest session
  currentStrategy: StrategyDefinition | null
  currentSymbol: string
  currentPeriod: BacktestPeriod | null
  configuration: BacktestConfiguration
  
  // Results
  results: BacktestResults | null
  isRunning: boolean
  error: BacktestError | null
  
  // History
  backtestHistory: BacktestResults[]
  favoriteStrategies: string[]
  
  // UI state
  selectedTab: 'setup' | 'results' | 'comparison' | 'history'
  
  // Actions
  setStrategy: (strategy: StrategyDefinition) => void
  setSymbol: (symbol: string) => void
  setPeriod: (period: BacktestPeriod) => void
  setConfiguration: (config: Partial<BacktestConfiguration>) => void
  runBacktest: () => Promise<void>
  clearResults: () => void
  saveToHistory: () => void
  addToFavorites: (strategyId: string) => void
  removeFromFavorites: (strategyId: string) => void
  setTab: (tab: 'setup' | 'results' | 'comparison' | 'history') => void
  loadTemplate: (templateId: string) => void
  createCustomStrategy: (name: string, baseTemplateId: string, params: Record<string, any>) => void
}

export const useBacktestStore = create<BacktestState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentStrategy: null,
        currentSymbol: 'AAPL',
        currentPeriod: null,
        configuration: defaultBacktestConfig,
        results: null,
        isRunning: false,
        error: null,
        backtestHistory: [],
        favoriteStrategies: [],
        selectedTab: 'setup',

        // Actions
        setStrategy: (strategy) => {
          set({ currentStrategy: strategy, error: null })
        },

        setSymbol: (symbol) => {
          set({ currentSymbol: symbol })
        },

        setPeriod: (period) => {
          set({ currentPeriod: period })
        },

        setConfiguration: (config) => {
          set((state) => ({
            configuration: { ...state.configuration, ...config }
          }))
        },

        runBacktest: async () => {
          const state = get()
          const { currentStrategy, currentSymbol, currentPeriod, configuration } = state
          
          if (!currentStrategy || !currentPeriod) {
            set({ error: 'INVALID_PARAMETERS' })
            return
          }

          set({ isRunning: true, error: null })

          try {
            const engine = new BacktestEngine(configuration)
            const results = await engine.executeBacktest(
              currentStrategy,
              currentSymbol,
              currentPeriod
            )
            
            set({ 
              results, 
              isRunning: false, 
              selectedTab: 'results' 
            })
          } catch (error) {
            console.error('Backtest failed:', error)
            set({ 
              error: 'CALCULATION_ERROR', 
              isRunning: false 
            })
          }
        },

        clearResults: () => {
          set({ 
            results: null, 
            error: null, 
            selectedTab: 'setup' 
          })
        },

        saveToHistory: () => {
          const { results, backtestHistory } = get()
          if (!results) return
          
          const newHistory = [results, ...backtestHistory.slice(0, 49)] // Keep last 50
          set({ backtestHistory: newHistory })
        },

        addToFavorites: (strategyId) => {
          set((state) => ({
            favoriteStrategies: [...state.favoriteStrategies, strategyId]
          }))
        },

        removeFromFavorites: (strategyId) => {
          set((state) => ({
            favoriteStrategies: state.favoriteStrategies.filter(id => id !== strategyId)
          }))
        },

        setTab: (tab) => {
          set({ selectedTab: tab })
        },

        loadTemplate: (templateId) => {
          const template = strategyTemplates.find(t => t.id === templateId)
          if (template) {
            set({ 
              currentStrategy: { ...template },
              error: null 
            })
          }
        },

        createCustomStrategy: (name, baseTemplateId, params) => {
          const template = strategyTemplates.find(t => t.id === baseTemplateId)
          if (!template) return
          
          const customStrategy: StrategyDefinition = {
            ...template,
            id: `custom-${Date.now()}`,
            name,
            parameters: { ...template.parameters, ...params }
          }
          
          set({ 
            currentStrategy: customStrategy,
            error: null 
          })
        }
      }),
      {
        name: 'backtest-store',
        partialize: (state) => ({
          configuration: state.configuration,
          backtestHistory: state.backtestHistory,
          favoriteStrategies: state.favoriteStrategies,
          currentSymbol: state.currentSymbol
        })
      }
    ),
    { name: 'BacktestStore' }
  )
)