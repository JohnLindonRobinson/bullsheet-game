import { HistoricalDataPoint, TechnicalIndicator } from '@/types/backtesting'

/**
 * Technical Indicators Service
 * Calculates various technical indicators for backtesting strategies
 */
export class TechnicalIndicatorsService {
  
  /**
   * Simple Moving Average
   */
  calculateSMA(data: HistoricalDataPoint[], period: number): TechnicalIndicator {
    const values: number[] = []
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        values.push(NaN)
        continue
      }
      
      let sum = 0
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close
      }
      values.push(sum / period)
    }
    
    return {
      name: 'SMA',
      values,
      parameters: { period }
    }
  }

  /**
   * Exponential Moving Average
   */
  calculateEMA(data: HistoricalDataPoint[], period: number): TechnicalIndicator {
    const values: number[] = []
    const multiplier = 2 / (period + 1)
    
    // Start with SMA for first value
    let sum = 0
    for (let i = 0; i < period; i++) {
      if (i < data.length) {
        sum += data[i].close
      }
      values.push(NaN)
    }
    
    if (data.length >= period) {
      values[period - 1] = sum / period
      
      // Calculate EMA for remaining values
      for (let i = period; i < data.length; i++) {
        const ema = (data[i].close * multiplier) + (values[i - 1] * (1 - multiplier))
        values.push(ema)
      }
    }
    
    return {
      name: 'EMA',
      values,
      parameters: { period }
    }
  }

  /**
   * Relative Strength Index (RSI)
   */
  calculateRSI(data: HistoricalDataPoint[], period: number = 14): TechnicalIndicator {
    const values: number[] = []
    const gains: number[] = []
    const losses: number[] = []
    
    // Calculate gains and losses
    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }
    
    // Initialize with NaN for insufficient data
    for (let i = 0; i <= period; i++) {
      values.push(NaN)
    }
    
    if (gains.length >= period) {
      // Calculate initial averages
      let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period
      let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period
      
      // Calculate first RSI value
      const rs = avgGain / avgLoss
      values[period] = 100 - (100 / (1 + rs))
      
      // Calculate remaining RSI values using Wilder's smoothing
      for (let i = period + 1; i < data.length; i++) {
        avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period
        avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period
        
        const rs = avgGain / avgLoss
        values.push(100 - (100 / (1 + rs)))
      }
    }
    
    return {
      name: 'RSI',
      values,
      parameters: { period }
    }
  }

  /**
   * Moving Average Convergence Divergence (MACD)
   */
  calculateMACD(
    data: HistoricalDataPoint[], 
    fastPeriod: number = 12, 
    slowPeriod: number = 26, 
    signalPeriod: number = 9
  ): TechnicalIndicator {
    const fastEMA = this.calculateEMA(data, fastPeriod)
    const slowEMA = this.calculateEMA(data, slowPeriod)
    const macdLine: number[] = []
    
    // Calculate MACD line
    for (let i = 0; i < data.length; i++) {
      if (isNaN(fastEMA.values[i]) || isNaN(slowEMA.values[i])) {
        macdLine.push(NaN)
      } else {
        macdLine.push(fastEMA.values[i] - slowEMA.values[i])
      }
    }
    
    // Calculate signal line (EMA of MACD)
    const signalLine = this.calculateEMAFromValues(macdLine, signalPeriod)
    
    // Calculate histogram
    const histogram: number[] = []
    for (let i = 0; i < macdLine.length; i++) {
      if (isNaN(macdLine[i]) || isNaN(signalLine[i])) {
        histogram.push(NaN)
      } else {
        histogram.push(macdLine[i] - signalLine[i])
      }
    }
    
    return {
      name: 'MACD',
      values: macdLine,
      parameters: { 
        fastPeriod, 
        slowPeriod, 
        signalPeriod,
        signalLine: signalLine,
        histogram: histogram
      } as any
    }
  }

  /**
   * Bollinger Bands
   */
  calculateBollingerBands(
    data: HistoricalDataPoint[], 
    period: number = 20, 
    stdDev: number = 2
  ): TechnicalIndicator {
    const sma = this.calculateSMA(data, period)
    const upperBand: number[] = []
    const lowerBand: number[] = []
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upperBand.push(NaN)
        lowerBand.push(NaN)
        continue
      }
      
      // Calculate standard deviation
      const prices = data.slice(i - period + 1, i + 1).map(d => d.close)
      const mean = sma.values[i]
      const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period
      const standardDeviation = Math.sqrt(variance)
      
      upperBand.push(mean + (stdDev * standardDeviation))
      lowerBand.push(mean - (stdDev * standardDeviation))
    }
    
    return {
      name: 'BOLLINGER_BANDS',
      values: sma.values, // Middle band
      parameters: { 
        period, 
        stdDev,
        upperBand: upperBand,
        lowerBand: lowerBand
      } as any
    }
  }

  /**
   * Stochastic Oscillator
   */
  calculateStochastic(
    data: HistoricalDataPoint[], 
    kPeriod: number = 14, 
    dPeriod: number = 3
  ): TechnicalIndicator {
    const kValues: number[] = []
    
    // Calculate %K
    for (let i = 0; i < data.length; i++) {
      if (i < kPeriod - 1) {
        kValues.push(NaN)
        continue
      }
      
      const period_data = data.slice(i - kPeriod + 1, i + 1)
      const lowest = Math.min(...period_data.map(d => d.low))
      const highest = Math.max(...period_data.map(d => d.high))
      const current = data[i].close
      
      const k = ((current - lowest) / (highest - lowest)) * 100
      kValues.push(k)
    }
    
    // Calculate %D (SMA of %K)
    const dValues = this.calculateSMAFromValues(kValues, dPeriod)
    
    return {
      name: 'STOCHASTIC',
      values: kValues,
      parameters: { 
        kPeriod, 
        dPeriod,
        dValues: dValues
      } as any
    }
  }

  /**
   * Volume Weighted Average Price (VWAP)
   */
  calculateVWAP(data: HistoricalDataPoint[]): TechnicalIndicator {
    const values: number[] = []
    let cumulativeTPV = 0 // Cumulative Typical Price × Volume
    let cumulativeVolume = 0
    
    for (let i = 0; i < data.length; i++) {
      const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
      const tpv = typicalPrice * data[i].volume
      
      cumulativeTPV += tpv
      cumulativeVolume += data[i].volume
      
      values.push(cumulativeTPV / cumulativeVolume)
    }
    
    return {
      name: 'VWAP',
      values,
      parameters: {}
    }
  }

  /**
   * Average True Range (ATR)
   */
  calculateATR(data: HistoricalDataPoint[], period: number = 14): TechnicalIndicator {
    const trueRanges: number[] = []
    
    // Calculate True Range for each period
    for (let i = 1; i < data.length; i++) {
      const tr1 = data[i].high - data[i].low
      const tr2 = Math.abs(data[i].high - data[i - 1].close)
      const tr3 = Math.abs(data[i].low - data[i - 1].close)
      
      trueRanges.push(Math.max(tr1, tr2, tr3))
    }
    
    // Calculate ATR using EMA of True Range
    const atrValues = this.calculateEMAFromValues([NaN, ...trueRanges], period)
    
    return {
      name: 'ATR',
      values: atrValues,
      parameters: { period }
    }
  }

  /**
   * Helper: Calculate EMA from array of values
   */
  private calculateEMAFromValues(values: number[], period: number): number[] {
    const result: number[] = []
    const multiplier = 2 / (period + 1)
    
    // Find first valid value for initial SMA
    let firstValidIndex = 0
    while (firstValidIndex < values.length && isNaN(values[firstValidIndex])) {
      firstValidIndex++
    }
    
    // Fill initial NaN values
    for (let i = 0; i < firstValidIndex + period - 1; i++) {
      result.push(NaN)
    }
    
    if (firstValidIndex + period <= values.length) {
      // Calculate initial SMA
      let sum = 0
      let count = 0
      for (let i = firstValidIndex; i < firstValidIndex + period; i++) {
        if (!isNaN(values[i])) {
          sum += values[i]
          count++
        }
      }
      result[firstValidIndex + period - 1] = sum / count
      
      // Calculate EMA for remaining values
      for (let i = firstValidIndex + period; i < values.length; i++) {
        if (!isNaN(values[i])) {
          const ema = (values[i] * multiplier) + (result[i - 1] * (1 - multiplier))
          result.push(ema)
        } else {
          result.push(result[i - 1]) // Carry forward previous value
        }
      }
    }
    
    return result
  }

  /**
   * Helper: Calculate SMA from array of values
   */
  private calculateSMAFromValues(values: number[], period: number): number[] {
    const result: number[] = []
    
    for (let i = 0; i < values.length; i++) {
      if (i < period - 1) {
        result.push(NaN)
        continue
      }
      
      let sum = 0
      let count = 0
      for (let j = 0; j < period; j++) {
        if (!isNaN(values[i - j])) {
          sum += values[i - j]
          count++
        }
      }
      result.push(count > 0 ? sum / count : NaN)
    }
    
    return result
  }

  /**
   * Get all available indicators
   */
  getAvailableIndicators(): string[] {
    return [
      'SMA', 'EMA', 'RSI', 'MACD', 'BOLLINGER_BANDS', 
      'STOCHASTIC', 'VWAP', 'ATR'
    ]
  }
}

// Singleton instance
export const technicalIndicatorsService = new TechnicalIndicatorsService()