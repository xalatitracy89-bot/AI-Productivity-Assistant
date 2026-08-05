import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { generateEmail } from "@/lib/ai.functions";
import { PageLayout } from "@/components/page-layout";
import { LoadingIndicator } from "@/components/loading-indicator";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workwise AI" },
      { name: "description", content: "Generate professional emails with AI." },
      { property: "og:title", content: "Smart Email Generator — Workwise AI" },
      { property: "og:description", content: "Generate professional emails with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Persuasive">("Formal");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const generate = useServerFn(generateEmail);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!recipient.trim()) next["recipient"] = "Recipient is required";
    if (!subject.trim()) next["subject"] = "Subject is required";
    if (!purpose.trim()) next["purpose"] = "Email purpose is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await generate({
        data: { recipient, subject, purpose, tone },
      });
      if (!result.text) {
        setErrorMsg("AI returned an empty response. Please try again.");
      } else {
        setOutput(result.text);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to generate email.";
      setErrorMsg(msg);
      toast.error(msg);
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
    setRecipient("");
    setSubject("");
    setPurpose("");
    setTone("Formal");
    setOutput("");
    setErrors({});
  };

  return (
    <PageLayout
      title="Smart Email Generator"
      description="Fill in the details and let AI draft a polished email for you."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Jane Smith, Hiring Manager"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                aria-invalid={!!errors["recipient"]}
              />
              {errors["recipient"] && <p className="text-xs text-destructive">{errors["recipient"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Project Update - Q3 Roadmap"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                aria-invalid={!!errors["subject"]}
              />
              {errors["subject"] && <p className="text-xs text-destructive">{errors["subject"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Describe what you want to communicate..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={4}
                aria-invalid={!!errors["purpose"]}
              />
              {errors["purpose"] && <p className="text-xs text-destructive">{errors["purpose"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={handleGenerate} disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {isLoading && <LoadingIndicator text="AI is drafting your email..." />}
          <Card className="flex-1 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <Label htmlFor="output">Email draft</Label>
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
                placeholder="Your generated email will appear here..."
                rows={14}
                className="min-h-[300px] resize-y"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
