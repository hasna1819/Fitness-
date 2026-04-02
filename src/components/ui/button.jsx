import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg",
                destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
                outline: "border border-border bg-transparent text-foreground hover:bg-muted hover:text-accent-foreground",
                secondary: "bg-muted text-foreground shadow-sm hover:bg-muted/80",
                ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                gradient: "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 rounded-full px-3 text-xs",
                lg: "h-12 rounded-full px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(
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
