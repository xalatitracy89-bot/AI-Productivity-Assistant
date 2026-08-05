import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { researchTopic } from "@/lib/ai.functions";
import { PageLayout } from "@/components/page-layout";
import { LoadingIndicator } from "@/components/loading-indicator";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workwise AI" },
      { name: "description", content: "Research any topic and get summaries, insights, and recommendations." },
      { property: "og:title", content: "AI Research Assistant — Workwise AI" },
      { property: "og:description", content: "Research any topic and get summaries, insights, and recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearchAssistant,
});

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const research = useServerFn(researchTopic);

  const handleResearch = async () => {
    if (!topic.trim()) {
      setError("Please enter a research topic.");
      toast.error("Please enter a research topic.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await research({ data: { topic } });
      setOutput(result.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to research topic.");
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
    setTopic("");
    setOutput("");
    setError(null);
  };

  return (
    <PageLayout
      title="AI Research Assistant"
      description="Enter a topic and get a concise research brief with insights and recommendations."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="topic">Research topic</Label>
              <Input
                id="topic"
                placeholder="e.g. Remote work productivity trends in 2026"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                aria-invalid={!!error}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleResearch} disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                Research
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {isLoading && <LoadingIndicator text="AI is researching your topic..." />}
          <Card className="flex-1 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <Label htmlFor="output">Research brief</Label>
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
                placeholder="Summary, key insights, and recommendations will appear here..."
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
