import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { planTasks } from "@/lib/ai.functions";
import { PageLayout } from "@/components/page-layout";
import { LoadingIndicator } from "@/components/loading-indicator";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workwise AI" },
      { name: "description", content: "Prioritize tasks and generate a daily schedule with AI." },
      { property: "og:title", content: "AI Task Planner — Workwise AI" },
      { property: "og:description", content: "Prioritize tasks and generate a daily schedule with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TaskPlanner,
});

function TaskPlanner() {
  const [tasks, setTasks] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = useServerFn(planTasks);

  const handlePlan = async () => {
    if (!tasks.trim()) {
      setError("Please enter at least one task.");
      toast.error("Please enter at least one task.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await plan({ data: { tasks } });
      setOutput(result.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to plan tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTasks("");
    setOutput("");
    setError(null);
  };

  return (
    <PageLayout
      title="AI Task Planner"
      description="List your tasks and AI will prioritize them and suggest a daily schedule."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="tasks">Your tasks</Label>
              <Textarea
                id="tasks"
                placeholder={`One task per line, e.g.:\nPrepare quarterly report\nEmail the design team\nReview candidate resumes`}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={16}
                className="min-h-[360px] resize-y"
                aria-invalid={!!error}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handlePlan} disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Plan
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {isLoading && <LoadingIndicator text="AI is building your schedule..." />}
          <Card className="flex-1 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <Label htmlFor="output">Prioritized plan</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output}
                  className="h-8 gap-1"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <Textarea
                id="output"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Prioritized tasks and a daily schedule will appear here..."
                rows={16}
                className="min-h-[360px] resize-y"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
