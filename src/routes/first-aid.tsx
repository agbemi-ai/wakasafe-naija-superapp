import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WifiOff, ChevronDown, Phone } from "lucide-react";
import { Screen, Panel } from "@/components/ui-kit";
import { FIRST_AID } from "@/lib/data";

export const Route = createFileRoute("/first-aid")({
  head: () => ({
    meta: [
      { title: "First Aid Guide — Offline Emergency Steps | WakaSafe AI" },
      {
        name: "description",
        content:
          "Step-by-step first aid for bleeding, choking, burns, snake bite, CPR, seizures and road accidents. Works offline.",
      },
      { property: "og:title", content: "First Aid Guide | WakaSafe AI" },
      { property: "og:description", content: "Offline step-by-step first aid for Nigerian emergencies." },
    ],
  }),
  component: FirstAidPage,
});

function FirstAidPage() {
  const [open, setOpen] = useState<string | null>(FIRST_AID[0].id);

  return (
    <Screen title="First Aid Guide" subtitle="Know what to do in the first 5 minutes">
      <div className="flex items-center gap-2 rounded-2xl bg-primary/10 p-3 text-[11px] text-foreground">
        <WifiOff className="h-4 w-4 shrink-0 text-primary" />
        Saved on your device — these guides open even without data.
      </div>

      <a href="tel:112" className="flex items-center justify-center gap-2 rounded-2xl bg-destructive py-3 text-sm font-semibold text-destructive-foreground">
        <Phone className="h-4 w-4" /> Call 112 emergency
      </a>

      {FIRST_AID.map((g) => {
        const isOpen = open === g.id;
        return (
          <Panel key={g.id} className="p-0">
            <button
              onClick={() => setOpen(isOpen ? null : g.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="text-2xl" aria-hidden>{g.emoji}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{g.title}</span>
                <span className="block text-[11px] text-muted-foreground">{g.summary}</span>
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen ? (
              <div className="border-t border-border p-4">
                <ol className="space-y-3">
                  {g.steps.map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="text-xs leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 rounded-xl bg-destructive/10 p-3">
                  <p className="text-[11px] font-semibold text-destructive">Never do this</p>
                  <ul className="mt-1 list-disc pl-4 text-[11px] text-foreground">
                    {g.dont.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </Panel>
        );
      })}
    </Screen>
  );
}
