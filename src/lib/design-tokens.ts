// Design Tokens for BullSheet Trading Platform
// Following atomic design principles and ensuring accessibility

export const designTokens = {
  // Color System
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#f0f7ff',
      100: '#e0efff',
      200: '#b9dfff',
      300: '#7cc8ff',
      400: '#36b0ff',
      500: '#0891b2', // paper-blue
      600: '#0e7490',
      700: '#155e75',
      800: '#164e63',
      900: '#0c4a6e'
    },
    
    // Success/Finance Colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#4CAF50', // finance-green
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b'
    },
    
    // Danger/Loss Colors
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#F44336', // coral-red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    },
    
    // Warning Colors
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    
    // Neutral/Paper Colors
    neutral: {
      0: '#FDFCF7', // paper
      50: '#F8F7F2',
      100: '#F0EEEA',
      200: '#E3EAF2', // grid-blue
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#2E2E2E', // graphite
      900: '#1F2937',
      950: '#111827'
    },
    
    // Accent Colors
    accent: {
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#9D7AEA', // muted-lilac
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95'
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#758BFD', // paper-blue variant
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
      }
    }
  },
  
  // Typography System
  typography: {
    fontFamilies: {
      handwrite: ['Comic Sans MS', 'Marker Felt', 'cursive'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem'  // 60px
    },
    
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },
    
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    },
    
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  
  // Spacing System (based on 4px grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem'     // 256px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    paper: '0 4px 6px -1px rgba(118, 139, 253, 0.1), 0 2px 4px -1px rgba(118, 139, 253, 0.06)'
  },
  
  // Animation & Transitions
  animations: {
    durations: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms'
    },
    
    easings: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-Index Scale
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800'
  }
} as const

// Theme Variants
export const themes = {
  light: {
    background: designTokens.colors.neutral[0], // paper
    foreground: designTokens.colors.neutral[800], // graphite
    card: designTokens.colors.neutral[0],
    cardForeground: designTokens.colors.neutral[800],
    popover: designTokens.colors.neutral[0],
    popoverForeground: designTokens.colors.neutral[800],
    primary: designTokens.colors.primary[500],
    primaryForeground: designTokens.colors.neutral[0],
    secondary: designTokens.colors.neutral[100],
    secondaryForeground: designTokens.colors.neutral[800],
    muted: designTokens.colors.accent.purple[100],
    mutedForeground: designTokens.colors.neutral[500],
    accent: designTokens.colors.accent.purple[100],
    accentForeground: designTokens.colors.neutral[800],
    destructive: designTokens.colors.danger[500],
    destructiveForeground: designTokens.colors.neutral[0],
    border: designTokens.colors.neutral[200],
    input: designTokens.colors.neutral[200],
    ring: designTokens.colors.primary[500],
    success: designTokens.colors.success[500],
    warning: designTokens.colors.warning[500]
  },
  
  dark: {
    background: designTokens.colors.neutral[950],
    foreground: designTokens.colors.neutral[50],
    card: designTokens.colors.neutral[900],
    cardForeground: designTokens.colors.neutral[50],
    popover: designTokens.colors.neutral[900],
    popoverForeground: designTokens.colors.neutral[50],
    primary: designTokens.colors.primary[400],
    primaryForeground: designTokens.colors.neutral[950],
    secondary: designTokens.colors.neutral[800],
    secondaryForeground: designTokens.colors.neutral[50],
    muted: designTokens.colors.neutral[800],
    mutedForeground: designTokens.colors.neutral[400],
    accent: designTokens.colors.neutral[800],
    accentForeground: designTokens.colors.neutral[50],
    destructive: designTokens.colors.danger[400],
    destructiveForeground: designTokens.colors.neutral[50],
    border: designTokens.colors.neutral[700],
    input: designTokens.colors.neutral[700],
    ring: designTokens.colors.primary[400],
    success: designTokens.colors.success[400],
    warning: designTokens.colors.warning[400]
  },
  
  highContrast: {
    background: '#000000',
    foreground: '#ffffff',
    card: '#000000',
    cardForeground: '#ffffff',
    popover: '#000000',
    popoverForeground: '#ffffff',
    primary: '#ffffff',
    primaryForeground: '#000000',
    secondary: '#333333',
    secondaryForeground: '#ffffff',
    muted: '#333333',
    mutedForeground: '#cccccc',
    accent: '#333333',
    accentForeground: '#ffffff',
    destructive: '#ff0000',
    destructiveForeground: '#ffffff',
    border: '#666666',
    input: '#333333',
    ring: '#ffffff',
    success: '#00ff00',
    warning: '#ffff00'
  }
} as const

export type Theme = keyof typeof themes
export type ThemeConfig = typeof themes[Theme]