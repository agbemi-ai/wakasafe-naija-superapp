import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bell, Globe, Lock, Download, Trash2, Crown, Info } from "lucide-react";
import { Screen, Panel } from "@/components/ui-kit";
import { useSettings, DEFAULT_SETTINGS, type AppSettings } from "@/hooks/useWakaSafe";
import { exportJson } from "@/lib/storage";
import { usePremium } from "@/lib/premium";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Notifications, Language & Privacy | WakaSafe AI" },
      {
        name: "description",
        content:
          "Manage reminders, choose English or Pidgin, control privacy, export your data and manage your WakaSafe Premium plan.",
      },
      { property: "og:title", content: "Settings | WakaSafe AI" },
      { property: "og:description", content: "Notifications, language, privacy and subscription controls." },
    ],
  }),
  component: SettingsPage,
});

const TOGGLES: { key: keyof AppSettings; label: string; hint: string }[] = [
  { key: "notifications", label: "Push notifications", hint: "Health tips and safety alerts" },
  { key: "medReminders", label: "Medication reminders", hint: "Alarm when it's time for your drugs" },
  { key: "sosVibration", label: "SOS vibration", hint: "Vibrate when the SOS alert is sent" },
  { key: "shareAnalytics", label: "Share anonymous analytics", hint: "Helps improve WakaSafe AI" },
  { key: "biometricLock", label: "Biometric app lock", hint: "Require fingerprint to open the app" },
];

function SettingsPage() {
  const { value: settings, setValue } = useSettings();
  const { isPremium, openPaywall, restore, cancel } = usePremium();

  return (
    <Screen title="Settings" subtitle="Make WakaSafe work your way">
      <Panel title="Subscription">
        <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
          <Crown className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {isPremium ? "WakaSafe Premium — active" : "Free plan"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {isPremium ? "All 16 features unlocked · $3/month" : "Unlock all premium tabs for $3/month"}
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {isPremium ? (
            <button
              onClick={() => {
                cancel();
                toast.success("Subscription cancelled");
              }}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold"
            >
              Cancel plan
            </button>
          ) : (
            <button onClick={() => openPaywall("Settings")} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
              Upgrade — $3/month
            </button>
          )}
          <button
            onClick={() => {
              restore();
              toast.success("Purchases restored");
            }}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold"
          >
            Restore purchase
          </button>
        </div>
      </Panel>

      <Panel title="Preferences">
        <ul className="divide-y divide-border">
          {TOGGLES.map((t) => {
            const on = settings[t.key] as boolean;
            return (
              <li key={t.key} className="flex items-center gap-3 py-3">
                <Bell className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground">{t.hint}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={on}
                  aria-label={t.label}
                  onClick={() => setValue({ ...settings, [t.key]: !on })}
                  className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${on ? "bg-primary" : "bg-border"}`}
                >
                  <span className={`block h-5 w-5 rounded-full bg-card transition-transform ${on ? "translate-x-5" : ""}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Language">
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-primary" />
          <select
            value={settings.language}
            onChange={(e) => setValue({ ...settings, language: e.target.value as AppSettings["language"] })}
            className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
          >
            {["English", "Pidgin", "Hausa", "Yoruba", "Igbo"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </Panel>

      <Panel title="Data & privacy">
        <p className="mb-3 flex items-start gap-2 text-[11px] text-muted-foreground">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          Everything you log stays on this device. Nothing is uploaded to a server.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => {
              const dump: Record<string, unknown> = {};
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k?.startsWith("wakasafe:")) dump[k] = JSON.parse(localStorage.getItem(k) ?? "null");
              }
              exportJson("wakasafe-data.json", dump);
              toast.success("Data exported");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold"
          >
            <Download className="h-4 w-4" /> Export my data (JSON)
          </button>
          <button
            onClick={() => {
              setValue(DEFAULT_SETTINGS);
              toast.success("Settings reset to default");
            }}
            className="w-full rounded-xl border border-border py-2.5 text-sm font-semibold"
          >
            Reset settings
          </button>
          <button
            onClick={() => {
              if (!window.confirm("Delete all WakaSafe data on this device? This cannot be undone.")) return;
              Object.keys(localStorage)
                .filter((k) => k.startsWith("wakasafe:"))
                .forEach((k) => localStorage.removeItem(k));
              toast.success("All data deleted");
              window.location.href = "/";
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" /> Delete all my data
          </button>
        </div>
      </Panel>

      <Panel title="About">
        <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          WakaSafe AI v1.0 · Built for Nigeria 🇳🇬 · Times shown in WAT. This app gives general guidance only and does not replace professional medical care. In an emergency, call 112.
        </p>
      </Panel>
    </Screen>
  );
}
