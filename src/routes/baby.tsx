import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Baby, Plus, Trash2, Syringe, Star, Moon, Milk } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Screen, Panel, Field, Pill, Empty, Loading, Stat } from "@/components/ui-kit";
import { PremiumGate } from "@/components/PremiumGate";
import { useCreateGrowthLog } from "@/hooks/useCreateGrowthLog";
import { useVaccines, useMilestones, useFeedLogs } from "@/hooks/useWakaSafe";
import { isoDay, watTime } from "@/lib/storage";

export const Route = createFileRoute("/baby")({
  head: () => ({
    meta: [
      { title: "Baby Care — Growth, Vaccines & Milestones | WakaSafe AI" },
      {
        name: "description",
        content:
          "Track baby growth, the Nigerian NPI vaccination schedule, milestones and feed or sleep logs in one place.",
      },
      { property: "og:title", content: "Baby Care | WakaSafe AI" },
      {
        property: "og:description",
        content: "Growth charts, NPI vaccine schedule, milestones and feed logs.",
      },
    ],
  }),
  component: () => (
    <PremiumGate feature="Baby Care">
      <BabyPage />
    </PremiumGate>
  ),
});

type Tab = "growth" | "vaccines" | "milestones" | "logs";

function BabyPage() {
  const [tab, setTab] = useState<Tab>("growth");
  return (
    <Screen title="Baby Care" subtitle="Growth, vaccines, milestones & daily logs">
      <Panel>
        <div className="flex flex-wrap gap-2">
          <Pill active={tab === "growth"} onClick={() => setTab("growth")}>Growth</Pill>
          <Pill active={tab === "vaccines"} onClick={() => setTab("vaccines")}>Vaccines</Pill>
          <Pill active={tab === "milestones"} onClick={() => setTab("milestones")}>Milestones</Pill>
          <Pill active={tab === "logs"} onClick={() => setTab("logs")}>Feed / Sleep</Pill>
        </div>
      </Panel>
      {tab === "growth" ? <Growth /> : null}
      {tab === "vaccines" ? <Vaccines /> : null}
      {tab === "milestones" ? <Milestones /> : null}
      {tab === "logs" ? <FeedSleep /> : null}
    </Screen>
  );
}

