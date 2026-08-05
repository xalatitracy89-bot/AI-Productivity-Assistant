import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const DEFAULT_MODEL = "google/gemini-2.5-flash";

function getApiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return key;
}

async function generateResponse(gateway: ReturnType<typeof createLovableAiGatewayProvider>, prompt: string) {
  try {
    const result = await generateText({
      model: gateway(DEFAULT_MODEL),
      messages: [
        { role: "system", content: "You are a helpful AI workplace productivity assistant. Be concise, professional, and actionable." },
        { role: "user", content: prompt },
      ],
    });
    return result.text;
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    throw new Error(message);
  }
}

const GenerateEmailInput = z.object({
  recipient: z.string().trim().min(1, "Recipient is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  purpose: z.string().trim().min(1, "Email purpose is required"),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateEmailInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const gateway = createLovableAiGatewayProvider(getApiKey());
      const prompt = `Write a ${data.tone.toLowerCase()} professional email to ${data.recipient}.\nSubject: ${data.subject}\nPurpose: ${data.purpose}\n\nOutput only the email body and subject line, ready to send. Do not include explanations.`;

      const text = await generateResponse(gateway, prompt);
      return { text };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate email";
      return { text: `Error: ${message}` };
    }
  });

const SummarizeMeetingNotesInput = z.object({
  notes: z.string().trim().min(1, "Meeting notes are required"),
});

export const summarizeMeetingNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummarizeMeetingNotesInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(getApiKey());
    const prompt = `Summarize the following meeting notes. Structure the output with these sections:\n\n## Summary\n## Key Decisions\n## Action Items\n## Deadlines\n\nMeeting notes:\n${data.notes}`;

    const text = await generateResponse(gateway, prompt);
    return { text };
  });

const PlanTasksInput = z.object({
  tasks: z.string().trim().min(1, "At least one task is required"),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanTasksInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(getApiKey());
    const prompt = `Prioritize the following tasks and create a daily schedule.\n\nFor each task, assign a priority: High, Medium, or Low. Then estimate a time block for it and suggest an order for the day. Structure the output as:\n\n## Prioritized Tasks\n- [Priority] Task name - estimated time\n\n## Suggested Daily Schedule\n- Time block: Task\n\nTasks:\n${data.tasks}`;

    const text = await generateResponse(gateway, prompt);
    return { text };
  });

const ResearchTopicInput = z.object({
  topic: z.string().trim().min(1, "Research topic is required"),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchTopicInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(getApiKey());
    const prompt = `Research the following topic and provide a concise workplace-ready brief. Structure the output as:\n\n## Summary\n## Key Insights\n## Recommendations\n\nTopic: ${data.topic}`;

    const text = await generateResponse(gateway, prompt);
    return { text };
  });
