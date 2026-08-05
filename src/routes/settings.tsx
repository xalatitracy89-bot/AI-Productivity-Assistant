import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageLayout } from "@/components/page-layout";
import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workwise AI" },
      { name: "description", content: "Workwise AI settings and information." },
      { property: "og:title", content: "Settings — Workwise AI" },
      { property: "og:description", content: "Workwise AI settings and information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <PageLayout title="Settings" description="App preferences and information.">
      <div className="grid max-w-2xl gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact">Compact mode</Label>
                <p className="text-sm text-muted-foreground">Reduce spacing across the interface.</p>
              </div>
              <Switch id="compact" disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">AI notifications</Label>
                <p className="text-sm text-muted-foreground">Show toast notifications when AI finishes.</p>
              </div>
              <Switch id="notifications" defaultChecked disabled />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Information about Workwise AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Workwise AI</strong> is a workplace productivity assistant
              powered by artificial intelligence. It helps you draft emails, summarize meetings, plan tasks, and
              research topics faster.
            </p>
            <p>Version 1.0.0</p>
          </CardContent>
        </Card>

        <AiDisclaimer />
      </div>
    </PageLayout>
  );
}
