import type { ReactNode } from "react";
import { Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function Screen({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="pb-6">
      <header className="hero-gradient px-5 pb-8 pt-6 text-primary-foreground">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm opacity-90">{subtitle}</p>
            ) : null}
          </div>
          {action}
        </div>
      </header>
      <div className="-mt-5 space-y-4 px-4">{children}</div>
    </div>
  );
}

export function Panel({
  children,
  className,
  title,
  right,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  right?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {right}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-secondary-foreground">{value}</p>
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
      <Inbox className="h-6 w-6" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function Loading({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {text}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}
