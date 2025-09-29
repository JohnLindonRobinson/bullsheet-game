import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-paper-blue text-paper hover:bg-paper-blue/90",
        destructive: "bg-coral-red text-paper hover:bg-coral-red/90",
        outline: "border border-grid-blue bg-paper hover:bg-grid-blue hover:text-graphite",
        secondary: "bg-muted-lilac text-graphite hover:bg-muted-lilac/80",
        ghost: "hover:bg-grid-blue hover:text-graphite",
        link: "text-paper-blue underline-offset-4 hover:underline",
        success: "bg-finance-green text-paper hover:bg-finance-green/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        md: "rounded-md",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }