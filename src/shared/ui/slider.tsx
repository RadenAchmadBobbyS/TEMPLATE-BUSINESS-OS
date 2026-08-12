"use client"
import * as React from "react"
import { cn } from "@/shared/utils"

const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input type="range" ref={ref} className={cn("w-full", className)} {...props} />
  )
)
Slider.displayName = "Slider"
export { Slider }
