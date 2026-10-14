import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Mail, ClipboardList, CalendarClock, Wheat, MessagesSquare } from "lucide-react";
import type { ReactNode } from "react";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Customer messages", icon: Mail },
  { to: "/orders", label: "Order notes", icon: ClipboardList },
  { to: "/planner", label: "Production planner", icon: CalendarClock },
  { to: "/research", label: "Ingredients & costs", icon: Wheat },
  { to: "/chat", label: "Bakery AI chat", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        <div className="flex items-center gap-3 px-5 py-5">
          <img src={logo} alt="BakeWise AI" width={40} height={40} className="h-10 w-10 rounded-lg bg-card p-1" />
          <div>
            <div className="font-display text-lg font-semibold leading-none">BakeWise AI</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] opacity-70">Bakery management</div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary" }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
