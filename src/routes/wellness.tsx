import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Brain, Phone, Play, Pause, Trash2 } from "lucide-react";
import { Screen, Panel, Field, Empty, Stat, Loading } from "@/components/ui-kit";
import { PremiumGate } from "@/components/PremiumGate";
import { useMoodLogs } from "@/hooks/useWakaSafe";
import { isoDay } from "@/lib/storage";

export const Route = createFileRoute("/wellness")({
  head: () => ({
    meta: [
      { title: "Mental Wellness — Mood Tracker & Breathing | WakaSafe AI" },
      {
        name: "description",
        content:
          "Track your mood, follow a guided 4-7-8 breathing exercise and reach Nigerian mental health helplines 24/7.",
      },
      { property: "og:title", content: "Mental Wellness | WakaSafe AI" },
      { property: "og:description", content: "Mood tracking, breathing exercises and helplines." },
    ],
  }),
  component: () => (
    <PremiumGate feature="Mental Wellness">
      <WellnessPage />
    </PremiumGate>
  ),
});

const MOODS = [
  { emoji: "😞", label: "Low", score: 1 },
  { emoji: "😕", label: "Down", score: 2 },
  { emoji: "😐", label: "Okay", score: 3 },
  { emoji: "🙂", label: "Good", score: 4 },
  { emoji: "😄", label: "Great", score: 5 },
];

function WellnessPage() {
  const { items, add, remove, loading } = useMoodLogs();
  const [note, setNote] = useState("");

  const average = useMemo(
    () => (items.length ? (items.reduce((s, m) => s + m.score, 0) / items.length).toFixed(1) : "—"),
    [items],
  );

  return (
    <Screen title="Mental Wellness" subtitle="Your mind matters as much as your body">
      <Panel title="How are you feeling now?">
        <div className="flex justify-between">
          {MOODS.map((m) => (
            <button
              key={m.label}
              onClick={() => {
                add({ date: isoDay(), score: m.score, mood: m.label, note: note.trim() || undefined });
                setNote("");
                toast.success(`Mood saved: ${m.label}`);
              }}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 hover:bg-secondary"
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <Field label="What's on your mind? (optional)">
            <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
        </div>
      </Panel>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Check-ins" value={items.length} />
        <Stat label="Average mood" value={average} hint="out of 5" />
        <Stat label="Streak" value={items.length ? "Active" : "—"} />
      </div>

      <Breathing />

      <Panel title="Talk to someone now">
        <ul className="space-y-2">
          {[
            { name: "MANI Helpline", num: "09080217555", note: "Mentally Aware Nigeria · 24/7" },
            { name: "SURPIN Suicide Helpline", num: "09080217555", note: "Suicide Research & Prevention" },
            { name: "National Emergency", num: "112", note: "Immediate danger" },
          ].map((h) => (
            <li key={h.name} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
              <Brain className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{h.name}</p>
                <p className="text-[11px] text-muted-foreground">{h.note}</p>
              </div>
              <a href={`tel:${h.num}`} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Mood history">
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty text="No mood check-ins yet." />
        ) : (
          <ul className="divide-y divide-border">
            {items.slice(0, 20).map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2.5">
                <span className="text-xl">{MOODS.find((x) => x.score === m.score)?.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.mood}</p>
                  <p className="text-[11px] text-muted-foreground">{m.date}{m.note ? ` · ${m.note}` : ""}</p>
                </div>
                <button onClick={() => remove(m.id)} aria-label="Delete" className="p-2 text-muted-foreground">
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

const PHASES = [
  { label: "Breathe in", secs: 4 },
  { label: "Hold", secs: 7 },
  { label: "Breathe out", secs: 8 },
];

function Breathing() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState(PHASES[0].secs);
  const [cycles, setCycles] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1;
        setPhase((p) => {
          const next = (p + 1) % PHASES.length;
          if (next === 0) setCycles((c) => c + 1);
          setLeft(PHASES[next].secs);
          return next;
        });
        return PHASES[(phase + 1) % PHASES.length].secs;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running, phase]);

  return (
    <Panel title="4-7-8 breathing">
      <div className="flex flex-col items-center gap-3 py-2">
        <div
          className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/15 transition-transform duration-1000"
          style={{ transform: `scale(${running && phase === 0 ? 1.15 : running && phase === 2 ? 0.85 : 1})` }}
        >
          <div className="text-center">
            <p className="text-sm font-semibold text-primary">{PHASES[phase].label}</p>
            <p className="text-2xl font-bold">{left}</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">Completed cycles: {cycles}</p>
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Start exercise"}
        </button>
      </div>
    </Panel>
  );
}
