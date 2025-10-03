import { describe, it, expect, vi } from 'vitest'
import { render, screen, createUser } from '@/test/utils'
import { Button } from '../button'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-paper-blue')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="success">Success</Button>)
    
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-finance-green')

    rerender(<Button variant="destructive">Danger</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-coral-red')

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border-grid-blue')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-9')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-11')
  })

  it('handles click events', async () => {
    const user = createUser()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none')
  })

  it('applies hover and transform classes', () => {
    render(<Button>Hover me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:scale-105', 'active:scale-95')
  })

  it('supports custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})