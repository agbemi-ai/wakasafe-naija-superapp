import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarHeart, Plus, Trash2, Bell } from "lucide-react";
import { Screen, Panel, Field, Empty, Stat, Loading } from "@/components/ui-kit";
import { PremiumGate } from "@/components/PremiumGate";
import { usePeriodLogs } from "@/hooks/useWakaSafe";
import { isoDay, watDate } from "@/lib/storage";

export const Route = createFileRoute("/period")({
  head: () => ({
    meta: [
      { title: "Period & Fertility Tracker — Cycle Predictions | WakaSafe AI" },
      {
        name: "description",
        content:
          "Log your period, see your next period and fertile window predictions, and get gentle reminders.",
      },
      { property: "og:title", content: "Period & Fertility Tracker | WakaSafe AI" },
      { property: "og:description", content: "Cycle logging, predictions and reminders." },
    ],
  }),
  component: () => (
    <PremiumGate feature="Period & Fertility Tracker">
      <PeriodPage />
    </PremiumGate>
  ),
});

const FLOWS = ["Light", "Medium", "Heavy"];

function PeriodPage() {
  const { items, add, remove, loading } = usePeriodLogs();
  const [form, setForm] = useState({ start: isoDay(), end: "", flow: "Medium", symptoms: "" });

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.start.localeCompare(a.start)),
    [items],
  );

  const stats = useMemo(() => {
    if (sorted.length < 2) return { cycle: 28, next: null as string | null, fertile: null as string | null };
    const gaps: number[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = new Date(sorted[i].start).getTime();
      const b = new Date(sorted[i + 1].start).getTime();
      gaps.push(Math.round((a - b) / 86400000));
    }
    const cycle = Math.max(21, Math.min(40, Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length)));
    const last = new Date(sorted[0].start);
    const next = new Date(last.getTime() + cycle * 86400000);
    const ovulation = new Date(next.getTime() - 14 * 86400000);
    const fertileStart = new Date(ovulation.getTime() - 4 * 86400000);
    return {
      cycle,
      next: next.toISOString().slice(0, 10),
      fertile: `${fertileStart.toISOString().slice(0, 10)} → ${ovulation.toISOString().slice(0, 10)}`,
    };
  }, [sorted]);

  return (
    <Screen title="Period & Fertility" subtitle="Know your cycle, plan with confidence">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Avg cycle" value={`${stats.cycle}d`} />
        <Stat label="Next period" value={stats.next ? watDate(stats.next) : "—"} />
        <Stat label="Logged" value={items.length} />
      </div>

      <Panel title="Fertile window">
        <p className="text-sm">
          {stats.fertile ? (
            <>
              <CalendarHeart className="mr-1 inline h-4 w-4 text-primary" />
              {stats.fertile}
            </>
          ) : (
            <span className="text-muted-foreground">Log at least 2 cycles to see predictions.</span>
          )}
        </p>
        <p className="mt-2 flex items-start gap-2 rounded-xl bg-secondary p-3 text-[11px] text-muted-foreground">
          <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          Reminders are on: 2 days before your period and on your first fertile day.
        </p>
      </Panel>

      <Panel title="Log a period">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.start) return toast.error("Choose a start date");
            if (form.end && form.end < form.start) return toast.error("End date is before start date");
            add({ start: form.start, end: form.end || undefined, flow: form.flow, symptoms: form.symptoms || undefined });
            setForm({ start: isoDay(), end: "", flow: "Medium", symptoms: "" });
            toast.success("Cycle logged");
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <Field label="End date">
              <input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          </div>
          <Field label="Flow">
            <select value={form.flow} onChange={(e) => setForm({ ...form, flow: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
              {FLOWS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label="Symptoms (optional)">
            <input value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} placeholder="Cramps, headache…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Save cycle
          </button>
        </form>
      </Panel>

      <Panel title="Cycle history">
        {loading ? (
          <Loading />
        ) : sorted.length === 0 ? (
          <Empty text="No cycles logged yet." />
        ) : (
          <ul className="divide-y divide-border">
            {sorted.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <CalendarHeart className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.start}{p.end ? ` → ${p.end}` : ""}</p>
                  <p className="text-[11px] text-muted-foreground">{p.flow} flow{p.symptoms ? ` · ${p.symptoms}` : ""}</p>
                </div>
                <button onClick={() => remove(p.id)} aria-label="Delete" className="p-2 text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Screen>
  );
}
