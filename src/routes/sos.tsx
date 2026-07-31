import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Phone, Siren, MapPin, PhoneCall, Loader2, Plus, Trash2 } from "lucide-react";
import { Screen, Panel, Field, Empty } from "@/components/ui-kit";
import { useEmergencyContacts, useProfile } from "@/hooks/useWakaSafe";
import { EMERGENCY_NUMBERS } from "@/lib/data";
import { watTime } from "@/lib/storage";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "SOS Emergency — Call 112 & Alert Contacts | WakaSafe AI" },
      {
        name: "description",
        content:
          "One tap to call 112 or 199, send your live location to 3 emergency contacts, or trigger a fake call to escape danger.",
      },
      { property: "og:title", content: "SOS Emergency | WakaSafe AI" },
      { property: "og:description", content: "Call 112/199, alert contacts and trigger a fake call." },
    ],
  }),
  component: SosPage,
});

function SosPage() {
  const { items: contacts, add, remove } = useEmergencyContacts();
  const { value: profile } = useProfile();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [fakeCall, setFakeCall] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", relation: "" });

  const triggerSos = () => {
    setSending(true);
    const finish = (coords: string) => {
      setSending(false);
      setSent(coords);
      toast.success(`Alert sent to ${Math.min(3, contacts.length)} contact(s)`);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.([200, 100, 200]);
    };
    if (!("geolocation" in navigator)) return finish("Location unavailable");
    navigator.geolocation.getCurrentPosition(
      (p) => finish(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`),
      () => finish("Location permission denied"),
      { timeout: 8000 },
    );
  };

  return (
    <Screen title="SOS Emergency" subtitle="Help is one tap away — 24/7 across Nigeria">
      <Panel>
        <button
          onClick={triggerSos}
          disabled={sending}
          className="mx-auto flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-full bg-destructive text-destructive-foreground shadow-[var(--shadow-float)] active:scale-95"
        >
          {sending ? <Loader2 className="h-8 w-8 animate-spin" /> : <Siren className="h-9 w-9" />}
          <span className="text-lg font-bold">{sending ? "SENDING" : "SOS"}</span>
          <span className="text-[10px] opacity-90">Tap to alert</span>
        </button>
        {sent ? (
          <p className="mt-3 flex items-center justify-center gap-1 text-center text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> Location {sent} shared at {watTime()} WAT
          </p>
        ) : null}
      </Panel>

      <div className="grid grid-cols-2 gap-3">
        <a href="tel:112" className="flex flex-col items-center gap-1 rounded-2xl bg-destructive p-4 text-destructive-foreground">
          <Phone className="h-5 w-5" />
          <span className="text-lg font-bold">112</span>
          <span className="text-[10px]">National emergency</span>
        </a>
        <a href="tel:199" className="flex flex-col items-center gap-1 rounded-2xl bg-foreground p-4 text-background">
          <Phone className="h-5 w-5" />
          <span className="text-lg font-bold">199</span>
          <span className="text-[10px]">Police</span>
        </a>
      </div>

      <Panel title="Fake call — escape unsafe situations">
        <button
          onClick={() => setFakeCall(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground"
        >
          <PhoneCall className="h-4 w-4" /> Trigger fake call in 3 seconds
        </button>
      </Panel>

      <Panel title="Nigerian emergency lines">
        <ul className="divide-y divide-border">
          {EMERGENCY_NUMBERS.map((n) => (
            <li key={n.label + n.number} className="flex items-center gap-3 py-2.5">
              <div className="flex-1">
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-[11px] text-muted-foreground">{n.note}</p>
              </div>
              <a href={`tel:${n.number}`} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                {n.number}
              </a>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={`Emergency contacts (${contacts.length}/3 used)`}>
        {contacts.length === 0 ? (
          <Empty text="Add up to 3 people who should be alerted." />
        ) : (
          <ul className="divide-y divide-border">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-2.5">
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.relation} · {c.phone}</p>
                </div>
                <a href={`tel:${c.phone}`} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">Call</a>
                <button onClick={() => remove(c.id)} aria-label="Remove contact" className="p-2 text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (contacts.length >= 3) return toast.error("You can store 3 emergency contacts");
            if (!form.name.trim() || form.phone.trim().length < 7)
              return toast.error("Enter a name and a valid phone number");
            add({ name: form.name.trim(), phone: form.phone.trim(), relation: form.relation.trim() || "Family" });
            setForm({ name: "", phone: "", relation: "" });
            toast.success("Contact saved");
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+2348…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          </div>
          <Field label="Relation">
            <input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Add contact
          </button>
        </form>
      </Panel>

      <Panel title="Medical info responders will see">
        <p className="text-xs text-muted-foreground">
          {profile.name || "Add your name"} · Blood group {profile.bloodGroup || "—"} · Genotype{" "}
          {profile.genotype || "—"} · Allergies: {profile.allergies || "none recorded"}
        </p>
      </Panel>

      {fakeCall ? <FakeCall onEnd={() => setFakeCall(false)} /> : null}
    </Screen>
  );
}

function FakeCall({ onEnd }: { onEnd: () => void }) {
  const [ringing, setRinging] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRinging(true), 3000);
    return () => clearTimeout(t);
  }, []);
  if (!ringing) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-foreground px-6 py-16 text-background">
      <div className="text-center">
        <p className="text-sm opacity-70">Incoming call · WAT {watTime()}</p>
        <h2 className="mt-3 text-3xl font-semibold">Dr. Adeyemi</h2>
        <p className="mt-1 text-sm opacity-70">mobile +234 803 000 0000</p>
      </div>
      <div className="flex w-full items-center justify-around">
        <button onClick={onEnd} className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground" aria-label="Decline">
          <Phone className="h-6 w-6 rotate-[135deg]" />
        </button>
        <button onClick={onEnd} className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-label="Answer">
          <Phone className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
