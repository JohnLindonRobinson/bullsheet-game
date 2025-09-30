import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

// Test wrapper for providers (if needed in future)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock user for testing
export const mockUser = {
  id: 'test-user',
  username: 'TestTrader',
  email: 'test@bullsheet.com',
  xp: 1000,
  level: 2,
  badges: [],
  createdAt: new Date('2024-01-01'),
}

// Mock trade data
export const mockTrade = {
  id: 'test-trade-1',
  symbol: 'AAPL',
  side: 'buy' as const,
  quantity: 10,
  price: 150.00,
  timestamp: new Date(),
  status: 'filled' as const,
}

// Mock challenge data
export const mockChallenge = {
  id: 'test-challenge',
  name: 'Test Challenge',
  description: 'A test challenge for unit tests',
  difficulty: 'easy' as const,
  xpReward: 100,
  requirements: [
    {
      type: 'trades' as const,
      target: 3,
      current: 1,
    }
  ],
  status: 'in_progress' as const,
  progress: 33,
}

// Mock portfolio data
export const mockPortfolio = {
  totalValue: 101500,
  totalPnL: 1500,
  totalPnLPercentage: 0.015,
  buyingPower: 50000,
  positions: [
    {
      symbol: 'AAPL',
      quantity: 10,
      avgPrice: 150.00,
      currentPrice: 155.00,
      unrealizedPnL: 50.00,
      unrealizedPnLPercentage: 0.033,
    }
  ],
}

// Helper to setup user event
export const createUser = () => userEvent.setup()

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock window size for responsive tests
export const mockWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }