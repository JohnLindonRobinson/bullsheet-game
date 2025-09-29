import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function calculatePnL(entryPrice: number, currentPrice: number, quantity: number): number {
  return (currentPrice - entryPrice) * quantity
}

export function calculatePnLPercentage(entryPrice: number, currentPrice: number): number {
  return (currentPrice - entryPrice) / entryPrice
}