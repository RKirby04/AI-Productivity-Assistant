import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { createThread, loadThreads } from "@/lib/threads";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "Bakery AI Chat — Sweet Treats" },
      { name: "description", content: "Ask your bakery assistant about schedules, quotes, promotions and costs." },
      { property: "og:title", content: "Bakery AI Chat — Sweet Treats" },
      { property: "og:description", content: "A conversational assistant for everyday bakery questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const t = loadThreads()[0] ?? createThread();
    navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
  }, [navigate]);
  return <AppShell><div className="p-10 text-muted-foreground">Opening chat…</div></AppShell>;
}
