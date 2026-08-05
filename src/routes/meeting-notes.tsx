import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { summarizeMeetingNotes } from "@/lib/ai.functions";
import { PageLayout } from "@/components/page-layout";
import { LoadingIndicator } from "@/components/loading-indicator";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workwise AI" },
      { name: "description", content: "Summarize meeting notes into key decisions and action items." },
      { property: "og:title", content: "Meeting Notes Summarizer — Workwise AI" },
      { property: "og:description", content: "Summarize meeting notes into key decisions and action items." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MeetingNotesSummarizer,
});

function MeetingNotesSummarizer() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = useServerFn(summarizeMeetingNotes);

  const handleSummarize = async () => {
    if (!notes.trim()) {
      setError("Please paste meeting notes first.");
      toast.error("Please paste meeting notes first.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await summarize({ data: { notes } });
      setOutput(result.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to summarize notes.");
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
    setNotes("");
    setOutput("");
    setError(null);
  };

  return (
    <PageLayout
      title="Meeting Notes Summarizer"
      description="Paste raw notes and get a structured summary with decisions, action items, and deadlines."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting notes</Label>
              <Textarea
                id="notes"
                placeholder="Paste your meeting notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={16}
                className="min-h-[360px] resize-y"
                aria-invalid={!!error}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSummarize} disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                Summarize
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {isLoading && <LoadingIndicator text="AI is summarizing your notes..." />}
          <Card className="flex-1 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <Label htmlFor="output">Structured summary</Label>
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
                placeholder="Summary, key decisions, action items, and deadlines will appear here..."
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
