import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pill as PillIcon, Search, AlertTriangle } from "lucide-react";
import { Screen, Panel, Empty } from "@/components/ui-kit";
import { PremiumGate } from "@/components/PremiumGate";
import { DRUGS } from "@/lib/data";

export const Route = createFileRoute("/drugs")({
  head: () => ({
    meta: [
      { title: "Drug Info — Nigerian Drug Database & Dosage | WakaSafe AI" },
      {
        name: "description",
        content:
          "Search common Nigerian medicines for dosage, brand names, side effects, warnings and typical Naira prices.",
      },
      { property: "og:title", content: "Drug Info | WakaSafe AI" },
      { property: "og:description", content: "Nigerian drug database with dosage and side effects." },
    ],
  }),
  component: () => (
    <PremiumGate feature="Drug Info">
      <DrugsPage />
    </PremiumGate>
  ),
});

function DrugsPage() {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(
    () =>
      DRUGS.filter((d) =>
        (d.name + d.brands + d.klass + d.uses).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <Screen title="Drug Info" subtitle="Dosage, brands and side effects — Nigeria">
      <Panel>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search e.g. Coartem, Paracetamol"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm"
          />
        </div>
      </Panel>

      <div className="flex items-start gap-2 rounded-2xl bg-warning/15 p-3 text-[11px]">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p>Information only — not a prescription. Confirm with a pharmacist and check NAFDAC registration numbers.</p>
      </div>

      <Panel title={`${results.length} medicines`}>
        {results.length === 0 ? (
          <Empty text="No medicine matched your search." />
        ) : (
          <ul className="divide-y divide-border">
            {results.map((d) => {
              const open = openId === d.id;
              return (
                <li key={d.id} className="py-3">
                  <button
                    onClick={() => setOpenId(open ? null : d.id)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <PillIcon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{d.name}</span>
                      <span className="block text-[11px] text-muted-foreground">{d.brands} · {d.klass}</span>
                    </span>
                    <span className="text-[11px] font-medium text-primary">{open ? "Hide" : "View"}</span>
                  </button>
                  {open ? (
                    <div className="mt-3 space-y-2 rounded-xl bg-secondary p-3 text-xs">
                      <Row label="Used for" value={d.uses} />
                      <Row label="Dosage" value={d.dosage} />
                      <Row label="Side effects" value={d.sideEffects} />
                      <Row label="Warnings" value={d.warning} />
                      <Row label="Typical price" value={d.priceNgn} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold text-secondary-foreground">{label}: </span>
      <span className="text-muted-foreground">{value}</span>
    </p>
  );
}