function Growth() {
  const { logs, createGrowthLog, deleteGrowthLog, chartData, latest, loading } =
    useCreateGrowthLog();
  const [form, setForm] = useState({ date: isoDay(), weightKg: "", heightCm: "", headCm: "", note: "" });
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Number(form.weightKg);
    const h = Number(form.heightCm);
    if (!w || !h) {
      setError("Enter both weight (kg) and height (cm).");
      return;
    }
    if (w > 40 || h > 140) {
      setError("Those values look too high for a baby. Please check.");
      return;
    }
    setError(null);
    createGrowthLog({
      date: form.date,
      weightKg: w,
      heightCm: h,
      headCm: form.headCm ? Number(form.headCm) : undefined,
      note: form.note,
    });
    toast.success("Growth log saved");
    setForm({ ...form, weightKg: "", heightCm: "", headCm: "", note: "" });
  };

  return (
    <>
      <Panel title="Add growth measurement">
        <form onSubmit={submit} className="space-y-3">
          <Field label="Date">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight (kg)">
              <input inputMode="decimal" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} placeholder="6.4" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <Field label="Height (cm)">
              <input inputMode="decimal" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} placeholder="62" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          </div>
          <Field label="Head circumference (cm, optional)">
            <input inputMode="decimal" value={form.headCm} onChange={(e) => setForm({ ...form, headCm: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
          {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Save growth log
          </button>
        </form>
      </Panel>

      {latest ? (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Weight" value={`${latest.weightKg}kg`} />
          <Stat label="Height" value={`${latest.heightCm}cm`} />
          <Stat label="Entries" value={logs.length} />
        </div>
      ) : null}

      <Panel title="Growth curve">
        {loading ? (
          <Loading />
        ) : chartData.length < 2 ? (
          <Empty text="Add two measurements to see the curve." />
        ) : (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--muted-foreground)" width={34} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="var(--chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="height" stroke="var(--chart-2)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>

      <Panel title="History">
        {logs.length === 0 ? (
          <Empty text="No growth logs yet." />
        ) : (
          <ul className="divide-y divide-border">
            {[...logs].reverse().map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2.5">
                <Baby className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{l.weightKg}kg · {l.heightCm}cm{l.headCm ? ` · head ${l.headCm}cm` : ""}</p>
                  <p className="text-[11px] text-muted-foreground">{l.date}{l.note ? ` · ${l.note}` : ""}</p>
                </div>
                <button onClick={() => deleteGrowthLog(l.id)} aria-label="Delete" className="p-2 text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

function Vaccines() {
  const { value, setValue, loading } = useVaccines();
  if (loading) return <Loading />;
  const done = value.filter((v) => v.done).length;
  return (
    <Panel title={`NPI schedule · ${done}/${value.length} taken`}>
      <ul className="divide-y divide-border">
        {value.map((v) => (
          <li key={v.id} className="flex items-center gap-3 py-3">
            <Syringe className={v.done ? "h-4 w-4 text-primary" : "h-4 w-4 text-muted-foreground"} />
            <div className="flex-1">
              <p className="text-sm font-medium">{v.name}</p>
              <p className="text-[11px] text-muted-foreground">
                Due: {v.dueAge}{v.date ? ` · given ${v.date}` : ""}
              </p>
            </div>
            <input
              type="checkbox"
              checked={v.done}
              aria-label={`Mark ${v.name} as given`}
              onChange={(e) =>
                setValue(
                  value.map((x) =>
                    x.id === v.id
                      ? { ...x, done: e.target.checked, date: e.target.checked ? isoDay() : undefined }
                      : x,
                  ),
                )
              }
              className="h-5 w-5 accent-[var(--primary)]"
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function Milestones() {
  const { value, setValue, loading } = useMilestones();
  if (loading) return <Loading />;
  return (
    <Panel title="Milestones">
      <ul className="divide-y divide-border">
        {value.map((m) => (
          <li key={m.id} className="flex items-center gap-3 py-3">
            <Star className={m.done ? "h-4 w-4 text-premium" : "h-4 w-4 text-muted-foreground"} />
            <div className="flex-1">
              <p className="text-sm font-medium">{m.name}</p>
              {m.date ? <p className="text-[11px] text-muted-foreground">Achieved {m.date}</p> : null}
            </div>
            <input
              type="checkbox"
              checked={m.done}
              aria-label={`Mark ${m.name} achieved`}
              onChange={(e) =>
                setValue(
                  value.map((x) =>
                    x.id === m.id
                      ? { ...x, done: e.target.checked, date: e.target.checked ? isoDay() : undefined }
                      : x,
                  ),
                )
              }
              className="h-5 w-5 accent-[var(--primary)]"
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function FeedSleep() {
  const { items, add, remove, loading } = useFeedLogs();
  const [detail, setDetail] = useState("");

  const log = (kind: "feed" | "sleep") => {
    add({ at: new Date().toISOString(), kind, detail: detail.trim() || (kind === "feed" ? "Breastfeed" : "Nap") });
    setDetail("");
    toast.success(kind === "feed" ? "Feed logged" : "Sleep logged");
  };

  return (
    <>
      <Panel title="Quick log">
        <input
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Detail e.g. 120ml formula / 2h nap"
          className="mb-3 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
        />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => log("feed")} className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Milk className="h-4 w-4" /> Feed
          </button>
          <button onClick={() => log("sleep")} className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground">
            <Moon className="h-4 w-4" /> Sleep
          </button>
        </div>
      </Panel>
      <Panel title="Today's logs">
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty text="No feed or sleep logs yet." />
        ) : (
          <ul className="divide-y divide-border">
            {items.slice(0, 30).map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2.5">
                {l.kind === "feed" ? <Milk className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{l.kind} · {l.detail}</p>
                  <p className="text-[11px] text-muted-foreground">{watTime(new Date(l.at))} WAT</p>
                </div>
                <button onClick={() => remove(l.id)} aria-label="Delete" className="p-2 text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
