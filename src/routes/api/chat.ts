import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { streamBakery, BAKERY_SYSTEM } = await import("@/lib/ai.server");
        const body = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(body.messages)) return new Response("Invalid request", { status: 400 });
        const { result, getRunId } = streamBakery({
          instructions: `${BAKERY_SYSTEM}\nYou help with schedules, quotations, promotions, costing and customer messages.`,
          messages: await convertToModelMessages(body.messages),
          signal: request.signal,
          runId: request.headers.get("X-Lovable-AIG-Run-ID") ?? undefined,
        });
        const res = result.toUIMessageStreamResponse({ originalMessages: body.messages, sendReasoning: true });
        const id = getRunId();
        if (id) res.headers.set("X-Lovable-AIG-Run-ID", id);
        return res;
      },
    },
  },
});
