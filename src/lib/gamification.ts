import confetti from 'canvas-confetti'
import { audioManager } from './audioManager'

export class GameificationManager {
  private static instance: GameificationManager
  
  static getInstance(): GameificationManager {
    if (!GameificationManager.instance) {
      GameificationManager.instance = new GameificationManager()
    }
    return GameificationManager.instance
  }
  
  // Enhanced celebration methods with improved audio
  celebrateButtonClick() {
    audioManager.playSound('click')
  }
  
  celebrateTrade(isProfit?: boolean, amount?: number) {
    // Use context-aware sound selection
    if (isProfit !== undefined) {
      audioManager.playTradeSound(isProfit, amount)
    } else {
      audioManager.playSound('trade')
    }
    
    // Small confetti burst
    confetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#4CAF50', '#3B82F6', '#FFE082']
    })
  }
  
  celebrateLevelUp() {
    audioManager.playSound('levelUp')
    
    // Big confetti celebration
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#4CAF50', '#3B82F6', '#FFE082', '#EF5350', '#9FA8DA']
    }
    
    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }
    
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    
    fire(0.2, {
      spread: 60,
    })
    
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }
  
  celebrateBadgeEarned() {
    audioManager.playSound('badge')
    
    // Sticker peel effect with confetti
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFE082', '#4CAF50', '#3B82F6'],
      shapes: ['square'],
      scalar: 1.2
    })
    
    // Secondary burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.9 },
        colors: ['#FFE082'],
        gravity: 0.8
      })
    }, 200)
  }
  
  celebrateChallengeComplete() {
    audioManager.playSound('challenge')
    
    // Epic confetti celebration
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 1000,
      colors: ['#4CAF50', '#3B82F6', '#FFE082', '#EF5350', '#9FA8DA']
    }
    
    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      
      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }
  
  // XP gain animation
  showXpGain(amount: number, element?: HTMLElement) {
    // Create floating XP text
    const xpElement = document.createElement('div')
    xpElement.textContent = `+${amount} XP`
    xpElement.className = `
      fixed z-[9999] pointer-events-none
      text-finance-green font-bold text-lg
      animate-bounce-in
    `
    
    if (element) {
      const rect = element.getBoundingClientRect()
      xpElement.style.left = `${rect.left + rect.width / 2}px`
      xpElement.style.top = `${rect.top - 20}px`
    } else {
      xpElement.style.left = '50%'
      xpElement.style.top = '20%'
      xpElement.style.transform = 'translateX(-50%)'
    }
    
    document.body.appendChild(xpElement)
    
    // Animate and remove
    setTimeout(() => {
      xpElement.style.transform += ' translateY(-50px)'
      xpElement.style.opacity = '0'
      xpElement.style.transition = 'all 1s ease-out'
    }, 100)
    
    setTimeout(() => {
      document.body.removeChild(xpElement)
    }, 1100)
  }
  
  // Level up popup
  showLevelUpPopup(newLevel: number) {
    const popup = document.createElement('div')
    popup.className = `
      fixed inset-0 z-[9999] flex items-center justify-center
      bg-black/20 backdrop-blur-sm
      animate-bounce-in
    `
    
    popup.innerHTML = `
      <div class="bg-paper rounded-xl shadow-paper-lg p-8 text-center border-4 border-finance-green max-w-md mx-4">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-handwrite text-finance-green mb-2">Level Up!</h2>
        <p class="text-xl font-bold text-graphite mb-4">You reached Level ${newLevel}!</p>
        <div class="text-sm text-muted-foreground mb-6">
          Keep trading to unlock more challenges and features!
        </div>
        <button 
          class="btn-success px-6 py-3 rounded-lg font-medium hover:scale-105 transform transition-all"
          onclick="this.parentElement.parentElement.remove()"
        >
          🚀 Continue Trading
        </button>
      </div>
    `
    
    document.body.appendChild(popup)
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup)
      }
    }, 5000)
    
    this.celebrateLevelUp()
  }
  
  // Additional feedback methods
  showFeedback(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    // Play contextual sound
    switch (type) {
      case 'success':
        audioManager.playContextualSound('positive')
        break
      case 'error':
        audioManager.playContextualSound('negative')
        break
      case 'info':
        audioManager.playContextualSound('neutral')
        break
      case 'warning':
        audioManager.playSound('whoosh')
        break
    }

    // Create visual feedback
    const feedbackElement = document.createElement('div')
    feedbackElement.textContent = message
    feedbackElement.className = `
      fixed top-4 right-4 z-[9999] pointer-events-none
      px-4 py-2 rounded-lg shadow-lg font-medium text-sm
      animate-bounce-in max-w-sm
      ${type === 'success' ? 'bg-finance-green text-white' : ''}
      ${type === 'error' ? 'bg-coral-red text-white' : ''}
      ${type === 'info' ? 'bg-paper-blue text-white' : ''}
      ${type === 'warning' ? 'bg-yellow-500 text-white' : ''}
    `
    
    document.body.appendChild(feedbackElement)
    
    // Animate and remove
    setTimeout(() => {
      feedbackElement.style.transform = 'translateX(100%)'
      feedbackElement.style.opacity = '0'
      feedbackElement.style.transition = 'all 0.3s ease-out'
    }, 2000)
    
    setTimeout(() => {
      if (feedbackElement.parentNode) {
        document.body.removeChild(feedbackElement)
      }
    }, 2300)
  }
  
  // Quick action celebrations
  celebrateQuickAction(action: string) {
    audioManager.playSound('whoosh')
    this.showFeedback(`⚡ ${action}`, 'info')
  }
  
  celebrateHotkey(action: string) {
    audioManager.playSound('ding', 0.7)
    this.showFeedback(`⌨️ ${action}`, 'success')
  }
  
  celebrateChallenge(challengeName: string) {
    audioManager.playSound('success')
    this.showFeedback(`🎯 ${challengeName}`, 'success')
  }
  
  // Error feedback
  showError(message: string) {
    this.showFeedback(`❌ ${message}`, 'error')
  }
  
  showWarning(message: string) {
    this.showFeedback(`⚠️ ${message}`, 'warning')
  }
  
  // Initialize audio manager when gamification starts
  async initializeAudio() {
    await audioManager.initialize()
  }
}

// Export singleton instance
export const gamification = GameificationManager.getInstance()