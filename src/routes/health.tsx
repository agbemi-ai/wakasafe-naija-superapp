import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FileDown, Plus, Trash2 } from "lucide-react";
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
import { useHealthLogs, type VitalLog } from "@/hooks/useWakaSafe";
import { isoDay } from "@/lib/storage";
import { exportPdfReport } from "@/lib/pdf";
import { usePremium } from "@/lib/premium";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health Tracker — Log BP, Sugar & Weight | WakaSafe AI" },
      {
        name: "description",
        content:
          "Track blood pressure, blood sugar, weight and symptoms, view trend charts and export a PDF report for your doctor.",
      },
      { property: "og:title", content: "Health Tracker | WakaSafe AI" },
      {
        property: "og:description",
        content: "Log BP, sugar, weight and symptoms with charts and PDF export.",
      },
    ],
  }),
  component: HealthPage,
});

type Tab = "bp" | "sugar" | "weight" | "symptom";
const LABELS: Record<Tab, string> = {
  bp: "Blood Pressure",
  sugar: "Blood Sugar",
  weight: "Weight",
  symptom: "Symptoms",
};

function HealthPage() {
  const { items, byType, add, remove, loading } = useHealthLogs();
  const { isPremium, openPaywall } = usePremium();
  const [tab, setTab] = useState<Tab>("bp");
  const [form, setForm] = useState({
    date: isoDay(),
    systolic: "",
    diastolic: "",
    sugar: "",
    weight: "",
    symptom: "",
    severity: "3",
    note: "",
  });
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const base: Omit<VitalLog, "id"> = { date: form.date, type: tab, note: form.note || undefined };
    if (tab === "bp") {
      const s = Number(form.systolic);
      const d = Number(form.diastolic);
      if (!s || !d) return setError("Enter both systolic and diastolic values.");
      if (s < 60 || s > 260 || d < 30 || d > 180)
        return setError("Those BP values look out of range. Please check again.");
      add({ ...base, systolic: s, diastolic: d });
    } else if (tab === "sugar") {
      const v = Number(form.sugar);
      if (!v) return setError("Enter your blood sugar reading (mg/dL).");
      add({ ...base, sugar: v });
    } else if (tab === "weight") {
      const v = Number(form.weight);
      if (!v) return setError("Enter your weight in kg.");
      add({ ...base, weight: v });
    } else {
      if (!form.symptom.trim()) return setError("Describe the symptom you feel.");
      add({ ...base, symptom: form.symptom.trim(), severity: Number(form.severity) });
    }
    toast.success(`${LABELS[tab]} logged`);
    setForm((f) => ({ ...f, systolic: "", diastolic: "", sugar: "", weight: "", symptom: "", note: "" }));
  };

  const chart = [...byType[tab]]
    .filter((l) => l.type !== "symptom")
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((l) => ({
      date: l.date.slice(5),
      a: tab === "bp" ? l.systolic : tab === "sugar" ? l.sugar : l.weight,
      b: tab === "bp" ? l.diastolic : undefined,
    }));

  const exportPdf = () => {
    if (!isPremium) return openPaywall("Export health reports to PDF");
    try {
      exportPdfReport("Health Report", [
        {
          heading: "All logs",
          rows: items.map((l) => [
            `${l.date} · ${LABELS[l.type]}`,
            l.type === "bp"
              ? `${l.systolic}/${l.diastolic} mmHg`
              : l.type === "sugar"
                ? `${l.sugar} mg/dL`
                : l.type === "weight"
                  ? `${l.weight} kg`
                  : `${l.symptom} (severity ${l.severity}/5)`,
          ]),
        },
      ]);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const latestBp = byType.bp[0];

  return (
    <Screen title="Health Tracker" subtitle="Log your vitals and spot trends early">
      <Panel>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(LABELS) as Tab[]).map((t) => (
            <Pill key={t} active={tab === t} onClick={() => setTab(t)}>
              {LABELS[t]}
            </Pill>
          ))}
        </div>
      </Panel>

      <Panel title={`Log ${LABELS[tab]}`}>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
            />
          </Field>

          {tab === "bp" ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Systolic (mmHg)">
                <input inputMode="numeric" value={form.systolic} onChange={(e) => setForm({ ...form, systolic: e.target.value })} placeholder="120" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
              </Field>
              <Field label="Diastolic (mmHg)">
                <input inputMode="numeric" value={form.diastolic} onChange={(e) => setForm({ ...form, diastolic: e.target.value })} placeholder="80" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
              </Field>
            </div>
          ) : null}

          {tab === "sugar" ? (
            <Field label="Blood sugar (mg/dL)">
              <input inputMode="numeric" value={form.sugar} onChange={(e) => setForm({ ...form, sugar: e.target.value })} placeholder="95" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          ) : null}

          {tab === "weight" ? (
            <Field label="Weight (kg)">
              <input inputMode="decimal" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="72.5" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          ) : null}

          {tab === "symptom" ? (
            <>
              <Field label="Symptom">
                <input value={form.symptom} onChange={(e) => setForm({ ...form, symptom: e.target.value })} placeholder="Headache, fever…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
              </Field>
              <Field label={`Severity: ${form.severity}/5`}>
                <input type="range" min={1} max={5} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="w-full accent-[var(--primary)]" />
              </Field>
            </>
          ) : null}

          <Field label="Note (optional)">
            <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>

          {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Save entry
          </button>
        </form>
      </Panel>

      {latestBp ? (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Last BP" value={`${latestBp.systolic}/${latestBp.diastolic}`} hint="mmHg" />
          <Stat label="Sugar" value={byType.sugar[0]?.sugar ?? "—"} hint="mg/dL" />
          <Stat label="Weight" value={byType.weight[0]?.weight ?? "—"} hint="kg" />
        </div>
      ) : null}

      {tab !== "symptom" ? (
        <Panel title={`${LABELS[tab]} trend`}>
          {loading ? (
            <Loading />
          ) : chart.length < 2 ? (
            <Empty text="Add at least 2 entries to see your chart." />
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={11} stroke="var(--muted-foreground)" width={34} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="a" stroke="var(--chart-1)" strokeWidth={2} dot />
                  {tab === "bp" ? (
                    <Line type="monotone" dataKey="b" stroke="var(--chart-2)" strokeWidth={2} dot />
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>
      ) : null}

      <Panel
        title="History"
        right={
          <button onClick={exportPdf} className="flex items-center gap-1 text-xs font-semibold text-primary">
            <FileDown className="h-4 w-4" /> Export PDF
          </button>
        }
      >
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty text="No health entries yet." />
        ) : (
          <ul className="divide-y divide-border">
            {items.slice(0, 25).map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2.5">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {l.type === "bp"
                      ? `${l.systolic}/${l.diastolic} mmHg`
                      : l.type === "sugar"
                        ? `${l.sugar} mg/dL`
                        : l.type === "weight"
                          ? `${l.weight} kg`
                          : `${l.symptom} · ${l.severity}/5`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {l.date} · {LABELS[l.type]}
                    {l.note ? ` · ${l.note}` : ""}
                  </p>
                </div>
                <button onClick={() => remove(l.id)} aria-label="Delete entry" className="p-2 text-muted-foreground">
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
