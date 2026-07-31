import { Link, useRouterState } from "@tanstack/react-router";
import { Crown, LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";
import { TABS } from "@/lib/tabs";
import { usePremium } from "@/lib/premium";
import { cn } from "@/lib/utils";

const NAV = [
  TABS[0], // home
  TABS[1], // health
  TABS[5], // hospitals
  TABS[14], // profile
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isPremium, openPaywall } = usePremium();

  return (
    <div className="app-shell min-h-screen bg-background pb-24">
      {children}

      {!isPremium ? (
        <button
          type="button"
          onClick={() => openPaywall("Upgrade to WakaSafe Premium")}
          className="fixed bottom-24 left-1/2 z-30 flex w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-premium px-4 py-2.5 text-xs font-semibold text-premium-foreground shadow-[var(--shadow-card)]"
        >
          <Crown className="h-4 w-4" />
          Go Premium — $3/month · unlock all 16 tabs
        </button>
      ) : null}

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[30rem] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
        <div className="grid grid-cols-5 items-end px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {NAV.slice(0, 2).map((t) => (
            <NavItem key={t.to} to={t.to} label={t.short} icon={t.icon} active={pathname === t.to} />
          ))}

          <Link
            to="/sos"
            className="flex flex-col items-center gap-1"
            aria-label="SOS Emergency"
          >
            <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-base font-bold text-destructive-foreground shadow-[var(--shadow-float)]">
              SOS
            </span>
          </Link>

          {NAV.slice(2).map((t) => (
            <NavItem key={t.to} to={t.to} label={t.short} icon={t.icon} active={pathname === t.to} />
          ))}
        </div>
      </nav>

      <Link
        to="/more"
        aria-label="All features"
        className={cn(
          "fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-card/25 text-primary-foreground backdrop-blur",
        )}
      >
        <LayoutGrid className="h-5 w-5" />
      </Link>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-1 py-1 text-[10px] font-medium",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}
