import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, ChevronRight } from "lucide-react";
import { Screen, Panel } from "@/components/ui-kit";
import { TABS } from "@/lib/tabs";
import { usePremium } from "@/lib/premium";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "All Features — 16 Safety & Health Tools | WakaSafe AI" },
      {
        name: "description",
        content:
          "Browse all 16 WakaSafe AI tools: health tracking, baby care, family locator, SOS, hospitals, drugs, first aid, wallet and more.",
      },
      { property: "og:title", content: "All Features | WakaSafe AI" },
      { property: "og:description", content: "Every WakaSafe AI safety, health and family tool in one list." },
    ],
  }),
  component: MorePage,
});

function MorePage() {
  const { isPremium, openPaywall } = usePremium();

  return (
    <Screen title="All Features" subtitle="16 tools for your safety, health & family">
      {!isPremium ? (
        <button
          onClick={() => openPaywall("More menu")}
          className="hero-gradient flex w-full items-center gap-3 rounded-2xl p-4 text-left text-primary-foreground"
        >
          <Crown className="h-6 w-6" />
          <span className="flex-1">
            <span className="block text-sm font-semibold">Go Premium — $3/month</span>
            <span className="block text-[11px] opacity-90">Unlock baby care, family locator, wallet, community & more</span>
          </span>
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : null}

      <Panel title="Everything in WakaSafe AI" className="p-0">
        <ul className="divide-y divide-border">
          {TABS.map((t) => (
            <li key={t.to}>
              <Link to={t.to} className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <t.icon className="h-5 w-5 text-primary" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {t.label}
                    {t.premium && !isPremium ? <Crown className="h-3.5 w-3.5 text-primary" /> : null}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">{t.blurb}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </Screen>
  );
}
