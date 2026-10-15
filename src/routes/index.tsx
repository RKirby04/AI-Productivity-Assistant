import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, CalendarClock, ClipboardList, MessagesSquare, Lightbulb, ShoppingBag, CakeSlice, PackageCheck, AlertTriangle, ArrowRight, Wheat, Clock } from "lucide-react";
import pastries from "@/assets/pastries.jpg";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { DEMO_ORDERS, DEMO_STOCK } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sweet Treats — Smart Bakery Business Assistant" },
      { name: "description", content: "Bake smarter, waste less, grow your bakery: orders, production planning, customer messages and AI insights in one dashboard." },
      { property: "og:title", content: "Sweet Treats — Smart Bakery Business Assistant" },
      { property: "og:description", content: "One AI-powered dashboard for bakery operations, customers and planning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const today = new Date().toISOString().slice(0, 10);

const STATUS_STYLE: Record<string, string> = {
  Ready: "bg-sage-soft text-sage-foreground",
  Baking: "bg-warning-soft text-warning",
  Pending: "bg-accent text-accent-foreground",
  Collected: "bg-secondary text-muted-foreground",
};

function DemoTag() {
  return <span className="rounded-full border border-dashed px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Demo data</span>;
}

function Card({ title, icon: Icon, action, children, className = "" }: { title: string; icon: typeof Clock; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border bg-card p-5 shadow-card md:p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Dashboard() {
  const todays = DEMO_ORDERS.filter((o) => o.date === today);
  const lowStock = DEMO_STOCK.filter((i) => i.qty < i.min);
  const pending = DEMO_ORDERS.filter((o) => o.status === "Ready");
  const stats = [
    { label: "Today's Orders", value: todays.length, note: "orders due today", icon: ShoppingBag, tone: "bg-accent text-accent-foreground" },
    { label: "Items to Bake", value: todays.reduce((s, o) => s + o.qty, 0), note: "units across all orders", icon: CakeSlice, tone: "bg-warning-soft text-warning" },
    { label: "Pending Collections", value: pending.length, note: "ready and waiting", icon: PackageCheck, tone: "bg-sage-soft text-sage-foreground" },
    { label: "Low-Stock Alerts", value: lowStock.length, note: "below minimum level", icon: AlertTriangle, tone: "bg-destructive/10 text-destructive" },
  ];

  const production = Object.values(
    todays.filter((o) => o.status !== "Collected").reduce<Record<string, { item: string; qty: number; orders: number; earliest: string }>>((acc, o) => {
      const k = o.item ?? "Other";
      const cur = acc[k] ?? { item: k, qty: 0, orders: 0, earliest: o.time };
      cur.qty += o.qty; cur.orders += 1;
      if (toMin(o.time) < toMin(cur.earliest)) cur.earliest = o.time;
      acc[k] = cur;
      return acc;
    }, {}),
  ).sort((a, b) => toMin(a.earliest) - toMin(b.earliest));
  const maxQty = Math.max(1, ...production.map((p) => p.qty));

  const upcoming = todays
    .filter((o) => o.status === "Ready" || o.status === "Pending" || o.status === "Baking")
    .sort((a, b) => toMin(a.time) - toMin(b.time))
    .slice(0, 6);

  const actions = [
    { to: "/email", label: "Draft a message", desc: "Replies, quotes & reminders", icon: Mail },
    { to: "/orders", label: "Summarise an order", desc: "Turn chats into checklists", icon: ClipboardList },
    { to: "/planner", label: "Plan production", desc: "Schedule today's bakes", icon: CalendarClock },
    { to: "/research", label: "Cost a recipe", desc: "Margins & waste tips", icon: Wheat },
  ] as const;

  const dateLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <AppShell
      actions={
        <Button asChild size="sm" className="rounded-xl">
          <Link to="/chat"><MessagesSquare className="h-4 w-4" /><span className="hidden sm:inline">Ask Bakery AI</span></Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8 md:py-10">
        <section className="relative overflow-hidden rounded-3xl border bg-card shadow-card">
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <div className="p-6 md:p-10">
              <p className="text-sm font-medium text-terracotta" suppressHydrationWarning>{dateLabel}</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight text-primary md:text-[2.6rem]">Good morning, welcome to Sweet Treats</h1>
              <p className="mt-3 max-w-md text-muted-foreground">Everything you need to run the bakery today — orders, bakes, collections and stock, all in one calm place.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild className="rounded-xl"><Link to="/planner">Plan today's bakes <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button asChild variant="outline" className="rounded-xl"><Link to="/orders">Process an order</Link></Button>
              </div>
            </div>
            <img src={pastries} alt="Fresh croissants, sourdough and cupcakes on linen" width={1280} height={720} className="h-48 w-full object-cover md:h-full" />
          </div>
        </section>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">At a glance</h2>
          <DemoTag />
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, note, icon: Icon, tone }) => (
            <div key={label} className="rounded-3xl border bg-card p-4 shadow-card transition-shadow hover:shadow-lift md:p-5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
              <div className="mt-4 font-display text-3xl font-semibold text-primary md:text-4xl">{value}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{note}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Today's Production Overview" icon={CakeSlice} action={<DemoTag />} className="lg:col-span-2">
            <ul className="space-y-4">
              {production.map((p) => (
                <li key={p.item}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-foreground">{p.item}</span>
                    <span className="shrink-0 text-muted-foreground"><span className="font-semibold text-primary">{p.qty}</span> units · {p.orders} orders · first due {p.earliest}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-terracotta" style={{ width: `${(p.qty / maxQty) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <section className="flex flex-col rounded-3xl bg-primary p-6 text-primary-foreground shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold text-terracotta"><Lightbulb className="h-4 w-4" /> AI Baking Tip</div>
            <p className="mt-4 font-display text-xl leading-snug">Bake your earliest-collection orders first, then batch similar doughs together to make the most of each oven heat-up.</p>
            <p className="mt-auto pt-6 text-xs opacity-70">General guidance — not based on your live inventory.</p>
            <Link to="/chat" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:underline">Ask for more tips <ArrowRight className="h-3.5 w-3.5" /></Link>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Upcoming Collections" icon={Clock} action={<DemoTag />} className="lg:col-span-2">
            <ul className="divide-y">
              {upcoming.map((o, i) => (
                <li key={o.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className={`w-14 shrink-0 rounded-xl py-1.5 text-center text-sm font-semibold ${i < 2 ? "bg-terracotta text-primary-foreground" : "bg-secondary text-primary"}`}>{o.time}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{o.customer}</div>
                    <div className="truncate text-xs text-muted-foreground">{o.qty} × {o.item}</div>
                  </div>
                  {i < 2 && <span className="hidden text-xs font-semibold text-terracotta sm:inline">Due soon</span>}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[o.status] ?? ""}`}>{o.status}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Inventory Alerts" icon={AlertTriangle} action={<DemoTag />}>
            <ul className="space-y-4">
              {lowStock.map((i) => {
                const pct = Math.min(100, (i.qty / i.min) * 100);
                return (
                  <li key={i.name}>
                    <div className="flex justify-between text-sm"><span className="font-medium">{i.name}</span><span className="text-destructive">{i.qty} {i.unit}</span></div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-destructive" style={{ width: `${pct}%` }} /></div>
                    <div className="mt-1 text-xs text-muted-foreground">Minimum {i.min} {i.unit} — reorder soon</div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-primary">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map(({ to, label, desc, icon: Icon }) => (
              <Link key={to} to={to} className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card transition hover:border-terracotta/60 hover:shadow-lift">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{desc}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-terracotta" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}
