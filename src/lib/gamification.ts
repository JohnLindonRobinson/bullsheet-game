import confetti from 'canvas-confetti'
import { Howl } from 'howler'

// Sound effects using data URLs (generated sounds)
const sounds = {
  // Simple beep for button clicks (generated)
  click: new Howl({
    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGd3JmZL5+xO6ZUIp1TRgE'],
    volume: 0.3,
    rate: 2.0
  }),
  
  // Level up sound (cheerful beep sequence)
  levelUp: new Howl({
    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGCijv6qxcGgU7k+fty3YkBCOH0PLNeSUGG37K89mKNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmyhBSuAzvLYiUgMA'],
    volume: 0.5,
    rate: 1.5
  }),
  
  // Trade executed sound
  trade: new Howl({
    src: ['data:audio/wav;base64,UklGRnIGAABXQVZFZm10IBAAAAABA',
'AEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj'],
    volume: 0.4
  }),
  
  // Badge earned sound
  badge: new Howl({
    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYLP8s15JQUrfsrz2Yo2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYoAILQ'],
    volume: 0.6,
    rate: 1.2
  })
}

// Preload sounds
Object.values(sounds).forEach(sound => sound.load())

export class GameificationManager {
  private static instance: GameificationManager
  private soundEnabled = true
  
  static getInstance(): GameificationManager {
    if (!GameificationManager.instance) {
      GameificationManager.instance = new GameificationManager()
    }
    return GameificationManager.instance
  }
  
  // Sound management
  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled
  }
  
  playSound(soundType: keyof typeof sounds) {
    if (this.soundEnabled) {
      try {
        sounds[soundType].play()
      } catch (error) {
        console.warn('Failed to play sound:', error)
      }
    }
  }
  
  // Confetti effects
  celebrateButtonClick() {
    this.playSound('click')
  }
  
  celebrateTrade() {
    this.playSound('trade')
    
    // Small confetti burst
    confetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#4CAF50', '#3B82F6', '#FFE082']
    })
  }
  
  celebrateLevelUp() {
    this.playSound('levelUp')
    
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
    this.playSound('badge')
    
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
    this.playSound('levelUp')
    
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
}

// Export singleton instance
export const gamification = GameificationManager.getInstance()