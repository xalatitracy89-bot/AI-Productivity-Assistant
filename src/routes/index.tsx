import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  Settings,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/page-layout";

const features = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails in any tone.",
    icon: Mail,
    href: "/email",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into summaries, decisions, and action items.",
    icon: FileText,
    href: "/meeting-notes",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  {
    title: "AI Task Planner",
    description: "Prioritize tasks and build a daily schedule.",
    icon: ListTodo,
    href: "/task-planner",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  },
  {
    title: "AI Research Assistant",
    description: "Get summaries, insights, and recommendations on any topic.",
    icon: Search,
    href: "/research",
    color: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  },
  {
    title: "AI Chatbot",
    description: "Ask anything and get instant workplace guidance.",
    icon: MessageSquare,
    href: "/chat",
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400",
  },
  {
    title: "Settings",
    description: "Manage preferences and app information.",
    icon: Settings,
    href: "/settings",
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workwise AI" },
      { name: "description", content: "Workwise AI dashboard with AI-powered workplace productivity tools." },
      { property: "og:title", content: "Dashboard — Workwise AI" },
      { property: "og:description", content: "Workwise AI dashboard with AI-powered workplace productivity tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageLayout
      title="Dashboard"
      description="Choose a tool to boost your workplace productivity."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.href} className="group focus:outline-none">
            <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <CardTitle className="mt-3 text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-xs font-medium text-primary">Open tool</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
