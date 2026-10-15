import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, CalendarClock, ClipboardList, MessagesSquare, Lightbulb } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DEMO_ORDERS, DEMO_STOCK } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sweet Treats — Smart Bakery Business Assistant" },
      { name: "description", content: "Bake smarter, waste less, grow your bakery: orders, production planning, customer messages and AI insights in one dashboard." },
      { property: "og:title", content: "Sweet Treats — Smart Bakery Business Assistant" },
      { property: "og:description", content: "One AI-powered dashboard for bakery operations, customers and planning." },
    ],
  }),
  component: Dashboard,
});

const today = new Date().toISOString().slice(0, 10);

function Dashboard() {
  const todays = DEMO_ORDERS.filter((o) => o.date === today);
  const stats = [
    { label: "Today's orders", value: todays.length },
    { label: "Items to bake", value: todays.reduce((s, o) => s + o.qty, 0) },
    { label: "Pending collections", value: DEMO_ORDERS.filter((o) => o.status === "Ready").length },
    { label: "Low-stock alerts", value: DEMO_STOCK.filter((i) => i.qty < i.min).length },
  ];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const actions = [
    { to: "/email", label: "Draft a message", icon: Mail },
    { to: "/planner", label: "Plan production", icon: CalendarClock },
    { to: "/orders", label: "Process an order", icon: ClipboardList },
    { to: "/chat", label: "Ask Bakery AI", icon: MessagesSquare },
  ] as const;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-semibold">{greet}, Baker!</h1>
        <p className="mt-2 text-muted-foreground">Here's what's happening in your bakery today.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="mt-2 font-display text-4xl font-semibold text-primary">{s.value}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Demo data</div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-semibold">Quick actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {actions.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex items-center gap-3 rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary">
              <span className="rounded-xl bg-accent p-2.5 text-primary"><Icon className="h-5 w-5" /></span>
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-card lg:col-span-2">
            <h2 className="text-xl font-semibold">Today's orders</h2>
            <table className="mt-4 w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr><th className="pb-2">Customer</th><th>Item</th><th>Qty</th><th>Collect</th><th>Status</th></tr>
              </thead>
              <tbody>
                {todays.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-2.5">{o.customer}</td><td>{o.item}</td><td>{o.qty}</td><td>{o.time}</td>
                    <td><span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl bg-sidebar p-6 text-sidebar-foreground shadow-card">
            <div className="flex items-center gap-2 text-sidebar-primary"><Lightbulb className="h-5 w-5" /><span className="text-sm font-medium">AI bakery insight</span></div>
            <p className="mt-3 font-display text-lg leading-snug">Review today's custom orders and ingredient availability before finalizing the baking schedule.</p>
            <p className="mt-3 text-xs opacity-70">Illustrative suggestion — not based on live inventory.</p>
            <h3 className="mt-6 text-sm font-medium">Low stock</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {DEMO_STOCK.filter((i) => i.qty < i.min).map((i) => <li key={i.name}>{i.name}: {i.qty} {i.unit} (min {i.min})</li>)}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
