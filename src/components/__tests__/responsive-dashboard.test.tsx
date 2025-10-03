import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, mockWindowSize } from '@/test/utils'
import { waitFor } from '@testing-library/react'
import { ResponsiveDashboard } from '../responsive-dashboard'
import { useUserStore } from '@/stores/userStore'
import { useChallengeStore } from '@/stores/challengeStore'
import { mockUser } from '@/test/utils'

// Mock the stores
vi.mock('@/stores/userStore')
vi.mock('@/stores/challengeStore')

// Mock the child components to avoid complex dependencies
vi.mock('../dashboard', () => ({
  Dashboard: () => <div data-testid="desktop-dashboard">Desktop Dashboard</div>
}))

vi.mock('../mobile-dashboard', () => ({
  MobileDashboard: () => <div data-testid="mobile-dashboard">Mobile Dashboard</div>
}))

describe('ResponsiveDashboard', () => {
  beforeEach(() => {
    vi.mocked(useUserStore).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      addXp: vi.fn(),
      addBadge: vi.fn(),
      levelUp: vi.fn(),
    })

    vi.mocked(useChallengeStore).mockReturnValue({
      challenges: [],
      activeChallenge: null,
      completedChallenges: [],
      initializeChallenges: vi.fn(),
      startChallenge: vi.fn(),
      updateChallengeProgress: vi.fn(),
      completeChallenge: vi.fn(),
      checkTradeProgress: vi.fn(),
    })
  })

  it('renders desktop dashboard on large screens', async () => {
    mockWindowSize(1200, 800) // Desktop size
    
    render(<ResponsiveDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('desktop-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-dashboard')).not.toBeInTheDocument()
    })
  })

  it('renders mobile dashboard on small screens', async () => {
    mockWindowSize(800, 600) // Mobile size
    
    render(<ResponsiveDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mobile-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('desktop-dashboard')).not.toBeInTheDocument()
    })
  })

  it('switches from mobile to desktop on resize', async () => {
    mockWindowSize(800, 600) // Start mobile
    
    render(<ResponsiveDashboard />)
    
    // Should show mobile initially
    await waitFor(() => {
      expect(screen.getByTestId('mobile-dashboard')).toBeInTheDocument()
    })
    
    // Resize to desktop
    mockWindowSize(1200, 800)
    
    await waitFor(() => {
      expect(screen.getByTestId('desktop-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-dashboard')).not.toBeInTheDocument()
    })
  })

  it('switches from desktop to mobile on resize', async () => {
    mockWindowSize(1200, 800) // Start desktop
    
    render(<ResponsiveDashboard />)
    
    // Should show desktop initially
    await waitFor(() => {
      expect(screen.getByTestId('desktop-dashboard')).toBeInTheDocument()
    })
    
    // Resize to mobile
    mockWindowSize(800, 600)
    
    await waitFor(() => {
      expect(screen.getByTestId('mobile-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('desktop-dashboard')).not.toBeInTheDocument()
    })
  })

  it('uses 1024px as the breakpoint', async () => {
    // Test exactly at breakpoint
    mockWindowSize(1024, 800)
    
    render(<ResponsiveDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('desktop-dashboard')).toBeInTheDocument()
    })
    
    // Test just below breakpoint
    mockWindowSize(1023, 800)
    
    await waitFor(() => {
      expect(screen.getByTestId('mobile-dashboard')).toBeInTheDocument()
    })
  })

  it('handles multiple resize events', async () => {
    mockWindowSize(1200, 800) // Desktop
    
    render(<ResponsiveDashboard />)
    
    // Desktop -> Mobile -> Desktop -> Mobile
    mockWindowSize(800, 600)
    await waitFor(() => {
      expect(screen.getByTestId('mobile-dashboard')).toBeInTheDocument()
    })
    
    mockWindowSize(1200, 800)
    await waitFor(() => {
      expect(screen.getByTestId('desktop-dashboard')).toBeInTheDocument()
    })
    
    mockWindowSize(600, 400)
    await waitFor(() => {
      expect(screen.getByTestId('mobile-dashboard')).toBeInTheDocument()
    })
  })

  it('cleans up resize event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = render(<ResponsiveDashboard />)
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})