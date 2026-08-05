import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  text?: string;
  className?: string;
}

export function LoadingIndicator({ text = "AI is generating...", className }: LoadingIndicatorProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>{text}</span>
      </div>
    </div>
  );
}
