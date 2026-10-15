import { createFileRoute, Link, useNavigate, ClientOnly } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, MessageSquare, Copy, Check, History, AlertTriangle, CalendarClock, Mail, Coins, ClipboardList, Recycle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  { text: "Help me plan today's baking schedule.", icon: CalendarClock },
  { text: "Write a friendly message to a customer.", icon: Mail },
  { text: "Help me calculate the cost of my cupcakes.", icon: Coins },
  { text: "Summarise this customer's order.", icon: ClipboardList },
  { text: "How can I reduce ingredient waste?", icon: Recycle },
];

function ChatPage() {
  const { threadId } = Route.useParams();
  return (
    <ClientOnly fallback={<AppShell><div className="p-10 text-muted-foreground">Loading chat…</div></AppShell>}>
      <ChatLayout threadId={threadId} />
    </ClientOnly>
  );
}

function ThreadList({ threads, threadId, onPick }: { threads: Thread[]; threadId: string; onPick?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Button size="lg" className="h-11 w-full rounded-xl" onClick={() => { const t = createThread(); onPick?.(); navigate({ to: "/chat/$threadId", params: { threadId: t.id } }); }}>
          <Plus className="h-4 w-4" /> New chat
        </Button>
      </div>
      <p className="px-4 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Conversations</p>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {threads.map((t) => (
          <div key={t.id} className={`group flex items-center rounded-xl transition-colors ${t.id === threadId ? "bg-accent text-accent-foreground" : "hover:bg-secondary"}`}>
            <Link to="/chat/$threadId" params={{ threadId: t.id }} onClick={onPick} className="flex min-h-10 min-w-0 flex-1 items-center gap-2 truncate px-3 text-sm">
              <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" /><span className="truncate">{t.title}</span>
            </Link>
            <button
              aria-label={`Delete chat ${t.title}`}
              className="p-2.5 text-muted-foreground opacity-60 hover:text-destructive focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
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
      <p className="border-t px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">Chats are saved in this browser only — not to an online account.</p>
    </div>
  );
}

function ChatLayout({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>(() => loadThreads());
  useEffect(() => {
    const sync = () => setThreads(loadThreads());
    window.addEventListener("bakewise-threads", sync);
    return () => window.removeEventListener("bakewise-threads", sync);
  }, []);

  return (
    <AppShell
      actions={
        <>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl md:hidden" aria-label="Show conversations"><History className="h-4 w-4" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Conversations</SheetTitle>
              <div className="h-full pt-8"><ThreadList threads={threads} threadId={threadId} onPick={() => setOpen(false)} /></div>
            </SheetContent>
          </Sheet>
          <Button size="sm" className="rounded-xl md:hidden" onClick={() => { const t = createThread(); navigate({ to: "/chat/$threadId", params: { threadId: t.id } }); }}>
            <Plus className="h-4 w-4" /> New
          </Button>
        </>
      }
    >
      <div className="flex h-[calc(100dvh-4rem)]">
        <div className="hidden w-64 shrink-0 border-r bg-sidebar md:block">
          <ThreadList threads={threads} threadId={threadId} />
        </div>
        <ChatWindow key={threadId} threadId={threadId} />
      </div>
    </AppShell>
  );
}

function CopyMsg({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { try { await navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1500); } catch { /* blocked */ } }}
      className="mt-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-primary"
    >
      {c ? <Check className="h-3 w-3 text-sage-foreground" /> : <Copy className="h-3 w-3" />} {c ? "Copied" : "Copy"}
    </button>
  );
}

function ChatWindow({ threadId }: { threadId: string }) {
  const initial = useMemo(() => ensureThread(threadId).messages, [threadId]);
  const [error, setError] = useState("");
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat", body: { threadId } }),
    onError: (e) => setError(e.message.includes("429") ? "Too many requests — wait a moment and try again." : e.message.includes("402") ? "AI credits are used up." : "Something went wrong. Please try again."),
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
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center md:py-14">
              <img src={logo} alt="" width={80} height={80} className="h-20 w-20" />
              <h1 className="mt-4 text-2xl font-semibold text-primary md:text-3xl">Hello! I'm your Sweet Treats assistant.</h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">Ask me about schedules, customer messages, recipe costs, orders or reducing waste.</p>
              <div className="mt-8 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map(({ text, icon: Icon }) => (
                  <button key={text} onClick={() => send(text)} className="flex min-h-12 items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm shadow-card transition hover:border-terracotta/60 hover:shadow-lift">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></span>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const full = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              return (
                <Message from={m.role} key={m.id}>
                  <MessageContent>
                    {m.parts.map((p, i) =>
                      p.type === "text" ? (m.role === "user" ? <span key={i} className="whitespace-pre-wrap">{p.text}</span> : <MessageResponse key={i}>{p.text}</MessageResponse>) : null,
                    )}
                  </MessageContent>
                  {m.role === "assistant" && full && !(busy && m.id === messages[messages.length - 1]?.id) && <CopyMsg text={full} />}
                </Message>
              );
            })
          )}
          {status === "submitted" && (
            <div className="flex items-center gap-3 text-sm">
              <img src={logo} alt="" width={28} height={28} className="h-7 w-7" />
              <Shimmer>Thinking…</Shimmer>
            </div>
          )}
          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl px-3 pb-3 pt-2 md:px-6 md:pb-5">
        <PromptInput onSubmit={(msg) => send(msg.text ?? "")} className="rounded-2xl border bg-card shadow-card">
          <PromptInputTextarea autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about schedules, quotes, costs…" aria-label="Message" />
          <PromptInputFooter className="justify-between">
            <span className="pl-2 text-[11px] text-muted-foreground">Enter to send · Shift+Enter for a new line</span>
            <PromptInputSubmit status={status} disabled={!busy && !input.trim()} onStop={stop} aria-label="Send message" />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
