import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBacktestStore } from '@/stores/backtestStore'
import { historicalDataService } from '@/services/historical-data'
// import { BacktestPeriod } from '@/types/backtesting'
import { Calendar, DollarSign, Settings, TrendingUp } from 'lucide-react'

export function BacktestSetup() {
  const {
    currentSymbol,
    currentPeriod,
    configuration,
    setSymbol,
    setPeriod,
    setConfiguration
  } = useBacktestStore()

  const [startDate, setStartDate] = useState(
    currentPeriod?.startDate || '2023-01-01'
  )
  const [endDate, setEndDate] = useState(
    currentPeriod?.endDate || '2024-01-01'
  )

  const availableSymbols = historicalDataService.getAvailableSymbols()

  const handleDateChange = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    setPeriod({
      startDate,
      endDate,
      totalDays
    })
  }

  const getPresetPeriod = (period: string) => {
    const end = new Date()
    const start = new Date()
    
    switch (period) {
      case '1y':
        start.setFullYear(end.getFullYear() - 1)
        break
      case '2y':
        start.setFullYear(end.getFullYear() - 2)
        break
      case '5y':
        start.setFullYear(end.getFullYear() - 5)
        break
      case 'ytd':
        start.setMonth(0, 1)
        break
      default:
        return
    }
    
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    setPeriod({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      totalDays
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Symbol Selection */}
      <div>
        <Label className="text-sm font-medium flex items-center mb-3">
          <TrendingUp className="h-4 w-4 mr-2" />
          Select Symbol
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {availableSymbols.map(symbol => (
            <Button
              key={symbol}
              variant={currentSymbol === symbol ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSymbol(symbol)}
              className="justify-start"
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <Label className="text-sm font-medium flex items-center mb-3">
          <Calendar className="h-4 w-4 mr-2" />
          Backtest Period
        </Label>
        
        {/* Preset Periods */}
        <div className="flex space-x-2 mb-3">
          {[
            { label: '1 Year', value: '1y' },
            { label: '2 Years', value: '2y' },
            { label: '5 Years', value: '5y' },
            { label: 'YTD', value: 'ytd' }
          ].map(preset => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              onClick={() => getPresetPeriod(preset.value)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={handleDateChange}
            />
          </div>
          <div>
            <Label className="text-xs">End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={handleDateChange}
            />
          </div>
        </div>

        {currentPeriod && (
          <div className="mt-2 p-2 bg-muted rounded text-sm">
            Period: {currentPeriod.totalDays} days
          </div>
        )}
      </div>

      {/* Configuration */}
      <div>
        <Label className="text-sm font-medium flex items-center mb-3">
          <Settings className="h-4 w-4 mr-2" />
          Configuration
        </Label>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Initial Capital</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                value={configuration.initialCapital}
                onChange={(e) => setConfiguration({
                  initialCapital: parseFloat(e.target.value) || 100000
                })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Commission ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={configuration.commission}
                onChange={(e) => setConfiguration({
                  commission: parseFloat(e.target.value) || 5
                })}
              />
            </div>
            <div>
              <Label className="text-xs">Slippage (%)</Label>
              <Input
                type="number"
                step="0.001"
                value={configuration.slippage * 100}
                onChange={(e) => setConfiguration({
                  slippage: (parseFloat(e.target.value) || 0.1) / 100
                })}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Max Position Size (%)</Label>
            <Input
              type="number"
              step="5"
              min="5"
              max="100"
              value={configuration.maxPositionSize * 100}
              onChange={(e) => setConfiguration({
                maxPositionSize: (parseFloat(e.target.value) || 25) / 100
              })}
            />
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {currentPeriod && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-2">Backtest Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Symbol:</span>
                <Badge variant="outline" className="ml-1">{currentSymbol}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Period:</span>
                <span className="ml-1 font-medium">{currentPeriod.totalDays} days</span>
              </div>
              <div>
                <span className="text-muted-foreground">Capital:</span>
                <span className="ml-1 font-medium">{formatCurrency(configuration.initialCapital)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Commission:</span>
                <span className="ml-1 font-medium">${configuration.commission}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}