import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
import { useBacktestStore } from '@/stores/backtestStore'
import { strategyTemplates, getStrategyCategories } from '@/data/strategy-templates'
import { StrategyDefinition } from '@/types/backtesting'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Settings, 
  Star,
  Copy,
  Wand2
} from 'lucide-react'

export function StrategyBuilder() {
  const {
    currentStrategy,
    favoriteStrategies,
    setStrategy,
    // loadTemplate,
    createCustomStrategy,
    addToFavorites,
    removeFromFavorites
  } = useBacktestStore()

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [customParams, setCustomParams] = useState<Record<string, any>>({})
  const [customName, setCustomName] = useState('')

  const categories = getStrategyCategories()
  const filteredTemplates = selectedCategory === 'all' 
    ? strategyTemplates 
    : strategyTemplates.filter(t => t.category === selectedCategory)

  const handleSelectTemplate = (template: StrategyDefinition) => {
    setStrategy(template)
    setCustomParams(template.parameters)
    setCustomName(`Custom ${template.name}`)
    setIsCustomizing(false)
  }

  const handleCustomizeStrategy = () => {
    if (!currentStrategy) return
    setIsCustomizing(true)
    setCustomParams(currentStrategy.parameters)
  }

  const handleSaveCustom = () => {
    if (!currentStrategy) return
    createCustomStrategy(customName, currentStrategy.id, customParams)
    setIsCustomizing(false)
  }

  const handleParameterChange = (key: string, value: any) => {
    setCustomParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      momentum: TrendingUp,
      mean_reversion: TrendingDown,
      breakout: BarChart3,
      custom: Settings
    }
    const Icon = icons[category as keyof typeof icons] || TrendingUp
    return <Icon className="h-4 w-4" />
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      momentum: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      mean_reversion: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      breakout: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      custom: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[category as keyof typeof colors] || colors.custom
  }

  const isFavorite = (strategyId: string) => favoriteStrategies.includes(strategyId)

  return (
    <div className="space-y-6">
      {/* Strategy Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Strategy Templates</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {getCategoryIcon(category)}
                <span className="ml-1 hidden sm:inline">{category.replace('_', ' ')}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentStrategy?.id === template.id 
                  ? 'ring-2 ring-primary' 
                  : ''
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(template.category)}>
                      {getCategoryIcon(template.category)}
                      <span className="ml-1 capitalize">
                        {template.category.replace('_', ' ')}
                      </span>
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isFavorite(template.id)) {
                        removeFromFavorites(template.id)
                      } else {
                        addToFavorites(template.id)
                      }
                    }}
                  >
                    <Star 
                      className={`h-4 w-4 ${
                        isFavorite(template.id) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </Button>
                </div>
                
                <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-1">
                    {Object.entries(template.parameters).slice(0, 2).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                  {currentStrategy?.id === template.id && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Strategy Details */}
      {currentStrategy && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>Strategy Configuration</span>
                <Badge className={getCategoryColor(currentStrategy.category)}>
                  {currentStrategy.category.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCustomizeStrategy}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Customize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newStrategy = {
                      ...currentStrategy,
                      id: `copy-${Date.now()}`,
                      name: `Copy of ${currentStrategy.name}`
                    }
                    setStrategy(newStrategy)
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStrategy.description}
              </p>
            </div>

            {!isCustomizing ? (
              <div>
                <Label className="text-sm font-medium">Parameters</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {Object.entries(currentStrategy.parameters).map(([key, value]) => (
                    <div key={key} className="p-2 bg-muted rounded text-sm">
                      <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-name">Strategy Name</Label>
                  <Input
                    id="custom-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter custom strategy name"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Parameters</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {Object.entries(customParams).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-xs capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <Input
                          type={typeof value === 'number' ? 'number' : 'text'}
                          value={value}
                          onChange={(e) => {
                            const newValue = typeof value === 'number' 
                              ? parseFloat(e.target.value) || 0
                              : e.target.value
                            handleParameterChange(key, newValue)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSaveCustom} size="sm">
                    Save Custom Strategy
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCustomizing(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Strategy Rules Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-green-600">Entry Rules</Label>
                <div className="mt-1 space-y-1">
                  {currentStrategy.rules.entry.map((rule, index) => (
                    <div key={index} className="text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      {rule.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-red-600">Exit Rules</Label>
                <div className="mt-1 space-y-1">
                  {currentStrategy.rules.exit.map((rule, index) => (
                    <div key={index} className="text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      {rule.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}