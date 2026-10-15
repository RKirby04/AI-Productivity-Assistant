import { createFileRoute, Link, useNavigate, ClientOnly } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { createThread, deleteThread, ensureThread, loadThreads, updateThread, type Thread } from "@/lib/threads";
import logo from "@/assets/logo-sweet-treats.png";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Bakery AI Chat — Sweet Treats" },
      { name: "description", content: "Chat with your bakery assistant about schedules, quotes, promotions and costs." },
      { property: "og:title", content: "Bakery AI Chat — Sweet Treats" },
      { property: "og:description", content: "A conversational assistant for everyday bakery questions." },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me plan tomorrow's baking schedule.",
  "Draft a quotation for a wedding cake.",
  "How can I promote unsold pastries?",
  "Help me estimate the cost of a batch of muffins.",
  "Create a weekend special promotion.",
];

function ChatPage() {
  const { threadId } = Route.useParams();
  return (
    <AppShell>
      <ClientOnly fallback={<div className="p-10 text-muted-foreground">Loading chat…</div>}>
        <ChatLayout threadId={threadId} />
      </ClientOnly>
    </AppShell>
  );
}

function ChatLayout({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>(() => loadThreads());
  useEffect(() => {
    const sync = () => setThreads(loadThreads());
    window.addEventListener("bakewise-threads", sync);
    return () => window.removeEventListener("bakewise-threads", sync);
  }, []);

  return (
    <div className="flex h-[calc(100vh-7rem)] md:h-screen">
      <div className="hidden w-60 shrink-0 flex-col border-r bg-card md:flex">
        <div className="p-3">
          <Button className="w-full" onClick={() => { const t = createThread(); navigate({ to: "/chat/$threadId", params: { threadId: t.id } }); }}>
            <Plus className="h-4 w-4" /> New chat
          </Button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
          {threads.map((t) => (
            <div key={t.id} className={`group flex items-center rounded-lg ${t.id === threadId ? "bg-accent" : "hover:bg-muted"}`}>
              <Link to="/chat/$threadId" params={{ threadId: t.id }} className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{t.title}</Link>
              <button
                aria-label="Delete chat"
                className="p-2 text-muted-foreground opacity-0 group-hover:opacity-100"
                onClick={() => {
                  deleteThread(t.id);
                  if (t.id === threadId) {
                    const next = loadThreads()[0] ?? createThread();
                    navigate({ to: "/chat/$threadId", params: { threadId: next.id } });
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <ChatWindow key={threadId} threadId={threadId} />
    </div>
  );
}

function ChatWindow({ threadId }: { threadId: string }) {
  const initial = useMemo(() => ensureThread(threadId).messages, [threadId]);
  const [error, setError] = useState("");
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat", body: { threadId } }),
    onError: (e) => setError(e.message.includes("429") ? "Too many requests — wait a moment." : e.message.includes("402") ? "AI credits are used up." : "Something went wrong. Please try again."),
    onFinish: ({ messages: all }) => updateThread(threadId, all),
  });
  const busy = status === "submitted" || status === "streaming";
  const [input, setInput] = useState("");

  useEffect(() => {
    if (messages.length) updateThread(threadId, messages);
  }, [messages.length, threadId]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    setError("");
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <img src={logo} alt="" width={72} height={72} className="h-18 w-18" />
              <h1 className="mt-4 text-2xl font-semibold">What can I help your bakery with?</h1>
              <div className="mt-6 flex max-w-xl flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border bg-card px-4 py-2 text-sm hover:bg-accent">{s}</button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message from={m.role} key={m.id}>
                <MessageContent>
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (m.role === "user" ? <span key={i}>{p.text}</span> : <MessageResponse key={i}>{p.text}</MessageResponse>) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && <Shimmer>Thinking…</Shimmer>}
          {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl p-4">
        <PromptInput onSubmit={(msg) => send(msg.text ?? "")}>
          <PromptInputTextarea autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about schedules, quotes, promotions…" />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!busy && !input.trim()} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
