import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Siren,
  CloudSun,
  ShieldCheck,
  Droplets,
  Wind,
  ChevronRight,
  Crown,
} from "lucide-react";
import { TABS } from "@/lib/tabs";
import { usePremium } from "@/lib/premium";
import { useProfile, useSafetyScore, useHealthLogs } from "@/hooks/useWakaSafe";
import { watTime, watDate } from "@/lib/storage";
import { Panel, Stat } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WakaSafe AI — Home Dashboard for Nigerian Families" },
      {
        name: "description",
        content:
          "Your safety score, one-tap SOS, Lagos & Abuja weather and quick access to health, hospital and family tools.",
      },
      { property: "og:title", content: "WakaSafe AI — Home Dashboard" },
      {
        property: "og:description",
        content: "Safety score, emergency SOS, weather and quick actions for Nigeria.",
      },
    ],
  }),
  component: HomePage,
});

const WEATHER = [
  { city: "Lagos", temp: 31, cond: "Humid, thundery showers", rain: 70, wind: 12 },
  { city: "Abuja", temp: 29, cond: "Partly cloudy", rain: 30, wind: 9 },
  { city: "Kano", temp: 35, cond: "Hot and dusty", rain: 5, wind: 18 },
  { city: "Port Harcourt", temp: 28, cond: "Heavy rain likely", rain: 85, wind: 14 },
];

function HomePage() {
  const { value: profile } = useProfile();
  const score = useSafetyScore();
  const { items: logs } = useHealthLogs();
  const { isPremium, openPaywall } = usePremium();
  const [now, setNow] = useState<Date | null>(null);
  const [city, setCity] = useState("Lagos");

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const weather = useMemo(
    () => WEATHER.find((w) => w.city === city) ?? WEATHER[0],
    [city],
  );

  const quick = [TABS[4], TABS[5], TABS[6], TABS[8], TABS[3], TABS[1]];
  const firstName = profile.name?.split(" ")[0] || "there";

  return (
    <div className="pb-6">
      <header className="hero-gradient rounded-b-3xl px-5 pb-14 pt-7 text-primary-foreground">
        <p className="text-xs opacity-90">
          {now ? `${watDate(now)} · ${watTime(now)} WAT` : "Loading time…"}
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Hi {firstName} 👋</h1>
        <p className="mt-1 text-sm opacity-90">
          WakaSafe AI is watching your back today.
        </p>
      </header>

      <div className="-mt-10 space-y-4 px-4">
        <Panel>
          <div className="flex items-center gap-4">
            <ScoreRing score={score} />
            <div className="flex-1">
              <p className="text-sm font-semibold">Safety Score</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {score >= 80
                  ? "Excellent — your family profile is well prepared."
                  : score >= 55
                    ? "Good. Add more emergency contacts to improve."
                    : "Complete your profile and add 3 emergency contacts."}
              </p>
              <Link
                to="/profile"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                Improve score <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </Panel>

        <Link
          to="/sos"
          className="flex items-center gap-3 rounded-2xl bg-destructive p-4 text-destructive-foreground shadow-[var(--shadow-card)]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card/20">
            <Siren className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block text-base font-semibold">Emergency SOS</span>
            <span className="block text-xs opacity-90">
              Call 112 / 199 and alert your contacts instantly
            </span>
          </span>
          <ChevronRight className="h-5 w-5" />
        </Link>

        <Panel title="Quick actions">
          <div className="grid grid-cols-3 gap-3">
            {quick.map((t) => {
              const locked = t.premium && !isPremium;
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  onClick={(e) => {
                    if (locked) {
                      e.preventDefault();
                      openPaywall(`Unlock ${t.label}`);
                    }
                  }}
                  className="flex flex-col items-center gap-2 rounded-xl bg-secondary p-3 text-center"
                >
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card text-primary">
                    <Icon className="h-5 w-5" />
                    {locked ? (
                      <Crown className="absolute -right-1 -top-1 h-3.5 w-3.5 text-premium" />
                    ) : null}
                  </span>
                  <span className="text-[11px] font-medium leading-tight">{t.short}</span>
                </Link>
              );
            })}
          </div>
        </Panel>

        <Panel
          title="Weather & safety"
          right={
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-border bg-card px-2 py-1 text-xs"
            >
              {WEATHER.map((w) => (
                <option key={w.city}>{w.city}</option>
              ))}
            </select>
          }
        >
          <div className="flex items-center gap-4">
            <CloudSun className="h-10 w-10 text-primary" />
            <div className="flex-1">
              <p className="text-2xl font-semibold">{weather.temp}°C</p>
              <p className="text-xs text-muted-foreground">{weather.cond}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Rain chance" value={`${weather.rain}%`} hint={<Droplets className="h-3 w-3" /> ? undefined : undefined} />
            <Stat label="Wind" value={`${weather.wind} km/h`} />
          </div>
          {weather.rain > 60 ? (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-warning/15 p-3 text-xs text-foreground">
              <Wind className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              Heavy rain expected — flooding risk on major roads. Leave early and avoid
              flooded routes.
            </p>
          ) : null}
        </Panel>

        <Panel title="Today at a glance">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Health logs" value={logs.length} />
            <Stat label="Blood group" value={profile.bloodGroup || "—"} />
            <Stat label="Plan" value={isPremium ? "Premium" : "Free"} />
          </div>
        </Panel>

        <Panel title="All features">
          <div className="space-y-1">
            {TABS.slice(0, 6).map((t) => (
              <FeatureRow key={t.to} to={t.to} label={t.label} blurb={t.blurb} />
            ))}
            <Link
              to="/more"
              className="mt-2 flex items-center justify-center gap-1 rounded-xl bg-secondary py-2.5 text-xs font-semibold text-primary"
            >
              <ShieldCheck className="h-4 w-4" /> See all 16 tabs
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function FeatureRow({ to, label, blurb }: { to: string; label: string; blurb: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-xl px-1 py-2.5">
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">{blurb}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 72 72" className="h-20 w-20">
      <circle cx="36" cy="36" r={r} className="fill-none stroke-secondary" strokeWidth="8" />
      <circle
        cx="36"
        cy="36"
        r={r}
        className="fill-none stroke-primary transition-all"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * score) / 100}
        transform="rotate(-90 36 36)"
      />
      <text
        x="36"
        y="41"
        textAnchor="middle"
        className="fill-foreground text-[16px] font-semibold"
      >
        {score}
      </text>
    </svg>
  );
}
