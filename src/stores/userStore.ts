import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Badge } from '../types'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  addXp: (amount: number) => void
  addBadge: (badge: Badge) => void
  levelUp: () => void
}

const calculateLevelFromXp = (xp: number): number => {
  // Simple level calculation: each level requires 1000 XP
  return Math.floor(xp / 1000) + 1
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (user: User) => {
        set({ user, isAuthenticated: true })
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      addXp: (amount: number) => {
        const { user } = get()
        if (!user) return
        
        const newXp = user.xp + amount
        const newLevel = calculateLevelFromXp(newXp)
        const leveledUp = newLevel > user.level
        
        set({
          user: {
            ...user,
            xp: newXp,
            level: newLevel
          }
        })
        
        if (leveledUp) {
          get().levelUp()
        }
      },
      
      addBadge: (badge: Badge) => {
        const { user } = get()
        if (!user) return
        
        set({
          user: {
            ...user,
            badges: [...user.badges, badge]
          }
        })
      },
      
      levelUp: () => {
        // This can trigger confetti and level up animations
        console.log('Level up!')
      }
    }),
    {
      name: 'bullsheet-user'
    }
  )
)