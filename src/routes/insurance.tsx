import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Plus, Trash2, Check } from "lucide-react";
import { Screen, Panel, Field, Empty, Loading } from "@/components/ui-kit";
import { PremiumGate } from "@/components/PremiumGate";
import { usePolicies } from "@/hooks/useWakaSafe";
import { useStore, naira } from "@/lib/storage";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance — NHIS & HMO Policy Wallet | WakaSafe AI" },
      {
        name: "description",
        content:
          "Store your NHIS, HMO and private health insurance details and work through a claim checklist step by step.",
      },
      { property: "og:title", content: "Insurance | WakaSafe AI" },
      { property: "og:description", content: "NHIS and private insurance details with a claim checklist." },
    ],
  }),
  component: () => (
    <PremiumGate feature="Insurance">
      <InsurancePage />
    </PremiumGate>
  ),
});

const CHECKLIST = [
  "Confirm the hospital is on your HMO/NHIS provider list",
  "Obtain a code or authorisation from your HMO before treatment",
  "Keep original receipts and the treatment invoice",
  "Collect a signed medical report from the doctor",
  "Photocopy your ID card and policy card",
  "Submit the claim form within 30 days of treatment",
  "Follow up with the HMO and note the claim reference number",
];

function InsurancePage() {
  const { items, add, remove, loading } = usePolicies();
  const { value: checked, setValue: setChecked } = useStore<string[]>("insurance:checklist", []);
  const [form, setForm] = useState({
    provider: "",
    type: "NHIS" as "NHIS" | "Private" | "HMO",
    policyNumber: "",
    hospital: "",
    expiry: "",
    premium: "",
  });

  return (
    <Screen title="Insurance" subtitle="Your cover, always within reach">
      <Panel title="My policies">
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty text="No policy saved yet." />
        ) : (
          <ul className="space-y-3">
            {items.map((p) => (
              <li key={p.id} className="rounded-xl bg-secondary p-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.provider}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {p.type} · No. {p.policyNumber || "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Primary hospital: {p.hospital || "—"} · Expires {p.expiry || "—"}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {naira(p.premium)} / year
                    </p>
                  </div>
                  <button onClick={() => remove(p.id)} aria-label="Delete policy" className="p-1 text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Add policy">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.provider.trim()) return toast.error("Enter the provider name");
            add({
              provider: form.provider.trim(),
              type: form.type,
              policyNumber: form.policyNumber.trim(),
              hospital: form.hospital.trim(),
              expiry: form.expiry,
              premium: Number(form.premium) || 0,
            });
            setForm({ provider: "", type: "NHIS", policyNumber: "", hospital: "", expiry: "", premium: "" });
            toast.success("Policy saved");
          }}
        >
          <Field label="Provider">
            <input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="e.g. Hygeia HMO" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <option value="NHIS">NHIS</option>
                <option value="HMO">HMO</option>
                <option value="Private">Private</option>
              </select>
            </Field>
            <Field label="Policy number">
              <input value={form.policyNumber} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          </div>
          <Field label="Primary hospital">
            <input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry">
              <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <Field label="Annual premium (₦)">
              <input inputMode="numeric" value={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Save policy
          </button>
        </form>
      </Panel>

      <Panel title={`Claim checklist · ${checked.length}/${CHECKLIST.length}`}>
        <ul className="space-y-2">
          {CHECKLIST.map((c) => {
            const on = checked.includes(c);
            return (
              <li key={c}>
                <button
                  onClick={() => setChecked(on ? checked.filter((x) => x !== c) : [...checked, c])}
                  className="flex w-full items-start gap-3 rounded-xl bg-secondary p-3 text-left"
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
                    {on ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className={`text-xs ${on ? "line-through opacity-60" : ""}`}>{c}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>
    </Screen>
  );
}
