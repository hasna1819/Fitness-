import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary/15 text-primary",
                secondary: "border-transparent bg-muted text-muted-foreground",
                success: "border-transparent bg-emerald-500/15 text-emerald-400",
                destructive: "border-transparent bg-red-500/15 text-red-400",
                warning: "border-transparent bg-amber-500/15 text-amber-400",
                info: "border-transparent bg-sky-500/15 text-sky-400",
                outline: "text-foreground border-border",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
