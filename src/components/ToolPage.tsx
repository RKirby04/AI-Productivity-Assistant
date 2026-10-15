import { useState, type ReactNode, type ComponentType } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Copy, Check, Sparkles, AlertTriangle, ListChecks, CalendarClock, ClipboardList, HelpCircle, Lightbulb,
  Coins, Recycle, Info, FileText, Flame, TrendingUp, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { runBakeryTool } from "@/lib/tools.functions";
import { AppShell } from "./AppShell";

type Tone = "default" | "warn" | "danger" | "good";
const SECTION_STYLE: Record<Tone, string> = {
  default: "border-border bg-card",
  warn: "border-warning/40 bg-warning-soft",
  danger: "border-destructive/30 bg-destructive/5",
  good: "border-sage/40 bg-sage-soft",
};
const ICON_STYLE: Record<Tone, string> = {
  default: "bg-accent text-accent-foreground",
  warn: "bg-card text-warning",
  danger: "bg-card text-destructive",
  good: "bg-card text-sage-foreground",
};

function sectionMeta(title: string): { icon: ComponentType<{ className?: string }>; tone: Tone } {
  const t = title.toLowerCase();
  if (/missing|question/.test(t)) return { icon: HelpCircle, tone: "warn" };
  if (/warning|risk|conflict|problem/.test(t)) return { icon: AlertTriangle, tone: "danger" };
  if (/deadline|date|schedule|time/.test(t)) return { icon: CalendarClock, tone: "default" };
  if (/checklist/.test(t)) return { icon: ListChecks, tone: "good" };
  if (/priorit/.test(t)) return { icon: Flame, tone: "default" };
  if (/cost|price|margin/.test(t)) return { icon: Coins, tone: "default" };
  if (/waste/.test(t)) return { icon: Recycle, tone: "good" };
  if (/idea|promotion|product/.test(t)) return { icon: Lightbulb, tone: "default" };
  if (/quantit/.test(t)) return { icon: TrendingUp, tone: "default" };
  if (/assumption/.test(t)) return { icon: Info, tone: "default" };
  if (/summary/.test(t)) return { icon: ClipboardList, tone: "default" };
  return { icon: FileText, tone: "default" };
}

/** Splits markdown on "## " headings so each part renders as its own card. */
function splitSections(md: string) {
  const parts = md.split(/^##\s+/m);
  const intro = parts.shift()?.trim() ?? "";
  return { intro, sections: parts.map((p) => { const [h, ...rest] = p.split("\n"); return { title: (h ?? "").replace(/[#*]/g, "").trim(), body: rest.join("\n").trim() }; }) };
}

function SectionedResult({ text }: { text: string }) {
  const { intro, sections } = splitSections(text);
  if (!sections.length) return <div className="ai-sections"><MessageResponse>{text}</MessageResponse></div>;
  return (
    <div className="space-y-4">
      {intro && <div className="ai-sections text-sm"><MessageResponse>{intro}</MessageResponse></div>}
      {sections.map((s, i) => {
        const { icon: Icon, tone } = sectionMeta(s.title);
        return (
          <section key={i} className={`rounded-2xl border p-4 md:p-5 ${SECTION_STYLE[tone]}`}>
            <h3 className="flex items-center gap-2.5 font-display text-base font-semibold text-primary">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${ICON_STYLE[tone]}`}><Icon className="h-4 w-4" /></span>
              {s.title}
            </h3>
            <div className="ai-sections mt-3 overflow-x-auto text-sm"><MessageResponse>{s.body}</MessageResponse></div>
          </section>
        );
      })}
    </div>
  );
}

function parseEmail(text: string) {
  const m = text.match(/^\s*\*{0,2}Subject:?\*{0,2}:?\s*(.+)$/im);
  if (!m) return { subject: "", body: text.trim() };
  return { subject: (m[1] ?? "").replace(/\*\*/g, "").trim(), body: text.slice((m.index ?? 0) + m[0].length).trim() };
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button" variant="outline" size="sm"
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
      }}
    >
      {copied ? <Check className="h-4 w-4 text-sage-foreground" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : label}
    </Button>
  );
}

export function ToolPage(props: {
  tool: "email" | "orders" | "planner" | "research";
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
  buildInput: (form: FormData) => string;
  submitLabel?: string;
  tips?: string[];
  emptyTitle?: string;
  emptyHint?: string;
}) {
  const run = useServerFn(runBakeryTool);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await run({ data: { tool: props.tool, input: props.buildInput(new FormData(e.currentTarget)) } });
      if (res.ok) {
        setText(res.text);
        const p = parseEmail(res.text);
        setSubject(p.subject);
        setBody(p.body);
      } else setError(res.error);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const isEmail = props.tool === "email";
  const copyAll = isEmail ? (subject ? `Subject: ${subject}\n\n${body}` : body) : text;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <Sparkles className="h-3 w-3" /> {props.badge}
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-primary md:text-4xl">{props.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{props.description}</p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="space-y-4 lg:sticky lg:top-24">
            <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border bg-card p-5 shadow-card md:p-6">
              {props.children}
              <Button type="submit" disabled={loading} size="lg" className="h-12 w-full rounded-xl text-sm">
                <Sparkles className="h-4 w-4" />
                {loading ? "Working…" : props.submitLabel ?? "Generate with AI"}
              </Button>
            </form>
            {props.tips && (
              <div className="rounded-2xl border border-dashed bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-sage-foreground">For best results</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {props.tips.map((t) => <li key={t} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta" />{t}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="min-w-0 rounded-3xl border bg-card p-5 shadow-card md:p-6" aria-live="polite">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-primary">{isEmail ? "Your message" : "AI result"}</h2>
              {text && !loading && (
                <div className="flex gap-2">
                  {isEmail && subject && <CopyButton value={subject} label="Copy subject" />}
                  <CopyButton value={copyAll} label={isEmail ? "Copy message" : "Copy"} />
                </div>
              )}
            </div>

            {error && (
              <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-4 py-4">
                <Shimmer>Thinking through your bakery details…</Shimmer>
                <div className="space-y-2.5">
                  {[90, 75, 82, 60].map((w) => <div key={w} className="h-3 animate-pulse rounded-full bg-secondary" style={{ width: `${w}%` }} />)}
                </div>
                <p className="text-xs text-muted-foreground">This can take up to a minute.</p>
              </div>
            ) : text ? (
              isEmail ? (
                <div className="space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject line</span>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)} className={fieldClass} placeholder="No subject generated" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message — edit freely</span>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} className={`${fieldClass} min-h-80 leading-relaxed`} />
                  </label>
                  <p className="text-xs text-muted-foreground">Ready to paste into email or WhatsApp.</p>
                </div>
              ) : (
                <SectionedResult text={text} />
              )
            ) : (
              !error && (
                <div className="flex flex-col items-center px-4 py-14 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Sparkles className="h-6 w-6" /></span>
                  <p className="mt-4 font-display text-lg font-semibold text-primary">{props.emptyTitle ?? "Your result will appear here"}</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">{props.emptyHint ?? "Fill in the form and press generate."}</p>
                </div>
              )
            )}
            {text && !loading && (
              <button type="button" onClick={() => { setText(""); setError(""); }} className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary">
                <RotateCcw className="h-3 w-3" /> Clear result
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export const fieldClass =
  "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 hover:border-terracotta/50 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-ring/25";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
