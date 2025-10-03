import { StrategyDefinition } from '@/types/backtesting'

/**
 * Pre-built strategy templates for backtesting
 * These provide users with starting points for common trading strategies
 */

export const strategyTemplates: StrategyDefinition[] = [
  {
    id: 'moving-average-crossover',
    name: 'Moving Average Crossover',
    description: 'Buy when fast MA crosses above slow MA, sell when it crosses below',
    category: 'momentum',
    parameters: {
      fastPeriod: 20,
      slowPeriod: 50,
      positionSize: 100
    },
    rules: {
      entry: [
        {
          id: 'ma-cross-up',
          type: 'indicator',
          operator: 'cross_above',
          value: 'SMA_SLOW',
          indicator: 'SMA_FAST',
          lookback: 1
        }
      ],
      exit: [
        {
          id: 'ma-cross-down',
          type: 'indicator',
          operator: 'cross_below',
          value: 'SMA_SLOW',
          indicator: 'SMA_FAST',
          lookback: 1
        }
      ],
      riskManagement: [
        {
          type: 'stop_loss',
          value: 5,
          unit: 'percent'
        },
        {
          type: 'max_position_size',
          value: 25,
          unit: 'percent'
        }
      ]
    }
  },
  
  {
    id: 'rsi-mean-reversion',
    name: 'RSI Mean Reversion',
    description: 'Buy when RSI is oversold (<30), sell when overbought (>70)',
    category: 'mean_reversion',
    parameters: {
      rsiPeriod: 14,
      oversoldLevel: 30,
      overboughtLevel: 70,
      positionSize: 100
    },
    rules: {
      entry: [
        {
          id: 'rsi-oversold',
          type: 'indicator',
          operator: 'lt',
          value: 30,
          indicator: 'RSI',
          lookback: 0
        }
      ],
      exit: [
        {
          id: 'rsi-overbought',
          type: 'indicator',
          operator: 'gt',
          value: 70,
          indicator: 'RSI',
          lookback: 0
        }
      ],
      riskManagement: [
        {
          type: 'stop_loss',
          value: 3,
          unit: 'percent'
        },
        {
          type: 'take_profit',
          value: 6,
          unit: 'percent'
        }
      ]
    }
  },

  {
    id: 'bollinger-band-bounce',
    name: 'Bollinger Band Bounce',
    description: 'Buy when price touches lower band, sell when it touches upper band',
    category: 'mean_reversion',
    parameters: {
      bollingerPeriod: 20,
      bollingerStdDev: 2,
      positionSize: 100
    },
    rules: {
      entry: [
        {
          id: 'price-at-lower-band',
          type: 'price',
          operator: 'lt',
          value: 'BB_LOWER',
          lookback: 0
        }
      ],
      exit: [
        {
          id: 'price-at-upper-band',
          type: 'price',
          operator: 'gt',
          value: 'BB_UPPER',
          lookback: 0
        }
      ],
      riskManagement: [
        {
          type: 'stop_loss',
          value: 4,
          unit: 'percent'
        },
        {
          type: 'max_position_size',
          value: 20,
          unit: 'percent'
        }
      ]
    }
  },

  {
    id: 'macd-momentum',
    name: 'MACD Momentum',
    description: 'Buy on MACD bullish crossover, sell on bearish crossover',
    category: 'momentum',
    parameters: {
      macdFast: 12,
      macdSlow: 26,
      macdSignal: 9,
      positionSize: 100
    },
    rules: {
      entry: [
        {
          id: 'macd-bullish-cross',
          type: 'indicator',
          operator: 'cross_above',
          value: 'MACD_SIGNAL',
          indicator: 'MACD_LINE',
          lookback: 1
        }
      ],
      exit: [
        {
          id: 'macd-bearish-cross',
          type: 'indicator',
          operator: 'cross_below',
          value: 'MACD_SIGNAL',
          indicator: 'MACD_LINE',
          lookback: 1
        }
      ],
      riskManagement: [
        {
          type: 'stop_loss',
          value: 6,
          unit: 'percent'
        },
        {
          type: 'take_profit',
          value: 9,
          unit: 'percent'
        }
      ]
    }
  },

  {
    id: 'breakout-strategy',
    name: 'Price Breakout',
    description: 'Buy when price breaks above 20-day high, sell on 10-day low break',
    category: 'breakout',
    parameters: {
      breakoutPeriod: 20,
      exitPeriod: 10,
      positionSize: 100
    },
    rules: {
      entry: [
        {
          id: 'price-breakout-high',
          type: 'price',
          operator: 'gt',
          value: 'HIGH_20',
          lookback: 0
        }
      ],
      exit: [
        {
          id: 'price-breakdown-low',
          type: 'price',
          operator: 'lt',
          value: 'LOW_10',
          lookback: 0
        }
      ],
      riskManagement: [
        {
          type: 'stop_loss',
          value: 8,
          unit: 'percent'
        },
        {
          type: 'max_position_size',
          value: 30,
          unit: 'percent'
        }
      ]
    }
  },

  {
    id: 'golden-cross',
    name: 'Golden Cross',
    description: 'Buy on 50/200 day MA golden cross, sell on death cross',
    category: 'momentum',
    parameters: {
      fastPeriod: 50,
      slowPeriod: 200,
      positionSize: 100
    },
    rules: {
      entry: [
        {
          id: 'golden-cross',
          type: 'indicator',
          operator: 'cross_above',
          value: 'SMA_200',
          indicator: 'SMA_50',
          lookback: 1
        }
      ],
      exit: [
        {
          id: 'death-cross',
          type: 'indicator',
          operator: 'cross_below',
          value: 'SMA_200',
          indicator: 'SMA_50',
          lookback: 1
        }
      ],
      riskManagement: [
        {
          type: 'stop_loss',
          value: 10,
          unit: 'percent'
        },
        {
          type: 'max_position_size',
          value: 50,
          unit: 'percent'
        }
      ]
    }
  },

  {
    id: 'triple-ema-system',
    name: 'Triple EMA System',
    description: 'Trend following system using 8, 21, and 55 period EMAs',
    category: 'momentum',
    parameters: {
      ema1: 8,
      ema2: 21,
      ema3: 55,
      positionSize: 100
    },
    rules: {
      entry: [
        {
          id: 'ema-alignment',
          type: 'indicator',
          operator: 'gt',
          value: 'EMA_21',
          indicator: 'EMA_8',
          lookback: 0
        },
        {
          id: 'ema-trend',
          type: 'indicator',
          operator: 'gt',
          value: 'EMA_55',
          indicator: 'EMA_21',
          lookback: 0
        }
      ],
      exit: [
        {
          id: 'ema-breakdown',
          type: 'indicator',
          operator: 'lt',
          value: 'EMA_21',
          indicator: 'EMA_8',
          lookback: 0
        }
      ],
      riskManagement: [
        {
          type: 'stop_loss',
          value: 4,
          unit: 'percent'
        },
        {
          type: 'take_profit',
          value: 12,
          unit: 'percent'
        }
      ]
    }
  },

  {
    id: 'stochastic-oversold',
    name: 'Stochastic Oversold/Overbought',
    description: 'Buy when Stochastic %K < 20, sell when %K > 80',
    category: 'mean_reversion',
    parameters: {
      stochPeriod: 14,
      oversoldLevel: 20,
      overboughtLevel: 80,
      positionSize: 100
    },
    rules: {
      entry: [
        {
          id: 'stoch-oversold',
          type: 'indicator',
          operator: 'lt',
          value: 20,
          indicator: 'STOCH_K',
          lookback: 0
        }
      ],
      exit: [
        {
          id: 'stoch-overbought',
          type: 'indicator',
          operator: 'gt',
          value: 80,
          indicator: 'STOCH_K',
          lookback: 0
        }
      ],
      riskManagement: [
        {
          type: 'stop_loss',
          value: 5,
          unit: 'percent'
        },
        {
          type: 'take_profit',
          value: 8,
          unit: 'percent'
        }
      ]
    }
  }
]

/**
 * Get strategy template by ID
 */
export function getStrategyTemplate(id: string): StrategyDefinition | undefined {
  return strategyTemplates.find(template => template.id === id)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): StrategyDefinition[] {
  return strategyTemplates.filter(template => template.category === category)
}

/**
 * Get all available categories
 */
export function getStrategyCategories(): string[] {
  const categories = [...new Set(strategyTemplates.map(t => t.category))]
  return categories.sort()
}

/**
 * Create a custom strategy from template
 */
export function createCustomStrategy(
  templateId: string, 
  customParams: Record<string, any>,
  name?: string
): StrategyDefinition | null {
  const template = getStrategyTemplate(templateId)
  if (!template) return null

  return {
    ...template,
    id: `custom-${Date.now()}`,
    name: name || `Custom ${template.name}`,
    parameters: {
      ...template.parameters,
      ...customParams
    }
  }
}