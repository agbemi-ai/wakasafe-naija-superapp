import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "@/lib/storage";

/**
 * Subscription layer.
 *
 * In a native build this is backed by RevenueCat (offering: "wakasafe_premium",
 * package: "$rc_monthly", $3.00/month). On web we mirror the same interface and
 * persist entitlement locally so the paywall + gating logic is identical.
 */
export const PREMIUM_PRICE_USD = 3;
export const PREMIUM_PRICE_NGN = 4500;
export const REVENUECAT_ENTITLEMENT = "premium";
export const REVENUECAT_OFFERING = "wakasafe_premium";

type Entitlement = {
  active: boolean;
  productId: string | null;
  purchasedAt: string | null;
  willRenewAt: string | null;
};

const EMPTY: Entitlement = {
  active: false,
  productId: null,
  purchasedAt: null,
  willRenewAt: null,
};

type PremiumContextValue = {
  isPremium: boolean;
  loading: boolean;
  entitlement: Entitlement;
  purchasing: boolean;
  paywallReason: string | null;
  openPaywall: (reason?: string) => void;
  closePaywall: () => void;
  purchase: () => Promise<void>;
  restore: () => Promise<boolean>;
  cancel: () => void;
};

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { value, setValue, loading } = useStore<Entitlement>("entitlement", EMPTY);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const openPaywall = useCallback((reason?: string) => {
    setPaywallReason(reason ?? "WakaSafe Premium");
  }, []);
  const closePaywall = useCallback(() => setPaywallReason(null), []);

  const purchase = useCallback(async () => {
    setPurchasing(true);
    try {
      // RevenueCat: await Purchases.purchasePackage(monthlyPackage)
      await new Promise((r) => setTimeout(r, 900));
      const now = new Date();
      const renew = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      setValue({
        active: true,
        productId: "wakasafe_premium_monthly",
        purchasedAt: now.toISOString(),
        willRenewAt: renew.toISOString(),
      });
      setPaywallReason(null);
    } finally {
      setPurchasing(false);
    }
  }, [setValue]);

  const restore = useCallback(async () => {
    setPurchasing(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      return value.active;
    } finally {
      setPurchasing(false);
    }
  }, [value.active]);

  const cancel = useCallback(() => setValue(EMPTY), [setValue]);

  const ctx = useMemo<PremiumContextValue>(
    () => ({
      isPremium: value.active,
      loading,
      entitlement: value,
      purchasing,
      paywallReason,
      openPaywall,
      closePaywall,
      purchase,
      restore,
      cancel,
    }),
    [value, loading, purchasing, paywallReason, openPaywall, closePaywall, purchase, restore, cancel],
  );

  return <PremiumContext.Provider value={ctx}>{children}</PremiumContext.Provider>;
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used inside <PremiumProvider>");
  return ctx;
}
