import React from 'react'
import { LucideProps } from 'lucide-react'

// Custom SVG icons for trading-specific elements
interface TradingIconProps extends LucideProps {
  'aria-label'?: string
}

export function BullIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Bull market indicator"}
      {...props}
    >
      <path d="M8 12l4-4 4 4" />
      <path d="M8 16l4-4 4 4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

export function BearIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Bear market indicator"}
      {...props}
    >
      <path d="M16 12l-4 4-4-4" />
      <path d="M16 8l-4 4-4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

export function CandlestickIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Candlestick chart"}
      {...props}
    >
      <line x1="6" y1="3" x2="6" y2="21" />
      <rect x="4" y="8" width="4" height="6" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <rect x="10" y="10" width="4" height="8" />
      <line x1="18" y1="4" x2="18" y2="20" />
      <rect x="16" y="6" width="4" height="4" />
    </svg>
  )
}

export function PortfolioIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Portfolio"}
      {...props}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M6 8l4 4 4-4 4 4" />
    </svg>
  )
}

export function OrderBookIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Order book"}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="13" y2="12" />
      <line x1="7" y1="16" x2="15" y2="16" />
      <circle cx="18" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

export function StopLossIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Stop loss order"}
      {...props}
    >
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

export function ProfitTargetIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Profit target"}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2 2 4-4" />
      <path d="M12 6v6l3 3" />
    </svg>
  )
}

export function VolatilityIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Market volatility"}
      {...props}
    >
      <path d="M2 12L4 8L6 14L8 6L10 16L12 4L14 18L16 2L18 20L20 10L22 12" />
    </svg>
  )
}

export function SpreadIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Bid-ask spread"}
      {...props}
    >
      <rect x="3" y="8" width="6" height="8" />
      <rect x="15" y="6" width="6" height="12" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </svg>
  )
}

export function MarketDepthIcon({ className, 'aria-label': ariaLabel, ...props }: TradingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel || "Market depth"}
      {...props}
    >
      <rect x="2" y="16" width="4" height="6" />
      <rect x="6" y="12" width="4" height="10" />
      <rect x="10" y="8" width="4" height="14" />
      <rect x="14" y="12" width="4" height="10" />
      <rect x="18" y="16" width="4" height="6" />
    </svg>
  )
}

// Accessibility-enhanced icon wrapper
interface AccessibleIconProps {
  children: React.ReactNode
  label: string
  description?: string
  className?: string
}

export function AccessibleIcon({ 
  children, 
  label, 
  description, 
  className
}: AccessibleIconProps) {
  const iconId = React.useId()
  const descId = React.useId()

  return (
    <span 
      className={className}
      role="img" 
      aria-labelledby={iconId}
      aria-describedby={description ? descId : undefined}
    >
      {children}
      <span id={iconId} className="sr-only">{label}</span>
      {description && (
        <span id={descId} className="sr-only">{description}</span>
      )}
    </span>
  )
}

// Icon registry for dynamic loading
export const tradingIcons = {
  bull: BullIcon,
  bear: BearIcon,
  candlestick: CandlestickIcon,
  portfolio: PortfolioIcon,
  orderBook: OrderBookIcon,
  stopLoss: StopLossIcon,
  profitTarget: ProfitTargetIcon,
  volatility: VolatilityIcon,
  spread: SpreadIcon,
  marketDepth: MarketDepthIcon
} as const

export type TradingIconName = keyof typeof tradingIcons