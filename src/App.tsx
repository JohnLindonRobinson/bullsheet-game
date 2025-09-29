import { useEffect } from 'react'
import { Dashboard } from './components/dashboard'
import { useUserStore } from './stores/userStore'

function App() {
  const { user, login } = useUserStore()

  // Demo: Auto-login a demo user on first load
  useEffect(() => {
    if (!user) {
      login({
        id: 'demo-user',
        username: 'TradingNinja',
        email: 'demo@bullsheet.com',
        xp: 750, // Starting at level 1 with some progress
        level: 1,
        badges: [],
        createdAt: new Date()
      })
    }
  }, [user, login])

  if (!user) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-3xl font-bold font-handwrite text-paper-blue mb-2">
            Loading BullSheet...
          </h1>
          <p className="text-muted-foreground">Your gamified trading simulator</p>
        </div>
      </div>
    )
  }

  return <Dashboard />
}

export default App