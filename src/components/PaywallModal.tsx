import { Crown, Check, X, Loader2 } from "lucide-react";
import { usePremium, PREMIUM_PRICE_USD, PREMIUM_PRICE_NGN } from "@/lib/premium";
import { naira } from "@/lib/storage";

const PERKS = [
  "Unlock all 16 tabs (Baby Care, Family Locator, Cycle, Wallet & more)",
  "Export health reports to PDF",
  "Ad-free experience",
  "Unlimited AI Health Chat history",
  "Priority emergency alerts to 3 contacts",
];

export function PaywallModal() {
  const { paywallReason, closePaywall, purchase, restore, purchasing } = usePremium();
  if (!paywallReason) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-[30rem] rounded-t-3xl bg-card p-5 pb-8 shadow-[var(--shadow-card)] sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-premium text-premium-foreground">
            <Crown className="h-5 w-5" />
          </div>
          <button
            onClick={closePaywall}
            aria-label="Close paywall"
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mt-3 text-xl font-semibold">{paywallReason}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          WakaSafe Premium keeps your whole family covered — health, safety and money in one app.
        </p>

        <ul className="mt-4 space-y-2">
          {PERKS.map((p) => (
            <li key={p} className="flex gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-2xl border border-primary bg-secondary p-4">
          <p className="text-sm font-semibold">Monthly plan</p>
          <p className="text-2xl font-bold text-primary">
            ${PREMIUM_PRICE_USD}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}/month · about {naira(PREMIUM_PRICE_NGN)}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Billed through RevenueCat. Cancel anytime from Settings.
          </p>
        </div>

        <button
          onClick={() => void purchase()}
          disabled={purchasing}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
          {purchasing ? "Processing…" : "Start Premium"}
        </button>
        <button
          onClick={() => void restore()}
          disabled={purchasing}
          className="mt-2 w-full rounded-xl py-2.5 text-xs font-medium text-muted-foreground"
        >
          Restore purchases
        </button>
      </div>
    </div>
  );
}
