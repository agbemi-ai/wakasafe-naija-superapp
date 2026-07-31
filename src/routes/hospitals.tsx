import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Hospital, MapPin, Phone, Clock, Search } from "lucide-react";
import { Screen, Panel, Pill, Empty } from "@/components/ui-kit";
import { FACILITIES } from "@/lib/data";

export const Route = createFileRoute("/hospitals")({
  head: () => ({
    meta: [
      { title: "Hospital Finder — Nearby Hospitals & Pharmacies in Nigeria | WakaSafe AI" },
      {
        name: "description",
        content:
          "Find hospitals, clinics and pharmacies in Lagos, Abuja, Ibadan, Kano and Enugu. Filter by 24/7 and emergency care.",
      },
      { property: "og:title", content: "Hospital Finder | WakaSafe AI" },
      { property: "og:description", content: "Nearby hospitals, clinics and 24/7 pharmacies in Nigeria." },
    ],
  }),
  component: HospitalsPage,
});

const CITIES = ["All", "Lagos", "Abuja", "Ibadan", "Kano", "Enugu"];
const TYPES = ["All", "Hospital", "Clinic", "Pharmacy"] as const;

function HospitalsPage() {
  const [city, setCity] = useState("All");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [only247, setOnly247] = useState(false);
  const [q, setQ] = useState("");

  const results = useMemo(
    () =>
      FACILITIES.filter(
        (f) =>
          (city === "All" || f.city === city) &&
          (type === "All" || f.type === type) &&
          (!only247 || f.open247) &&
          (q.trim() === "" ||
            (f.name + f.area + f.city).toLowerCase().includes(q.toLowerCase())),
      ).sort((a, b) => a.distanceKm - b.distanceKm),
    [city, type, only247, q],
  );

  return (
    <Screen title="Hospital Finder" subtitle="Hospitals, clinics and pharmacies near you">
      <Panel>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search facility or area"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <Pill key={c} active={city === c} onClick={() => setCity(c)}>{c}</Pill>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <Pill key={t} active={type === t} onClick={() => setType(t)}>{t}</Pill>
          ))}
          <Pill active={only247} onClick={() => setOnly247(!only247)}>24/7 only</Pill>
        </div>
      </Panel>

      <Panel title="Map view">
        <div className="relative h-44 overflow-hidden rounded-xl bg-secondary">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:22px_22px]" />
          {results.slice(0, 7).map((f, i) => (
            <div key={f.id} className="absolute" style={{ left: `${10 + ((i * 27) % 78)}%`, top: `${16 + ((i * 33) % 62)}%` }}>
              <MapPin className={f.open247 ? "h-5 w-5 text-primary" : "h-5 w-5 text-muted-foreground"} />
            </div>
          ))}
          <span className="absolute bottom-2 left-2 rounded-full bg-card px-2 py-1 text-[10px] text-muted-foreground">
            {results.length} facilities · green = open 24/7
          </span>
        </div>
      </Panel>

      <Panel title={`${results.length} results`}>
        {results.length === 0 ? (
          <Empty text="No facilities match your filters." />
        ) : (
          <ul className="divide-y divide-border">
            {results.map((f) => (
              <li key={f.id} className="py-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Hospital className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {f.type} · {f.area}, {f.city} · {f.distanceKm} km
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {f.open247 ? (
                        <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                          <Clock className="h-3 w-3" /> Open 24/7
                        </span>
                      ) : (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">8am – 6pm</span>
                      )}
                      {f.emergency ? (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">Emergency ward</span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <a href={`tel:${f.phone}`} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(f.name + " " + f.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-secondary py-2 text-xs font-semibold text-primary"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Directions
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Screen>
  );
}
