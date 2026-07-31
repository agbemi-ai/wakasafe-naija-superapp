import type { ReactNode } from "react";
import { Crown, Lock } from "lucide-react";
import { usePremium } from "@/lib/premium";
import { Loading } from "@/components/ui-kit";

export function PremiumGate({
  feature,
  children,
}: {
  feature: string;
  children: ReactNode;
}) {
  const { isPremium, loading, openPaywall } = usePremium();

  if (loading) return <Loading text="Checking your subscription…" />;
  if (isPremium) return <>{children}</>;

  return (
    <div className="px-4 py-10">
      <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">{feature} is a Premium feature</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Unlock all 16 tabs, PDF export and an ad-free WakaSafe for $3/month.
        </p>
        <button
          onClick={() => openPaywall(`Unlock ${feature}`)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          <Crown className="h-4 w-4" />
          See Premium
        </button>
      </div>
    </div>
  );
}
