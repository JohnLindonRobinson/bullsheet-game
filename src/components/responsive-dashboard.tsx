import { useEffect, useState } from 'react'
import { Dashboard } from './dashboard'
import { MobileDashboard } from './mobile-dashboard'

export function ResponsiveDashboard() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    // Check initial screen size
    checkScreenSize()

    // Listen for window resize
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return isMobile ? <MobileDashboard /> : <Dashboard />
}