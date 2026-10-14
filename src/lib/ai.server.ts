import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const RUN = "X-Lovable-AIG-Run-ID";
const BASE = "https://ai.gateway.lovable.dev/v1";
export const MODEL = "openai/gpt-6-astra";

function runIdFetch(initial?: string) {
  let runId = initial?.trim() || undefined;
  return {
    getRunId: () => runId,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN)) headers.set(RUN, runId);
      const res = await fetch(input, { ...init, headers });
      runId ??= res.headers.get(RUN)?.trim() || undefined;
      return res;
    },
  };
}

export function streamBakery(opts: {
  messages: ModelMessage[];
  instructions: string;
  signal?: AbortSignal;
  runId?: string;
}) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured (missing LOVABLE_API_KEY).");
  const rf = runIdFetch(opts.runId);
  const provider = createOpenAI({
    baseURL: BASE,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: rf.fetch,
  });
  const result = streamText({
    model: provider.responses(MODEL),
    instructions: opts.instructions,
    messages: opts.messages,
    abortSignal: opts.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return { result, getRunId: rf.getRunId };
}

export const BAKERY_SYSTEM = `You are BakeWise AI, a practical assistant for small bakery owners.
Be concise, warm and specific. Use markdown with headings, bullet lists and tables where helpful.
Never invent prices, stock levels or sales figures: if the owner hasn't given a number, state your assumption clearly and flag it as missing information.`;
