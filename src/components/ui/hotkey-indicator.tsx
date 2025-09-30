import { formatHotkey } from '@/hooks/useHotkeys'

interface HotkeyIndicatorProps {
  keys: string[]
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function HotkeyIndicator({ keys, className = '', size = 'sm' }: HotkeyIndicatorProps) {
  const sizeClasses = {
    sm: 'text-xs px-1 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  }
  
  return (
    <kbd className={`
      inline-flex items-center gap-1 font-mono bg-muted/50 border border-border rounded shadow-sm
      ${sizeClasses[size]} ${className}
    `}>
      {formatHotkey(keys)}
    </kbd>
  )
}