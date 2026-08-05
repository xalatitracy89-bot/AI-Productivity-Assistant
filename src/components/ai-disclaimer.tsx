import { AlertTriangle } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="rounded-lg border border-border bg-accent/50 p-4 text-sm text-accent-foreground">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          AI-generated content may contain inaccuracies. Users should verify all responses before
          professional use. Do not enter confidential or sensitive information.
        </p>
      </div>
    </div>
  );
}
