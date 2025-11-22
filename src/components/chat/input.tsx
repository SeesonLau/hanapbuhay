import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-input bg-transparent shadow-sm transition-colors",
          // Responsive height
          "h-10 mobile-L:h-10 tablet:h-11",
          // Responsive padding
          "px-2.5 mobile-L:px-3 tablet:px-4",
          "py-1.5 mobile-L:py-2 tablet:py-2",
          // Responsive text size
          "text-sm mobile-L:text-base",
          // File input styles
          "file:border-0 file:bg-transparent",
          "file:text-xs mobile-L:file:text-sm",
          "file:font-medium file:text-foreground",
          // Placeholder
          "placeholder:text-muted-foreground",
          "placeholder:text-xs mobile-L:placeholder:text-sm tablet:placeholder:text-base",
          // Focus states
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Touch optimization - prevent zoom on iOS
          "text-[16px] mobile-L:text-base",
          // Better tap target
          "min-h-[44px] mobile-L:min-h-[40px]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }