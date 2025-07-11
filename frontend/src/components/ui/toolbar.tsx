import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toolbarVariants = cva(
  "flex items-center gap-1 rounded-md border bg-background p-1",
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToolbarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toolbarVariants> {}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(toolbarVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Toolbar.displayName = "Toolbar"

export { Toolbar, toolbarVariants }
