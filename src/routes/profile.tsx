import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, IdCard, Phone, FileDown } from "lucide-react";
import { Screen, Panel, Field, Empty, Loading } from "@/components/ui-kit";
import { useProfile, useEmergencyContacts } from "@/hooks/useWakaSafe";
import { exportPdfReport } from "@/lib/pdf";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Medical Profile — Blood Group & Emergency Contacts | WakaSafe AI" },
      {
        name: "description",
        content:
          "Keep your blood group, genotype, allergies and emergency contacts ready for any Nigerian hospital.",
      },
      { property: "og:title", content: "Medical Profile | WakaSafe AI" },
      { property: "og:description", content: "Your medical ID and emergency contacts in one place." },
    ],
  }),
  component: ProfilePage,
});

const BLOOD = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENOTYPE = ["", "AA", "AS", "SS", "AC", "SC"];
const CITIES = ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan", "Enugu", "Kaduna", "Benin City"];

function ProfilePage() {
  const { value: profile, setValue: setProfile, loading } = useProfile();
  const { items: contacts, add, remove, loading: cLoading } = useEmergencyContacts();
  const [contact, setContact] = useState({ name: "", phone: "", relation: "Family" });

  const set = (k: keyof typeof profile, v: string) => setProfile({ ...profile, [k]: v });

  return (
    <Screen title="My Profile" subtitle="Your medical ID for emergencies">
      <Panel
        title="Medical ID card"
        right={
          <button
            onClick={() => {
              try {
                exportPdfReport("WakaSafe Medical ID", [
                  {
                    heading: "Personal",
                    rows: [
                      ["Name", profile.name || "—"],
                      ["Phone", profile.phone || "—"],
                      ["Date of birth", profile.dob || "—"],
                      ["City", profile.city || "—"],
                    ],
                  },
                  {
                    heading: "Medical",
                    rows: [
                      ["Blood group", profile.bloodGroup || "—"],
                      ["Genotype", profile.genotype || "—"],
                      ["Allergies", profile.allergies || "None recorded"],
                      ["Conditions", profile.conditions || "None recorded"],
                    ],
                  },
                  {
                    heading: "Emergency contacts",
                    rows: contacts.map((c) => [`${c.name} (${c.relation})`, c.phone]),
                  },
                ]);
              } catch (err) {
                toast.error((err as Error).message);
              }
            }}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <FileDown className="h-4 w-4" /> Export
          </button>
        }
      >
        <div className="hero-gradient rounded-2xl p-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            <p className="text-sm font-semibold">{profile.name || "Add your name"}</p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ["Blood", profile.bloodGroup || "—"],
              ["Genotype", profile.genotype || "—"],
              ["City", profile.city || "—"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-white/15 py-2">
                <p className="text-[10px] opacity-85">{l}</p>
                <p className="text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] opacity-90">
            Allergies: {profile.allergies || "None recorded"}
          </p>
        </div>
      </Panel>

      <Panel title="Personal details">
        {loading ? (
          <Loading />
        ) : (
          <div className="space-y-3">
            <Field label="Full name">
              <input value={profile.name} onChange={(e) => set("name", e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone">
                <input value={profile.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
              </Field>
              <Field label="Date of birth">
                <input type="date" value={profile.dob} onChange={(e) => set("dob", e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Blood group">
                <select value={profile.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                  {BLOOD.map((b) => (
                    <option key={b} value={b}>{b || "Select"}</option>
                  ))}
                </select>
              </Field>
              <Field label="Genotype">
                <select value={profile.genotype} onChange={(e) => set("genotype", e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                  {GENOTYPE.map((g) => (
                    <option key={g} value={g}>{g || "Select"}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="City">
              <select value={profile.city} onChange={(e) => set("city", e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Allergies">
              <input value={profile.allergies} onChange={(e) => set("allergies", e.target.value)} placeholder="Penicillin, peanuts…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <Field label="Existing conditions">
              <input value={profile.conditions} onChange={(e) => set("conditions", e.target.value)} placeholder="Hypertension, asthma…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <Field label="Home address">
              <input value={profile.address} onChange={(e) => set("address", e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          </div>
        )}
      </Panel>

      <Panel title="Emergency contacts">
        {cLoading ? (
          <Loading />
        ) : contacts.length === 0 ? (
          <Empty text="Add at least 3 contacts to boost your safety score." />
        ) : (
          <ul className="divide-y divide-border">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-2.5">
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.relation} · {c.phone}</p>
                </div>
                <a href={`tel:${c.phone}`} aria-label={`Call ${c.name}`} className="rounded-lg bg-primary p-2 text-primary-foreground">
                  <Phone className="h-4 w-4" />
                </a>
                <button onClick={() => remove(c.id)} aria-label="Delete contact" className="p-2 text-muted-foreground">
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
            if (!contact.name.trim() || contact.phone.trim().length < 7)
              return toast.error("Enter a name and valid phone number");
            add({ name: contact.name.trim(), phone: contact.phone.trim(), relation: contact.relation });
            setContact({ name: "", phone: "", relation: "Family" });
            toast.success("Contact added");
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
            <Field label="Phone">
              <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+234…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
            </Field>
          </div>
          <Field label="Relationship">
            <select value={contact.relation} onChange={(e) => setContact({ ...contact, relation: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
              {["Family", "Spouse", "Parent", "Sibling", "Friend", "Doctor", "Neighbour"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Add contact
          </button>
        </form>
      </Panel>
    </Screen>
  );
}
