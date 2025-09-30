import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { HotkeyHelpModal } from '../hotkey-help-modal'
import { HOTKEY_CATEGORIES } from '@/hooks/useHotkeys'

const mockHotkeys = [
  {
    keys: ['b'],
    description: 'Quick buy order',
    action: vi.fn(),
    category: HOTKEY_CATEGORIES.TRADING,
  },
  {
    keys: ['s'],
    description: 'Quick sell order',
    action: vi.fn(),
    category: HOTKEY_CATEGORIES.TRADING,
  },
  {
    keys: ['mod+k'],
    description: 'Open command palette',
    action: vi.fn(),
    category: HOTKEY_CATEGORIES.NAVIGATION,
  },
  {
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    action: vi.fn(),
    category: HOTKEY_CATEGORIES.HELP,
  },
]

describe('HotkeyHelpModal', () => {
  it('renders when open', () => {
    render(
      <HotkeyHelpModal
        isOpen={true}
        onClose={vi.fn()}
        hotkeys={mockHotkeys}
      />
    )
    
    expect(screen.getByText('⌨️ Keyboard Shortcuts')).toBeInTheDocument()
    expect(screen.getByText('4 shortcuts')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <HotkeyHelpModal
        isOpen={false}
        onClose={vi.fn()}
        hotkeys={mockHotkeys}
      />
    )
    
    expect(screen.queryByText('⌨️ Keyboard Shortcuts')).not.toBeInTheDocument()
  })

  it('displays hotkeys grouped by category', () => {
    render(
      <HotkeyHelpModal
        isOpen={true}
        onClose={vi.fn()}
        hotkeys={mockHotkeys}
      />
    )
    
    expect(screen.getByText('Trading')).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
    expect(screen.getByText('Help')).toBeInTheDocument()
    
    expect(screen.getByText('Quick buy order')).toBeInTheDocument()
    expect(screen.getByText('Quick sell order')).toBeInTheDocument()
    expect(screen.getByText('Open command palette')).toBeInTheDocument()
    expect(screen.getByText('Show keyboard shortcuts')).toBeInTheDocument()
  })

  it('filters hotkeys based on search term', async () => {
    render(
      <HotkeyHelpModal
        isOpen={true}
        onClose={vi.fn()}
        hotkeys={mockHotkeys}
      />
    )
    
    const searchInput = screen.getByPlaceholderText('Search shortcuts...')
    
    fireEvent.change(searchInput, { target: { value: 'buy' } })
    
    expect(screen.getByText('Quick buy order')).toBeInTheDocument()
    expect(screen.queryByText('Quick sell order')).not.toBeInTheDocument()
    expect(screen.queryByText('Open command palette')).not.toBeInTheDocument()
  })

  it('shows no results message when search yields no matches', async () => {
    render(
      <HotkeyHelpModal
        isOpen={true}
        onClose={vi.fn()}
        hotkeys={mockHotkeys}
      />
    )
    
    const searchInput = screen.getByPlaceholderText('Search shortcuts...')
    
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    
    expect(screen.getByText('No shortcuts found for "nonexistent"')).toBeInTheDocument()
    expect(screen.getByText('Try searching for "trade", "buy", or "help"')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = vi.fn()
    
    render(
      <HotkeyHelpModal
        isOpen={true}
        onClose={onCloseMock}
        hotkeys={mockHotkeys}
      />
    )
    
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[0]) // Click the main close button
    
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('displays formatted keyboard shortcuts', () => {
    render(
      <HotkeyHelpModal
        isOpen={true}
        onClose={vi.fn()}
        hotkeys={mockHotkeys}
      />
    )
    
    // Check for formatted keys (these will appear as kbd elements)
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('S')).toBeInTheDocument()
    
    // Check for question mark in keyboard shortcuts
    const questionMarks = screen.getAllByText('?')
    expect(questionMarks.length).toBeGreaterThan(0)
  })

  it('filters by category name', async () => {
    render(
      <HotkeyHelpModal
        isOpen={true}
        onClose={vi.fn()}
        hotkeys={mockHotkeys}
      />
    )
    
    const searchInput = screen.getByPlaceholderText('Search shortcuts...')
    
    fireEvent.change(searchInput, { target: { value: 'trading' } })
    
    expect(screen.getByText('Trading')).toBeInTheDocument()
    expect(screen.getByText('Quick buy order')).toBeInTheDocument()
    expect(screen.getByText('Quick sell order')).toBeInTheDocument()
    expect(screen.queryByText('Navigation')).not.toBeInTheDocument()
  })

  it('filters by key combination', async () => {
    render(
      <HotkeyHelpModal
        isOpen={true}
        onClose={vi.fn()}
        hotkeys={mockHotkeys}
      />
    )
    
    const searchInput = screen.getByPlaceholderText('Search shortcuts...')
    
    fireEvent.change(searchInput, { target: { value: 'mod+k' } })
    
    expect(screen.getByText('Open command palette')).toBeInTheDocument()
    expect(screen.queryByText('Quick buy order')).not.toBeInTheDocument()
  })
})