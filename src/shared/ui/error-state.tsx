import { AlertCircle, RefreshCcw } from "lucide-react"
import { cn } from "@/shared/utils"
import { Button } from "@/shared/ui/button"

export function ErrorState({ 
  className, 
  title = "Something went wrong", 
  error, 
  retryAction 
}: { 
  className?: string; 
  title?: string; 
  error?: Error | string;
  retryAction?: () => void;
}) {
  const errorMessage = typeof error === 'string' ? error : error?.message;
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-destructive/5 border-destructive/20", className)}>
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-lg font-semibold tracking-tight text-destructive">{title}</h3>
      {errorMessage && <p className="text-sm text-destructive/80 mt-2 mb-6 max-w-sm">{errorMessage}</p>}
      {retryAction && (
        <Button variant="outline" size="sm" onClick={retryAction} className="border-destructive/20 text-destructive hover:bg-destructive/10">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
