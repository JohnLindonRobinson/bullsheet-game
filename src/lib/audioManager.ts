import { Howl } from 'howler'

export type SoundType = 
  | 'click' 
  | 'trade' 
  | 'levelUp' 
  | 'badge' 
  | 'challenge'
  | 'error'
  | 'success'
  | 'whoosh'
  | 'ding'
  | 'cashRegister'
  | 'profit'
  | 'loss'

export type MusicTrack = 
  | 'tradingFloor'
  | 'lofi'
  | 'upbeat'
  | 'ambient'

interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  musicEnabled: boolean
  sfxEnabled: boolean
  currentTrack: MusicTrack | null
}

interface SoundEffect {
  sound: Howl
  baseVolume: number
}

class AudioManager {
  private static instance: AudioManager
  private settings: AudioSettings
  private sounds: Record<SoundType, SoundEffect> = {} as Record<SoundType, SoundEffect>
  private music: Record<MusicTrack, Howl> = {} as Record<MusicTrack, Howl>
  private currentMusic: Howl | null = null
  private isInitialized = false

  constructor() {
    this.settings = {
      masterVolume: 0.7,
      musicVolume: 0.4,
      sfxVolume: 0.6,
      musicEnabled: true,
      sfxEnabled: true,
      currentTrack: null
    }

    this.loadSettings()
    this.initializeSounds()
    this.initializeMusic()
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('bullsheet-audio-settings')
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error)
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem('bullsheet-audio-settings', JSON.stringify(this.settings))
    } catch (error) {
      console.warn('Failed to save audio settings:', error)
    }
  }

  private initializeSounds() {
    // Enhanced sound effects with better quality generated sounds
    this.sounds = {
      click: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGd3JmZL5+xO6ZUIp1TRgE'],
          rate: 2.0,
          preload: true
        }),
        baseVolume: 0.2
      },
      
      trade: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRnIGAABXQVZFZm10IBAAAAABA,AEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj'],
          rate: 1.0,
          preload: true
        }),
        baseVolume: 0.5
      },

      levelUp: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGCijv6qxcGgU7k+fty3YkBCOH0PLNeSUGG37K89mKNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmyhBSuAzvLYiUgMA'],
          rate: 1.5,
          preload: true
        }),
        baseVolume: 0.6
      },

      badge: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYLP8s15JQUrfsrz2Yo2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYoAILQ'],
          rate: 1.2,
          preload: true
        }),
        baseVolume: 0.7
      },

      challenge: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYLP8s15JQUrfsrz2Yo2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYogs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYoQs3x2Is2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgY'],
          rate: 1.3,
          preload: true
        }),
        baseVolume: 0.6
      },

      error: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSADAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYbO8deKOAcadsby2YlICB2Ez/DQfzMIGG259eiYVhEOUKjl8btkHQc2jdz1z3oqBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAU='],
          rate: 0.8,
          preload: true
        }),
        baseVolume: 0.4
      },

      success: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRi4EAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoEAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYLP8s15JQUrfsrz2Yo2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYoAILQ8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYLP8s15JQUrfsrz2Yo2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYoAILQ8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYLP8s15JQUrfsrz2Yo2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYoAILQ8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYLP8s15JQUrfsrz2Yo2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgY='],
          rate: 1.4,
          preload: true
        }),
        baseVolume: 0.5
      },

      whoosh: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSADAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGd3JmZPOeUIFVLRgE'],
          rate: 1.8,
          preload: true
        }),
        baseVolume: 0.3
      },

      ding: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRjIEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQ4EAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGdyzfn3CPPqvXHQoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGdyzfn3CPPqvXHQo='],
          rate: 2.2,
          preload: true
        }),
        baseVolume: 0.4
      },

      cashRegister: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRjYEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIEAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGCCzfHYizYHH3vM9PSJIQQdhs/yzXklBSR2xfDdkEAJFG606euo='],
          rate: 1.0,
          preload: true
        }),
        baseVolume: 0.6
      },

      profit: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRjIEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQ4EAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGKILN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYLP8s15JQUrfsrz2Yo2Bx97zPT0iSEEHYbP8s15JQUkdsXw3ZBACRRetOnrqFUUCkaf4PK+bCEFK4DO8tiNSQwALZrK8sVzIgYKN8diLNgcfe8z09IkhBB2Gz/LNeSUFJHbF8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIG='],
          rate: 1.6,
          preload: true
        }),
        baseVolume: 0.7
      },

      loss: {
        sound: new Howl({
          src: ['data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSADAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGHYbO8deKOAcadsby2YlICB2Ez/DQfzMIGG259eiYVhEOUKjl8btkHQc2jdz1z3oqBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAUrhc3v2IxJDRAsmMvyxnkpBSJ5x+/dkT4LElyz6eaoWRQLQpnf8r5wJAU='],
          rate: 0.6,
          preload: true
        }),
        baseVolume: 0.5
      }
    }

    // Preload all sound effects
    Object.values(this.sounds).forEach(({ sound }) => {
      sound.load()
    })
  }

  private initializeMusic() {
    // Background music tracks - using placeholder data URLs for now
    // In production, these would be actual music files
    this.music = {
      tradingFloor: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGd3JmZL5+xO6ZUIp1TRgE'],
        loop: true,
        preload: true
      }),

      lofi: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGd3JmZL5+xO6ZUIp1TRgE'],
        loop: true,
        preload: true
      }),

      upbeat: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGd3JmZL5+xO6ZUIp1TRgE'],
        loop: true,
        preload: true
      }),

      ambient: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzvLYjUkMAC2ayvLFcyIGd3JmZL5+xO6ZUIp1TRgE'],
        loop: true,
        preload: true
      })
    }

    // Preload all music tracks
    Object.values(this.music).forEach(music => {
      music.load()
    })
  }

  // Initialize audio after user interaction (required for web audio policies)
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Try to unlock audio context
      const context = Howler.ctx
      if (context && context.state === 'suspended') {
        await context.resume()
      }
      
      this.isInitialized = true
      this.updateAllVolumes()
      
      // Start background music if enabled
      if (this.settings.musicEnabled && this.settings.currentTrack) {
        this.playMusic(this.settings.currentTrack)
      }
    } catch (error) {
      console.warn('Failed to initialize audio:', error)
    }
  }

  private updateAllVolumes() {
    // Update all sound effect volumes
    Object.values(this.sounds).forEach(({ sound, baseVolume }) => {
      sound.volume(baseVolume * this.settings.sfxVolume * this.settings.masterVolume)
    })

    // Update music volume
    if (this.currentMusic) {
      this.currentMusic.volume(this.settings.musicVolume * this.settings.masterVolume)
    }
  }

  // Sound effect controls
  playSound(type: SoundType, volumeMultiplier = 1) {
    if (!this.settings.sfxEnabled || !this.isInitialized) return

    const soundEffect = this.sounds[type]
    if (soundEffect) {
      const volume = soundEffect.baseVolume * this.settings.sfxVolume * this.settings.masterVolume * volumeMultiplier
      soundEffect.sound.volume(volume)
      soundEffect.sound.play()
    }
  }

  // Music controls
  playMusic(track: MusicTrack) {
    if (!this.settings.musicEnabled || !this.isInitialized) return

    // Stop current music
    if (this.currentMusic) {
      this.currentMusic.stop()
    }

    // Start new track
    this.currentMusic = this.music[track]
    if (this.currentMusic) {
      this.currentMusic.volume(this.settings.musicVolume * this.settings.masterVolume)
      this.currentMusic.play()
      this.settings.currentTrack = track
      this.saveSettings()
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop()
      this.currentMusic = null
      this.settings.currentTrack = null
      this.saveSettings()
    }
  }

  // Volume controls
  setMasterVolume(volume: number) {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume))
    this.updateAllVolumes()
    this.saveSettings()
  }

  setMusicVolume(volume: number) {
    this.settings.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.currentMusic) {
      this.currentMusic.volume(this.settings.musicVolume * this.settings.masterVolume)
    }
    this.saveSettings()
  }

  setSfxVolume(volume: number) {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume))
    this.updateAllVolumes()
    this.saveSettings()
  }

  // Toggle controls
  toggleMusic() {
    this.settings.musicEnabled = !this.settings.musicEnabled
    
    if (this.settings.musicEnabled) {
      if (this.settings.currentTrack) {
        this.playMusic(this.settings.currentTrack)
      } else {
        this.playMusic('lofi') // Default track
      }
    } else {
      this.stopMusic()
    }
    
    this.saveSettings()
  }

  toggleSfx() {
    this.settings.sfxEnabled = !this.settings.sfxEnabled
    this.saveSettings()
  }

  // Getters
  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  isMusicEnabled(): boolean {
    return this.settings.musicEnabled
  }

  isSfxEnabled(): boolean {
    return this.settings.sfxEnabled
  }

  getCurrentTrack(): MusicTrack | null {
    return this.settings.currentTrack
  }

  // Context-aware sound effects
  playTradeSound(isProfit: boolean, amount?: number) {
    if (isProfit) {
      if (amount && amount > 1000) {
        this.playSound('cashRegister')
      } else {
        this.playSound('profit')
      }
    } else {
      this.playSound('loss')
    }
  }

  playContextualSound(context: 'positive' | 'negative' | 'neutral' | 'interactive') {
    switch (context) {
      case 'positive':
        this.playSound('success')
        break
      case 'negative':
        this.playSound('error')
        break
      case 'neutral':
        this.playSound('ding')
        break
      case 'interactive':
        this.playSound('click')
        break
    }
  }
}

export const audioManager = AudioManager.getInstance()