import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUserStore } from '../userStore'
import { mockUser } from '@/test/utils'

// Mock the gamification module
vi.mock('@/lib/gamification', () => ({
  gamification: {
    showLevelUpPopup: vi.fn(),
  },
}))

describe('UserStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      user: null,
      isAuthenticated: false,
    })
  })

  it('initializes with empty state', () => {
    const { user, isAuthenticated } = useUserStore.getState()
    
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('logs in user correctly', () => {
    const { login } = useUserStore.getState()
    
    login(mockUser)
    
    const { user, isAuthenticated } = useUserStore.getState()
    expect(user).toEqual(mockUser)
    expect(isAuthenticated).toBe(true)
  })

  it('logs out user correctly', () => {
    const { login, logout } = useUserStore.getState()
    
    // First login
    login(mockUser)
    expect(useUserStore.getState().isAuthenticated).toBe(true)
    
    // Then logout
    logout()
    
    const { user, isAuthenticated } = useUserStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('adds XP without leveling up', () => {
    const { login, addXp } = useUserStore.getState()
    
    login({ ...mockUser, xp: 500, level: 1 })
    addXp(200)
    
    const { user } = useUserStore.getState()
    expect(user?.xp).toBe(700)
    expect(user?.level).toBe(1) // Should still be level 1
  })

  it('levels up when XP threshold is reached', () => {
    const { login, addXp } = useUserStore.getState()
    
    login({ ...mockUser, xp: 900, level: 1 })
    addXp(200) // This should trigger level up to level 2
    
    const { user } = useUserStore.getState()
    expect(user?.xp).toBe(1100)
    expect(user?.level).toBe(2)
  })

  it('calculates level correctly for various XP amounts', () => {
    const { login, addXp } = useUserStore.getState()
    
    // Test level 1 (0-999 XP)
    login({ ...mockUser, xp: 0, level: 1 })
    addXp(500)
    expect(useUserStore.getState().user?.level).toBe(1)
    
    // Test level 2 (1000-1999 XP)  
    login({ ...mockUser, xp: 0, level: 1 })
    addXp(1500)
    expect(useUserStore.getState().user?.level).toBe(2)
    
    // Test level 3 (2000-2999 XP)
    login({ ...mockUser, xp: 0, level: 1 })
    addXp(2500)
    expect(useUserStore.getState().user?.level).toBe(3)
  })

  it('adds badges correctly', () => {
    const { login, addBadge } = useUserStore.getState()
    const testBadge = {
      id: 'test-badge',
      name: 'Test Badge',
      description: 'A test badge',
      icon: '🏆',
      earnedAt: new Date(),
    }
    
    login({ ...mockUser, badges: [] })
    addBadge(testBadge)
    
    const { user } = useUserStore.getState()
    expect(user?.badges).toHaveLength(1)
    expect(user?.badges[0]).toEqual(testBadge)
  })

  it('handles multiple badges', () => {
    const { login, addBadge } = useUserStore.getState()
    const badge1 = {
      id: 'badge-1',
      name: 'First Badge',
      description: 'First badge',
      icon: '🥇',
      earnedAt: new Date(),
    }
    const badge2 = {
      id: 'badge-2', 
      name: 'Second Badge',
      description: 'Second badge',
      icon: '🥈',
      earnedAt: new Date(),
    }
    
    login({ ...mockUser, badges: [] })
    addBadge(badge1)
    addBadge(badge2)
    
    const { user } = useUserStore.getState()
    expect(user?.badges).toHaveLength(2)
    expect(user?.badges).toContain(badge1)
    expect(user?.badges).toContain(badge2)
  })

  it('does not add XP when no user is logged in', () => {
    const { addXp } = useUserStore.getState()
    
    addXp(100)
    
    const { user } = useUserStore.getState()
    expect(user).toBeNull()
  })

  it('does not add badges when no user is logged in', () => {
    const { addBadge } = useUserStore.getState()
    const testBadge = {
      id: 'test-badge',
      name: 'Test Badge', 
      description: 'A test badge',
      icon: '🏆',
      earnedAt: new Date(),
    }
    
    addBadge(testBadge)
    
    const { user } = useUserStore.getState()
    expect(user).toBeNull()
  })
})