import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Heart, MessageCircle, Send, ShieldQuestion } from "lucide-react";
import { Screen, Panel, Field, Empty, Pill, Loading } from "@/components/ui-kit";
import { PremiumGate } from "@/components/PremiumGate";
import { usePosts } from "@/hooks/useWakaSafe";
import { uid, watTime } from "@/lib/storage";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Anonymous Nigerian Health Forum | WakaSafe AI" },
      {
        name: "description",
        content:
          "Ask health questions anonymously and get answers from other Nigerians on malaria, pregnancy, mental health and more.",
      },
      { property: "og:title", content: "Community | WakaSafe AI" },
      { property: "og:description", content: "Anonymous health forum for Nigerians." },
    ],
  }),
  component: () => (
    <PremiumGate feature="Community">
      <CommunityPage />
    </PremiumGate>
  ),
});

const TOPICS = ["All", "Malaria", "Pregnancy", "Mental health", "Children", "Diabetes", "General"];
const ALIASES = ["Eagle", "Lion", "Dove", "Palm", "Zobo", "Harmattan", "Sahel", "Delta"];

function CommunityPage() {
  const { items, add, update, loading } = usePosts();
  const [topic, setTopic] = useState("All");
  const [form, setForm] = useState({ topic: "Malaria", body: "" });
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const filtered = useMemo(
    () => (topic === "All" ? items : items.filter((p) => p.topic === topic)),
    [items, topic],
  );

  const alias = () => `Anonymous ${ALIASES[Math.floor(Math.random() * ALIASES.length)]}`;

  return (
    <Screen title="Community" subtitle="Ask freely — nobody sees your name">
      <div className="flex items-start gap-2 rounded-2xl bg-primary/10 p-3 text-[11px]">
        <ShieldQuestion className="h-4 w-4 shrink-0 text-primary" />
        Posts are anonymous and stored on your device. Community advice is not a substitute for a doctor.
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {TOPICS.map((t) => (
          <button key={t} onClick={() => setTopic(t)} className="shrink-0">
            <Pill active={topic === t}>{t}</Pill>
          </button>
        ))}
      </div>

      <Panel title="Ask the community">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (form.body.trim().length < 10) return toast.error("Write a bit more so people can help");
            add({
              alias: alias(),
              topic: form.topic,
              body: form.body.trim(),
              createdAt: new Date().toISOString(),
              likes: 0,
              replies: [],
            });
            setForm({ ...form, body: "" });
            toast.success("Posted anonymously");
          }}
        >
          <Field label="Topic">
            <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
              {TOPICS.filter((t) => t !== "All").map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Your question">
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} placeholder="Describe what you are experiencing…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm" />
          </Field>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Send className="h-4 w-4" /> Post anonymously
          </button>
        </form>
      </Panel>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Panel><Empty text="No posts in this topic yet." /></Panel>
      ) : (
        filtered.map((p) => (
          <Panel key={p.id}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{p.alias}</p>
              <span className="text-[11px] text-muted-foreground">{watTime(new Date(p.createdAt))} WAT</span>
            </div>
            <Pill>{p.topic}</Pill>
            <p className="mt-2 text-sm leading-relaxed">{p.body}</p>

            <div className="mt-3 flex items-center gap-4">
              <button onClick={() => update(p.id, { likes: p.likes + 1 })} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="h-4 w-4 text-primary" /> {p.likes}
              </button>
              <button onClick={() => setReplyFor(replyFor === p.id ? null : p.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-primary" /> {p.replies.length} replies
              </button>
            </div>

            {p.replies.length > 0 ? (
              <ul className="mt-3 space-y-2 border-l-2 border-border pl-3">
                {p.replies.map((r) => (
                  <li key={r.id}>
                    <p className="text-[11px] font-semibold text-muted-foreground">{r.alias}</p>
                    <p className="text-xs">{r.body}</p>
                  </li>
                ))}
              </ul>
            ) : null}

            {replyFor === p.id ? (
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reply.trim()) return;
                  update(p.id, { replies: [...p.replies, { id: uid(), alias: alias(), body: reply.trim() }] });
                  setReply("");
                  setReplyFor(null);
                  toast.success("Reply added");
                }}
              >
                <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Share your experience…" className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm" />
                <button className="rounded-xl bg-primary px-3 text-primary-foreground" aria-label="Send reply">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : null}
          </Panel>
        ))
      )}
    </Screen>
  );
}
