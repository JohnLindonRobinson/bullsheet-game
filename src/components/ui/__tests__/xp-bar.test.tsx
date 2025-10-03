import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { XpBar } from '../xp-bar'
import { useUserStore } from '@/stores/userStore'
import { mockUser } from '@/test/utils'

// Mock the user store
vi.mock('@/stores/userStore')

describe('XpBar Component', () => {
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
  })

  it('renders XP bar with user data', () => {
    render(<XpBar />)
    
    // Check level display
    expect(screen.getByText('Level 2')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    
    // Check XP progress
    expect(screen.getByText('0 / 1,000 XP')).toBeInTheDocument()
  })

  it('calculates progress percentage correctly', () => {
    // Mock user with 750 XP (level 1, 750/1000 progress)
    vi.mocked(useUserStore).mockReturnValue({
      user: { ...mockUser, xp: 750, level: 1 },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      addXp: vi.fn(),
      addBadge: vi.fn(),
      levelUp: vi.fn(),
    })

    render(<XpBar />)
    
    expect(screen.getByText('Level 1')).toBeInTheDocument()
    expect(screen.getByText('750 / 1,000 XP')).toBeInTheDocument()
    
    // Check that progress is shown correctly in the component
    const progressText = screen.getByText('750 / 1,000 XP')
    expect(progressText).toBeInTheDocument()
  })

  it('handles level 3 XP correctly', () => {
    // User with 2500 XP should be level 3 with 500/1000 progress
    vi.mocked(useUserStore).mockReturnValue({
      user: { ...mockUser, xp: 2500, level: 3 },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      addXp: vi.fn(),
      addBadge: vi.fn(),
      levelUp: vi.fn(),
    })

    render(<XpBar />)
    
    expect(screen.getByText('Level 3')).toBeInTheDocument()
    expect(screen.getByText('500 / 1,000 XP')).toBeInTheDocument()
  })

  it('returns null when user is not logged in', () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      addXp: vi.fn(),
      addBadge: vi.fn(),
      levelUp: vi.fn(),
    })

    const { container } = render(<XpBar />)
    expect(container.firstChild).toBeNull()
  })

  it('displays correct styling classes', () => {
    render(<XpBar />)
    
    // Test that the main container has the correct classes
    const xpBarContainer = screen.getByText('Level 2').closest('div')?.parentElement
    expect(xpBarContainer).toHaveClass('bg-paper/80', 'backdrop-blur-sm', 'rounded-lg')
  })
})