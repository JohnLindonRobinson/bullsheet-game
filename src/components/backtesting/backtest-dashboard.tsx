// import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBacktestStore } from '@/stores/backtestStore'
import { StrategyBuilder } from './strategy-builder'
import { BacktestResults } from './backtest-results'
import { BacktestHistory } from './backtest-history'
import { BacktestComparison } from './backtest-comparison'
import { BacktestSetup } from './backtest-setup'
import { Play, Pause, RotateCcw, Save, TrendingUp, Brain, History, GitCompare } from 'lucide-react'

export function BacktestDashboard() {
  const {
    currentStrategy,
    results,
    isRunning,
    error,
    selectedTab,
    setTab,
    runBacktest,
    clearResults,
    saveToHistory
  } = useBacktestStore()

  const handleRunBacktest = async () => {
    if (isRunning) return
    await runBacktest()
    
    // Auto-save successful backtests to history
    if (results && !error) {
      saveToHistory()
    }
  }

  const getErrorMessage = (error: string | null) => {
    const messages = {
      'INSUFFICIENT_DATA': 'Not enough historical data available',
      'INVALID_PARAMETERS': 'Please select a strategy and date range',
      'STRATEGY_ERROR': 'Strategy configuration error',
      'DATA_FETCH_ERROR': 'Failed to fetch market data',
      'CALCULATION_ERROR': 'Error during backtest calculation'
    }
    return error ? messages[error as keyof typeof messages] || 'Unknown error' : null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Strategy Backtester
                </h1>
              </div>
              
              {currentStrategy && (
                <Badge variant="secondary" className="px-3 py-1">
                  {currentStrategy.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {results && (
                <Button
                  variant="outline"
                  onClick={saveToHistory}
                  className="hidden sm:flex"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save to History
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={clearResults}
                disabled={isRunning}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button
                onClick={handleRunBacktest}
                disabled={isRunning || !currentStrategy}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Backtest
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {getErrorMessage(error)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={(value) => setTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!results} className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center space-x-2">
              <GitCompare className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="setup" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Strategy Configuration */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategy Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StrategyBuilder />
                    </CardContent>
                  </Card>
                </div>

                {/* Backtest Setup */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Backtest Setup</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BacktestSetup />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {results ? (
                <BacktestResults results={results} />
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center text-muted-foreground">
                      <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No backtest results yet</p>
                      <p className="text-sm">Configure a strategy and run a backtest to see results</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="comparison">
              <BacktestComparison />
            </TabsContent>

            <TabsContent value="history">
              <BacktestHistory />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}