import { describe, it, expect } from 'vitest'
import { 
  cn, 
  formatCurrency, 
  formatPercentage, 
  calculatePnL, 
  calculatePnLPercentage 
} from '../utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('bg-red-500', 'text-white', 'hover:bg-red-600')
      expect(result).toBe('bg-red-500 text-white hover:bg-red-600')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('handles Tailwind class conflicts', () => {
      // twMerge should handle conflicting Tailwind classes
      const result = cn('bg-red-500 bg-blue-500')
      expect(result).toBe('bg-blue-500') // Later class should win
    })
  })

  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(0.99)).toBe('$0.99')
    })

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
      expect(formatCurrency(-0.01)).toBe('-$0.01')
    })

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('formats large numbers correctly', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
      expect(formatCurrency(1000000.123)).toBe('$1,000,000.12')
    })
  })

  describe('formatPercentage', () => {
    it('formats positive percentages correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%')
      expect(formatPercentage(0.05)).toBe('5.00%')
      expect(formatPercentage(1.0)).toBe('100.00%')
    })

    it('formats negative percentages correctly', () => {
      expect(formatPercentage(-0.1234)).toBe('-12.34%')
      expect(formatPercentage(-0.05)).toBe('-5.00%')
    })

    it('formats zero correctly', () => {
      expect(formatPercentage(0)).toBe('0.00%')
    })

    it('formats very small numbers correctly', () => {
      expect(formatPercentage(0.0001)).toBe('0.01%')
      expect(formatPercentage(0.00001)).toBe('0.00%')
    })
  })

  describe('calculatePnL', () => {
    it('calculates profit correctly', () => {
      expect(calculatePnL(100, 110, 10)).toBe(100) // (110-100) * 10
      expect(calculatePnL(50, 55, 5)).toBe(25) // (55-50) * 5
    })

    it('calculates loss correctly', () => {
      expect(calculatePnL(100, 90, 10)).toBe(-100) // (90-100) * 10
      expect(calculatePnL(50, 45, 5)).toBe(-25) // (45-50) * 5
    })

    it('calculates zero PnL correctly', () => {
      expect(calculatePnL(100, 100, 10)).toBe(0)
    })

    it('handles fractional quantities', () => {
      expect(calculatePnL(100, 110, 2.5)).toBe(25) // (110-100) * 2.5
    })

    it('handles fractional prices', () => {
      expect(calculatePnL(100.50, 101.25, 10)).toBe(7.5) // (101.25-100.50) * 10
    })
  })

  describe('calculatePnLPercentage', () => {
    it('calculates positive percentage correctly', () => {
      expect(calculatePnLPercentage(100, 110)).toBe(0.1) // 10%
      expect(calculatePnLPercentage(50, 55)).toBe(0.1) // 10%
    })

    it('calculates negative percentage correctly', () => {
      expect(calculatePnLPercentage(100, 90)).toBe(-0.1) // -10%
      expect(calculatePnLPercentage(50, 45)).toBe(-0.1) // -10%
    })

    it('calculates zero percentage correctly', () => {
      expect(calculatePnLPercentage(100, 100)).toBe(0)
    })

    it('handles very small changes', () => {
      expect(calculatePnLPercentage(100, 100.01)).toBeCloseTo(0.0001, 4)
    })

    it('handles large percentage changes', () => {
      expect(calculatePnLPercentage(100, 200)).toBe(1.0) // 100% gain
      expect(calculatePnLPercentage(100, 0)).toBe(-1.0) // 100% loss
    })

    it('handles fractional entry prices', () => {
      expect(calculatePnLPercentage(150.75, 165.825)).toBeCloseTo(0.1, 4) // ~10%
    })
  })
})