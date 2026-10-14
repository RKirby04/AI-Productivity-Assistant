import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { runBakeryTool } from "@/lib/tools.functions";
import { AppShell } from "./AppShell";

export function ToolPage(props: {
  tool: "email" | "orders" | "planner" | "research";
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
  buildInput: (form: FormData) => string;
}) {
  const run = useServerFn(runBakeryTool);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await run({ data: { tool: props.tool, input: props.buildInput(new FormData(e.currentTarget)) } });
      if (res.ok) setText(res.text);
      else setError(res.error);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{props.badge}</span>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{props.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{props.description}</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-card">
            {props.children}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Working…" : "Generate with AI"}
            </Button>
          </form>
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Result</h2>
              {text && (
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
            {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            {loading ? (
              <Shimmer>Thinking through your bakery details…</Shimmer>
            ) : text ? (
              props.tool === "email" ? (
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-80 w-full rounded-lg border bg-background p-3 text-sm" />
              ) : (
                <MessageResponse>{text}</MessageResponse>
              )
            ) : (
              !error && <p className="text-sm text-muted-foreground">Fill in the form and your result will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export const fieldClass = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
