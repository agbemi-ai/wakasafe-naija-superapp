import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Plus, ShieldCheck, Trash2, Navigation, Loader2 } from "lucide-react";
import { Screen, Panel, Field, Empty, Loading } from "@/components/ui-kit";
import { PremiumGate } from "@/components/PremiumGate";
import { useFamily } from "@/hooks/useWakaSafe";
import { watTime } from "@/lib/storage";

export const Route = createFileRoute("/family")({
  head: () => ({
    meta: [
      { title: "Family Locator — Live Location & Check-in | WakaSafe AI" },
      {
        name: "description",
        content:
          "Share live location with family across Lagos, Abuja and beyond, and send an instant I'm Safe check-in.",
      },
      { property: "og:title", content: "Family Locator | WakaSafe AI" },
      { property: "og:description", content: "Live family location sharing and I'm Safe check-in." },
    ],
  }),
  component: () => (
    <PremiumGate feature="Family Locator">
      <FamilyPage />
    </PremiumGate>
  ),
});

function FamilyPage() {
  const { items, add, update, remove, loading } = useFamily();
  const [form, setForm] = useState({ name: "", relation: "", area: "" });
  const [locating, setLocating] = useState(false);
  const [myLocation, setMyLocation] = useState<string | null>(null);

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Enter the family member's name");
    add({
      name: form.name.trim(),
      relation: form.relation.trim() || "Family",
      area: form.area.trim() || "Location pending",
      lat: 6.5 + Math.random() * 3,
      lng: 3.3 + Math.random() * 4,
      sharing: true,
      lastCheckIn: null,
      status: "unknown",
    });
    setForm({ name: "", relation: "", area: "" });
    toast.success("Family member invited");
  };

  const checkIn = () => {
    setLocating(true);
    if (!("geolocation" in navigator)) {
      setLocating(false);
      toast.error("Location is not available on this device");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setMyLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        toast.success("“I'm Safe” sent to your family with your location");
      },
      () => {
        setLocating(false);
        toast.error("Could not get your location. Check location permission.");
      },
      { timeout: 8000 },
    );
  };

  return (
    <Screen title="Family Locator" subtitle="See where your people are, in real time">
      <Panel>
        <button
          onClick={checkIn}
          disabled={locating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {locating ? "Getting your location…" : "I'm Safe — check in now"}
        </button>
        {myLocation ? (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Shared at {watTime()} WAT · {myLocation}
          </p>
        ) : null}
      </Panel>

      <Panel title="Family map">
        <div className="relative h-48 overflow-hidden rounded-xl bg-secondary">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:24px_24px]" />
          {items.slice(0, 6).map((m, i) => (
            <div
              key={m.id}
              className="absolute flex flex-col items-center"
              style={{ left: `${12 + ((i * 29) % 74)}%`, top: `${18 + ((i * 37) % 60)}%` }}
            >
              <MapPin className="h-6 w-6 text-primary" />
              <span className="rounded-full bg-card px-2 py-0.5 text-[10px] font-medium shadow">
                {m.name.split(" ")[0]}
              </span>
            </div>
          ))}
          {items.length === 0 ? (
            <p className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
              Add family members to see them here
            </p>
          ) : null}
        </div>
      </Panel>

      <Panel title="Family members">
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty text="No family members yet." />
        ) : (
          <ul className="divide-y divide-border">
            {items.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                  {m.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.name} <span className="text-[11px] text-muted-foreground">· {m.relation}</span></p>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Navigation className="h-3 w-3" /> {m.area}
                    {m.lastCheckIn ? ` · safe ${watTime(new Date(m.lastCheckIn))} WAT` : ""}
                  </p>
                </div>
                <button
                  onClick={() =>
                    update(m.id, { status: "safe", lastCheckIn: new Date().toISOString() })
                  }
                  className="rounded-lg bg-secondary px-2 py-1 text-[11px] font-semibold text-primary"
                >
                  Ping
                </button>
                <button onClick={() => remove(m.id)} aria-label="Remove" className="p-2 text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Invite family">
        <form onSubmit={addMember} className="space-y-3">
          <Field label="Name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" placeholder="e.g. Aunty Ngozi" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Relation">
              <input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" placeholder="Sister" />
            </Field>
            <Field label="Area">
              <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" placeholder="Ikeja, Lagos" />
            </Field>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Add member
          </button>
        </form>
      </Panel>
    </Screen>
  );
}
