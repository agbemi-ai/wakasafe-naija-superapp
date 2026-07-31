import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Wallet as WalletIcon, Plus, Trash2, FileDown } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Screen, Panel, Field, Empty, Stat, Loading } from "@/components/ui-kit";
import { PremiumGate } from "@/components/PremiumGate";
import { useExpenses, useBudget } from "@/hooks/useWakaSafe";
import { isoDay, naira } from "@/lib/storage";
import { exportPdfReport } from "@/lib/pdf";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Health Wallet — Track Medical Expenses in Naira | WakaSafe AI" },
      {
        name: "description",
        content:
          "Track hospital bills, drugs, tests and transport in ₦, set a monthly health budget and export a spending report.",
      },
      { property: "og:title", content: "Health Wallet | WakaSafe AI" },
      { property: "og:description", content: "Medical expense tracking and health budgeting in Naira." },
    ],
  }),
  component: () => (
    <PremiumGate feature="Health Wallet">
      <WalletPage />
    </PremiumGate>
  ),
});

const CATEGORIES = ["Drugs", "Consultation", "Lab test", "Hospital bill", "Transport", "Insurance", "Other"];
const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--primary)", "var(--muted-foreground)"];

function WalletPage() {
  const { items, add, remove, loading } = useExpenses();
  const { value: budget, setValue: setBudget } = useBudget();
  const [form, setForm] = useState({ date: isoDay(), title: "", category: CATEGORIES[0], amount: "" });

  const month = isoDay().slice(0, 7);
  const thisMonth = items.filter((e) => e.date.startsWith(month));
  const spent = thisMonth.reduce((s, e) => s + e.amount, 0);
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    thisMonth.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [thisMonth]);

  return (
    <Screen title="Health Wallet" subtitle="Every Naira spent on your health">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="This month" value={naira(spent)} />
        <Stat label="Budget" value={naira(budget)} />
        <Stat label="Entries" value={items.length} />
      </div>

      <Panel title="Monthly health budget">
        <input
          inputMode="numeric"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value) || 0)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
        />
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full ${pct > 90 ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {pct}% used · {naira(Math.max(0, budget - spent))} left this month
        </p>
      </Panel>

      <Panel title="Add expense">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const amt = Number(form.amount);
            if (!form.title.trim()) return toast.error("What was the expense for?");
            if (!amt || amt <= 0) return toast.error("Enter a valid amount in Naira");
            add({ date: form.date, title: form.title.trim(), category: form.category, amount: amt });
            setForm({ ...form, title: "", amount: "" });
            toast.success("Expense added");
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <Field label="Amount (₦)">
              <input inputMode="numeric" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="5000" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          </div>
          <Field label="Description">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Malaria test at LUTH" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Add expense
          </button>
        </form>
      </Panel>

      <Panel title="Spending breakdown">
        {pieData.length === 0 ? (
          <Empty text="No expenses this month yet." />
        ) : (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={78} paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => naira(v)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>

      <Panel
        title="Transactions"
        right={
          <button
            onClick={() => {
              try {
                exportPdfReport("Health Spending Report", [
                  {
                    heading: "Expenses",
                    rows: items.map((e) => [`${e.date} · ${e.category}`, `${e.title} — ${naira(e.amount)}`]),
                  },
                ]);
              } catch (err) {
                toast.error((err as Error).message);
              }
            }}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <FileDown className="h-4 w-4" /> Export PDF
          </button>
        }
      >
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty text="No expenses recorded." />
        ) : (
          <ul className="divide-y divide-border">
            {items.slice(0, 30).map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2.5">
                <WalletIcon className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-[11px] text-muted-foreground">{e.date} · {e.category}</p>
                </div>
                <span className="text-sm font-semibold">{naira(e.amount)}</span>
                <button onClick={() => remove(e.id)} aria-label="Delete" className="p-2 text-muted-foreground">
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
