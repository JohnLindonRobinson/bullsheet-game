import { designTokens } from './design-tokens'

// Animation utilities and presets for BullSheet
export const animations = {
  // Keyframe definitions
  keyframes: {
    slideIn: {
      '0%': { transform: 'translateX(-100%)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' }
    },
    slideUp: {
      '0%': { transform: 'translateY(100%)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' }
    },
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' }
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' }
    },
    scaleIn: {
      '0%': { transform: 'scale(0.8)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' }
    },
    bounce: {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
      '100%': { transform: 'scale(1)' }
    },
    pulse: {
      '0%': { opacity: '1' },
      '50%': { opacity: '0.7' },
      '100%': { opacity: '1' }
    },
    shake: {
      '0%': { transform: 'translateX(0)' },
      '25%': { transform: 'translateX(-4px)' },
      '75%': { transform: 'translateX(4px)' },
      '100%': { transform: 'translateX(0)' }
    },
    wiggle: {
      '0%': { transform: 'rotate(0deg)' },
      '25%': { transform: 'rotate(-3deg)' },
      '75%': { transform: 'rotate(3deg)' },
      '100%': { transform: 'rotate(0deg)' }
    },
    glow: {
      '0%': { boxShadow: '0 0 5px rgba(117, 139, 253, 0.5)' },
      '50%': { boxShadow: '0 0 20px rgba(117, 139, 253, 0.8)' },
      '100%': { boxShadow: '0 0 5px rgba(117, 139, 253, 0.5)' }
    },
    typewriter: {
      '0%': { width: '0' },
      '100%': { width: '100%' }
    },
    priceUp: {
      '0%': { transform: 'translateY(0)', color: 'inherit' },
      '50%': { transform: 'translateY(-2px)', color: '#4CAF50' },
      '100%': { transform: 'translateY(0)', color: '#4CAF50' }
    },
    priceDown: {
      '0%': { transform: 'translateY(0)', color: 'inherit' },
      '50%': { transform: 'translateY(2px)', color: '#F44336' },
      '100%': { transform: 'translateY(0)', color: '#F44336' }
    },
    chartHighlight: {
      '0%': { opacity: '0', transform: 'scale(0.8)' },
      '50%': { opacity: '1', transform: 'scale(1.1)' },
      '100%': { opacity: '0.8', transform: 'scale(1)' }
    }
  },

  // Animation presets
  presets: {
    // Page transitions
    pageEnter: {
      animation: 'slideIn 0.3s ease-out',
      animationFillMode: 'both'
    },
    pageExit: {
      animation: 'fadeOut 0.2s ease-in',
      animationFillMode: 'both'
    },

    // Component animations
    modalEnter: {
      animation: 'scaleIn 0.2s ease-out',
      animationFillMode: 'both'
    },
    modalExit: {
      animation: 'fadeOut 0.15s ease-in',
      animationFillMode: 'both'
    },

    // Interactive feedback
    buttonPress: {
      animation: 'bounce 0.15s ease-in-out',
      animationFillMode: 'both'
    },
    buttonHover: {
      transition: `all ${designTokens.animations.durations.fast} ${designTokens.animations.easings.easeOut}`,
      transform: 'translateY(-1px)',
      boxShadow: designTokens.shadows.md
    },

    // Trading-specific animations
    priceIncrease: {
      animation: 'priceUp 0.5s ease-out',
      animationFillMode: 'both'
    },
    priceDecrease: {
      animation: 'priceDown 0.5s ease-out',
      animationFillMode: 'both'
    },
    orderFilled: {
      animation: 'glow 0.8s ease-in-out',
      animationFillMode: 'both'
    },
    chartPoint: {
      animation: 'chartHighlight 1s ease-in-out',
      animationFillMode: 'both'
    },

    // Error states
    errorShake: {
      animation: 'shake 0.5s ease-in-out',
      animationFillMode: 'both'
    },
    
    // Loading states
    loading: {
      animation: 'pulse 2s ease-in-out infinite',
      animationFillMode: 'both'
    },

    // Notification animations
    notificationSlide: {
      animation: 'slideUp 0.3s ease-out',
      animationFillMode: 'both'
    },

    // Accessibility: respect user preferences
    respectMotion: {
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none !important',
        transition: 'none !important'
      }
    }
  },

  // Utility functions
  utils: {
    // Create custom animation with timing
    createAnimation: (
      keyframeName: string, 
      duration: string = designTokens.animations.durations.normal,
      easing: string = designTokens.animations.easings.easeOut,
      delay: string = '0s',
      iterations: string | number = 1
    ) => ({
      animation: `${keyframeName} ${duration} ${easing} ${delay} ${iterations}`,
      animationFillMode: 'both'
    }),

    // Create transition with timing
    createTransition: (
      properties: string[] = ['all'],
      duration: string = designTokens.animations.durations.normal,
      easing: string = designTokens.animations.easings.easeOut,
      delay: string = '0s'
    ) => ({
      transition: properties.map(prop => 
        `${prop} ${duration} ${easing} ${delay}`
      ).join(', ')
    }),

    // Stagger animation for lists
    createStagger: (index: number, baseDelay: number = 50) => ({
      animationDelay: `${index * baseDelay}ms`
    }),

    // Performance optimization
    optimizeForAnimation: {
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden' as const,
      perspective: '1000px'
    }
  }
}

// React hook for managing animations
export function useAnimation() {
  const triggerAnimation = (
    element: HTMLElement | null,
    animationName: keyof typeof animations.presets,
    onComplete?: () => void
  ) => {
    if (!element) return

    const preset = animations.presets[animationName]
    Object.assign(element.style, preset)

    if (onComplete) {
      const handleAnimationEnd = () => {
        onComplete()
        element.removeEventListener('animationend', handleAnimationEnd)
      }
      element.addEventListener('animationend', handleAnimationEnd)
    }
  }

  const addAnimation = (
    element: HTMLElement | null,
    keyframeName: string,
    options?: {
      duration?: string
      easing?: string
      delay?: string
      iterations?: string | number
    }
  ) => {
    if (!element) return

    const animation = animations.utils.createAnimation(
      keyframeName,
      options?.duration,
      options?.easing,
      options?.delay,
      options?.iterations
    )

    Object.assign(element.style, animation)
  }

  return {
    triggerAnimation,
    addAnimation,
    keyframes: animations.keyframes,
    presets: animations.presets,
    utils: animations.utils
  }
}

// CSS-in-JS helper for styled components
export const animationStyles = {
  // Add all keyframes as CSS strings
  keyframesCss: Object.entries(animations.keyframes).map(([name, frames]) => `
    @keyframes ${name} {
      ${Object.entries(frames).map(([key, value]) => `
        ${key} {
          ${Object.entries(value).map(([prop, val]) => `${prop}: ${val};`).join(' ')}
        }
      `).join('')}
    }
  `).join(''),

  // Utility classes
  utilityClasses: {
    'animate-slide-in': animations.presets.pageEnter,
    'animate-fade-in': { animation: 'fadeIn 0.3s ease-out' },
    'animate-scale-in': animations.presets.modalEnter,
    'animate-bounce': animations.presets.buttonPress,
    'animate-pulse': animations.presets.loading,
    'animate-shake': animations.presets.errorShake,
    'animate-price-up': animations.presets.priceIncrease,
    'animate-price-down': animations.presets.priceDecrease,
    'animate-glow': animations.presets.orderFilled
  }
}