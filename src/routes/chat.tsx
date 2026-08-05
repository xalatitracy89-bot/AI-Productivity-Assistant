import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { Card } from "@/components/ui/card";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { PageLayout } from "@/components/page-layout";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workwise AI" },
      { name: "description", content: "Chat with Workwise AI for workplace guidance." },
      { property: "og:title", content: "AI Chatbot — Workwise AI" },
      { property: "og:description", content: "Chat with Workwise AI for workplace guidance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

function ChatPage() {
  const {
    messages,
    sendMessage,
    status,
    error,
  } = useChat({
    id: "workwise-chat",
    transport: chatTransport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Chat failed. Please try again.");
    }
  }, [error]);

  return (
    <PageLayout
      title="AI Chatbot"
      description="Ask Workwise AI anything about workplace productivity, writing, planning, or research."
    >
      <div className="flex h-[calc(100vh-220px)] min-h-[420px] flex-col gap-4">
        <Card className="relative flex flex-1 overflow-hidden shadow-sm">
          <Conversation className="absolute inset-0 flex flex-col">
            <ConversationContent className="flex-1 p-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                  <p className="text-base font-medium text-foreground">Start a conversation</p>
                  <p>Ask for help drafting an email, planning tasks, or summarizing a topic.</p>
                </div>
              )}
              {messages.map((message) => {
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("");
                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent
                      className={
                        message.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "mr-auto"
                      }
                    >
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })}
              {isLoading && (
                <div className="py-2">
                  <Shimmer>Thinking...</Shimmer>
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </Card>

        <PromptInput
          onSubmit={async ({ text }) => {
            if (!text.trim()) return;
            await sendMessage({ text: text.trim() });
          }}
          className="rounded-xl border bg-card p-3 shadow-sm"
        >
          <PromptInputTextarea
            placeholder="Type your message..."
            className="min-h-[60px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <PromptInputFooter className="justify-end pt-2">
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </PageLayout>
  );
}

