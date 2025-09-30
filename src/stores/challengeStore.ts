import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Challenge, Trade } from '../types'

interface ChallengeState {
  challenges: Challenge[]
  activeChallenge: Challenge | null
  completedChallenges: string[]
  streakData: {
    consecutiveWins: number
    lastTradeProfit: boolean
    tradedSymbols: Set<string>
    dailyTrades: { date: string; count: number }[]
    totalVolume: number
    consecutiveTradingDays: number
    lastTradingDate: string
  }
  
  // Actions
  initializeChallenges: () => void
  startChallenge: (challengeId: string) => void
  updateChallengeProgress: (challengeId: string, progress: number) => void
  completeChallenge: (challengeId: string) => void
  checkTradeProgress: (trade: Trade) => void
  resetDailyProgress: () => void
  updateStreakData: (isProfit: boolean, symbol: string, volume: number) => void
}

const initialChallenges: Challenge[] = [
  {
    id: 'apple-trader',
    name: 'Apple Trader',
    description: 'Make 3 trades in AAPL stock',
    difficulty: 'beginner',
    xpReward: 100,
    badge: {
      id: 'apple-badge',
      name: 'Apple Trader',
      description: 'Completed your first Apple trades',
      icon: '🍎',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'trades',
        target: 3,
        current: 0
      }
    ],
    status: 'available',
    progress: 0
  },
  {
    id: 'profit-seeker',
    name: 'Profit Seeker',
    description: 'Achieve $500 in total profits',
    difficulty: 'intermediate',
    xpReward: 250,
    badge: {
      id: 'profit-badge',
      name: 'Profit Seeker',
      description: 'Made your first $500 in profits',
      icon: '💰',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'profit',
        target: 500,
        current: 0
      }
    ],
    status: 'locked',
    progress: 0
  },
  {
    id: 'iron-hands',
    name: 'Iron Hands',
    description: 'Survive a 10% portfolio drawdown without panicking',
    difficulty: 'advanced',
    xpReward: 500,
    badge: {
      id: 'iron-hands-badge',
      name: 'Iron Hands',
      description: 'Weathered the storm with diamond hands',
      icon: '💎',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'drawdown',
        target: 10,
        current: 0
      }
    ],
    status: 'locked',
    progress: 0
  },
  {
    id: 'day-trader',
    name: 'Day Trader',
    description: 'Complete 10 trades in a single day',
    difficulty: 'intermediate',
    xpReward: 300,
    badge: {
      id: 'day-trader-badge',
      name: 'Day Trader',
      description: 'Mastered the art of day trading',
      icon: '⚡',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'trades',
        target: 10,
        current: 0
      }
    ],
    status: 'locked',
    progress: 0
  },
  {
    id: 'winning-streak',
    name: 'Winning Streak',
    description: 'Make 5 profitable trades in a row',
    difficulty: 'advanced',
    xpReward: 400,
    badge: {
      id: 'streak-badge',
      name: 'Winning Streak',
      description: 'Five wins in a row - impressive!',
      icon: '🔥',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'streak',
        target: 5,
        current: 0
      }
    ],
    status: 'locked',
    progress: 0
  },
  {
    id: 'diversification-master',
    name: 'Diversification Master',
    description: 'Trade 5 different symbols in one week',
    difficulty: 'intermediate',
    xpReward: 350,
    badge: {
      id: 'diversification-badge',
      name: 'Diversification Master',
      description: 'Spread your risk across multiple assets',
      icon: '🌐',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'symbols',
        target: 5,
        current: 0
      }
    ],
    status: 'locked',
    progress: 0
  },
  {
    id: 'volume-trader',
    name: 'Volume Trader',
    description: 'Execute trades worth $25,000 in total volume',
    difficulty: 'advanced',
    xpReward: 600,
    badge: {
      id: 'volume-badge',
      name: 'Volume Trader',
      description: 'Big money moves - high volume trader',
      icon: '💪',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'volume',
        target: 25000,
        current: 0
      }
    ],
    status: 'locked',
    progress: 0
  },
  {
    id: 'marathon-trader',
    name: 'Marathon Trader',
    description: 'Trade for 7 consecutive days',
    difficulty: 'advanced',
    xpReward: 500,
    badge: {
      id: 'marathon-badge',
      name: 'Marathon Trader',
      description: 'Consistency is key - 7 days straight',
      icon: '🏃',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'time',
        target: 7,
        current: 0
      }
    ],
    status: 'locked',
    progress: 0
  },
  {
    id: 'profit-master',
    name: 'Profit Master',
    description: 'Achieve $2,500 in total profits',
    difficulty: 'advanced',
    xpReward: 750,
    badge: {
      id: 'profit-master-badge',
      name: 'Profit Master',
      description: 'Serious profits achieved',
      icon: '💎',
      earnedAt: new Date()
    },
    requirements: [
      {
        type: 'profit',
        target: 2500,
        current: 0
      }
    ],
    status: 'locked',
    progress: 0
  }
]

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      challenges: [],
      activeChallenge: null,
      completedChallenges: [],
      streakData: {
        consecutiveWins: 0,
        lastTradeProfit: false,
        tradedSymbols: new Set<string>(),
        dailyTrades: [],
        totalVolume: 0,
        consecutiveTradingDays: 0,
        lastTradingDate: ''
      },
      
      initializeChallenges: () => {
        set({ challenges: initialChallenges })
      },
      
      startChallenge: (challengeId: string) => {
        const { challenges } = get()
        const challenge = challenges.find(c => c.id === challengeId)
        if (challenge && challenge.status === 'available') {
          const updatedChallenges = challenges.map(c =>
            c.id === challengeId 
              ? { ...c, status: 'in_progress' as const }
              : c
          )
          set({ 
            challenges: updatedChallenges,
            activeChallenge: { ...challenge, status: 'in_progress' }
          })
        }
      },
      
      updateChallengeProgress: (challengeId: string, progress: number) => {
        const { challenges } = get()
        const updatedChallenges = challenges.map(c =>
          c.id === challengeId 
            ? { ...c, progress: Math.min(progress, 100) }
            : c
        )
        set({ challenges: updatedChallenges })
        
        // Auto-complete if progress reaches 100%
        if (progress >= 100) {
          get().completeChallenge(challengeId)
        }
      },
      
      completeChallenge: (challengeId: string) => {
        const { challenges, completedChallenges } = get()
        const challenge = challenges.find(c => c.id === challengeId)
        
        if (challenge) {
          const updatedChallenges = challenges.map(c =>
            c.id === challengeId 
              ? { ...c, status: 'completed' as const, progress: 100 }
              : c
          )
          
          // Unlock next challenges based on completion
          const unlockedChallenges = updatedChallenges.map(c => {
            if (c.status === 'locked') {
              // Unlock logic for progression
              if (challengeId === 'apple-trader' && c.id === 'profit-seeker') {
                return { ...c, status: 'available' as const }
              }
              if (challengeId === 'profit-seeker' && (c.id === 'day-trader' || c.id === 'iron-hands' || c.id === 'diversification-master')) {
                return { ...c, status: 'available' as const }
              }
              if ((challengeId === 'day-trader' || challengeId === 'iron-hands') && (c.id === 'winning-streak' || c.id === 'volume-trader')) {
                return { ...c, status: 'available' as const }
              }
              if (challengeId === 'diversification-master' && c.id === 'marathon-trader') {
                return { ...c, status: 'available' as const }
              }
              if ((challengeId === 'winning-streak' || challengeId === 'volume-trader') && c.id === 'profit-master') {
                return { ...c, status: 'available' as const }
              }
            }
            return c
          })
          
          set({ 
            challenges: unlockedChallenges,
            completedChallenges: [...completedChallenges, challengeId],
            activeChallenge: null
          })
        }
      },
      
      checkTradeProgress: (trade: Trade) => {
        const { challenges } = get()
        
        // Update Apple Trader challenge
        const appleTrader = challenges.find(c => c.id === 'apple-trader')
        if (appleTrader && appleTrader.status === 'in_progress' && trade.symbol === 'AAPL') {
          const newCurrent = appleTrader.requirements[0].current + 1
          const progress = (newCurrent / appleTrader.requirements[0].target) * 100
          
          const updatedChallenges = challenges.map(c =>
            c.id === 'apple-trader'
              ? {
                  ...c,
                  requirements: [{ ...c.requirements[0], current: newCurrent }],
                  progress
                }
              : c
          )
          
          set({ challenges: updatedChallenges })
          get().updateChallengeProgress('apple-trader', progress)
        }
        
        // Update Day Trader challenge (count trades in single day)
        const dayTrader = challenges.find(c => c.id === 'day-trader')
        if (dayTrader && dayTrader.status === 'in_progress') {
          const today = new Date().toDateString()
          const currentStreakData = get().streakData
          const todayTrades = currentStreakData.dailyTrades.find(d => d.date === today)
          const todayCount = todayTrades ? todayTrades.count : 1
          
          const progress = (todayCount / dayTrader.requirements[0].target) * 100
          get().updateChallengeProgress('day-trader', Math.min(progress, 100))
        }
        
        // Update Winning Streak challenge
        const winningStreak = challenges.find(c => c.id === 'winning-streak')
        if (winningStreak && winningStreak.status === 'in_progress') {
          const currentStreakData = get().streakData
          const progress = (currentStreakData.consecutiveWins / winningStreak.requirements[0].target) * 100
          get().updateChallengeProgress('winning-streak', Math.min(progress, 100))
        }
        
        // Update Diversification Master challenge
        const diversificationMaster = challenges.find(c => c.id === 'diversification-master')
        if (diversificationMaster && diversificationMaster.status === 'in_progress') {
          const currentStreakData = get().streakData
          const progress = (currentStreakData.tradedSymbols.size / diversificationMaster.requirements[0].target) * 100
          get().updateChallengeProgress('diversification-master', Math.min(progress, 100))
        }
        
        // Update Volume Trader challenge
        const volumeTrader = challenges.find(c => c.id === 'volume-trader')
        if (volumeTrader && volumeTrader.status === 'in_progress') {
          const currentStreakData = get().streakData
          const progress = (currentStreakData.totalVolume / volumeTrader.requirements[0].target) * 100
          get().updateChallengeProgress('volume-trader', Math.min(progress, 100))
        }
        
        // Update Marathon Trader challenge
        const marathonTrader = challenges.find(c => c.id === 'marathon-trader')
        if (marathonTrader && marathonTrader.status === 'in_progress') {
          const currentStreakData = get().streakData
          const progress = (currentStreakData.consecutiveTradingDays / marathonTrader.requirements[0].target) * 100
          get().updateChallengeProgress('marathon-trader', Math.min(progress, 100))
        }
        
        // Update Profit challenges
        if (trade.profit && trade.profit > 0) {
          challenges.forEach(challenge => {
            if ((challenge.id === 'profit-seeker' || challenge.id === 'profit-master') && 
                challenge.status === 'in_progress') {
              const requirement = challenge.requirements.find(r => r.type === 'profit')
              if (requirement) {
                const newCurrent = requirement.current + trade.profit!
                const progress = (newCurrent / requirement.target) * 100
                
                const updatedChallenges = challenges.map(c =>
                  c.id === challenge.id
                    ? {
                        ...c,
                        requirements: c.requirements.map(r => 
                          r.type === 'profit' ? { ...r, current: newCurrent } : r
                        ),
                        progress
                      }
                    : c
                )
                
                set({ challenges: updatedChallenges })
                get().updateChallengeProgress(challenge.id, Math.min(progress, 100))
              }
            }
          })
        }
      },
      
      resetDailyProgress: () => {
        const today = new Date().toDateString()
        set(state => ({
          streakData: {
            ...state.streakData,
            dailyTrades: state.streakData.dailyTrades.filter(d => d.date !== today)
          }
        }))
      },
      
      updateStreakData: (isProfit: boolean, symbol: string, volume: number) => {
        const today = new Date().toDateString()
        
        set(state => {
          const newTradedSymbols = new Set(state.streakData.tradedSymbols)
          newTradedSymbols.add(symbol)
          
          const newConsecutiveWins = isProfit && state.streakData.lastTradeProfit 
            ? state.streakData.consecutiveWins + 1
            : isProfit ? 1 : 0
          
          const existingDayTrades = state.streakData.dailyTrades.find(d => d.date === today)
          const updatedDailyTrades = existingDayTrades
            ? state.streakData.dailyTrades.map(d => 
                d.date === today ? { ...d, count: d.count + 1 } : d
              )
            : [...state.streakData.dailyTrades, { date: today, count: 1 }]
          
          const newConsecutiveTradingDays = state.streakData.lastTradingDate === today
            ? state.streakData.consecutiveTradingDays
            : state.streakData.lastTradingDate === new Date(Date.now() - 86400000).toDateString()
            ? state.streakData.consecutiveTradingDays + 1
            : 1
          
          return {
            streakData: {
              consecutiveWins: newConsecutiveWins,
              lastTradeProfit: isProfit,
              tradedSymbols: newTradedSymbols,
              dailyTrades: updatedDailyTrades,
              totalVolume: state.streakData.totalVolume + volume,
              consecutiveTradingDays: newConsecutiveTradingDays,
              lastTradingDate: today
            }
          }
        })
      }
    }),
    {
      name: 'bullsheet-challenges'
    }
  )
)