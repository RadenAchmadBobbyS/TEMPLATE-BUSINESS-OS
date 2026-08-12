import { Loader2 } from "lucide-react"
import { cn } from "@/shared/utils"

export function LoadingState({ className, message = "Loading..." }: { className?: string; message?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-500", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
