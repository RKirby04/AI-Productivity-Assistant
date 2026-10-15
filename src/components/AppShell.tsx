import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, ClipboardList, CalendarClock, Wheat, MessagesSquare, Menu, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo-sweet-treats.png";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Customer Messages", icon: Mail },
  { to: "/orders", label: "Order Notes", icon: ClipboardList },
  { to: "/planner", label: "Production Planner", icon: CalendarClock },
  { to: "/research", label: "Ingredients & Costs", icon: Wheat },
  { to: "/chat", label: "Bakery AI Chat", icon: MessagesSquare },
] as const;

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 rounded-lg">
      <img src={logo} alt="" width={44} height={44} className="h-11 w-11" />
      <div>
        <div className="font-display text-xl font-semibold leading-none text-primary">Sweet Treats</div>
        <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Bakery studio</div>
      </div>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-primary"
          activeProps={{ className: "!bg-primary !text-primary-foreground shadow-card" }}
        >
          <Icon className="h-[18px] w-[18px]" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-sage-foreground">
        <Sparkles className="h-3.5 w-3.5" /> Demo mode
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        Dashboard figures are sample data. Chats are saved in this browser only.
      </p>
    </div>
  );
}

export function AppShell({ children, title, actions }: { children: ReactNode; title?: string; actions?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = title ?? NAV.find((n) => (n.to === "/" ? path === "/" : path.startsWith(n.to)))?.label ?? "Sweet Treats";

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r bg-sidebar px-4 py-6 lg:flex">
        <div className="px-2"><Brand /></div>
        <NavList />
        <div className="mt-auto"><SidebarFooter /></div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="-ml-1 flex h-11 w-11 items-center justify-center rounded-xl text-primary hover:bg-secondary lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col gap-8 bg-sidebar px-4 py-6">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="px-2"><Brand /></div>
              <NavList onNavigate={() => setOpen(false)} />
              <div className="mt-auto"><SidebarFooter /></div>
            </SheetContent>
          </Sheet>
          <p className="min-w-0 flex-1 truncate font-display text-lg font-semibold text-primary md:text-xl">{current}</p>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
