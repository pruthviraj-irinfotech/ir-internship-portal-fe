import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 active:translate-y-0.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-primary-foreground/50 shadow-[3px_3px_0px_hsl(var(--primary-foreground)/0.5)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive-foreground/50 shadow-[3px_3px_0px_hsl(var(--destructive-foreground)/0.5)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-[3px_3px_0px_hsl(var(--accent))] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary-foreground/50 shadow-[3px_3px_0px_hsl(var(--secondary-foreground)/0.5)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-10 px-3",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
