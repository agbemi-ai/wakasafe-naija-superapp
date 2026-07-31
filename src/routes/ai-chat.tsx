import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, AlertTriangle, Loader2, User } from "lucide-react";
import { Screen, Panel } from "@/components/ui-kit";
import { useStore } from "@/lib/storage";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "AI Health Chat — Ask Health Questions | WakaSafe AI" },
      {
        name: "description",
        content:
          "Ask everyday health questions and get clear guidance for Nigerian conditions like malaria, typhoid, BP and pregnancy. Not medical advice.",
      },
      { property: "og:title", content: "AI Health Chat | WakaSafe AI" },
      { property: "og:description", content: "Health guidance for Nigerian families. Not medical advice." },
    ],
  }),
  component: AiChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "I have fever and body pain — could it be malaria?",
  "What foods lower blood pressure?",
  "How do I treat a child's diarrhoea at home?",
  "Is it safe to take Paracetamol with Ibuprofen?",
];

const KB: { match: RegExp; reply: string }[] = [
  { match: /malaria|fever|body pain|shivering/i, reply: "Fever with body pain, chills and headache is commonly malaria in Nigeria — but typhoid, flu and COVID present the same way.\n\n• Get an RDT or blood film test at a pharmacy or clinic before taking any antimalarial.\n• If confirmed, an ACT such as Artemether/Lumefantrine is first line.\n• Drink plenty of fluids and use Paracetamol for fever.\n\nGo to hospital immediately for convulsions, confusion, dark urine, difficulty breathing, or fever in a child under 5 or a pregnant woman." },
  { match: /blood pressure|bp|hypertens/i, reply: "To keep blood pressure in check:\n\n• Cut salt, seasoning cubes and processed meat — aim under 5g salt daily.\n• Eat more vegetables, beans, plantain, fruits and less palm-oil-heavy stews.\n• Walk briskly 30 minutes, 5 days a week.\n• Take your prescribed medicine daily even when you feel fine.\n• Log readings in the Health Tracker.\n\nSeek urgent care if BP is above 180/120 or you have chest pain, severe headache or blurred vision." },
  { match: /diarrhoea|diarrhea|stooling|vomit/i, reply: "For diarrhoea, dehydration is the real danger.\n\n• Give ORS after every loose stool (1 sachet in 1 litre clean water).\n• Children under 5: add zinc daily for 10–14 days.\n• Continue feeding and breastfeeding.\n• Avoid anti-diarrhoea tablets in young children.\n\nGo to hospital for blood in stool, sunken eyes, no urine for 6+ hours, or persistent vomiting." },
  { match: /paracetamol|ibuprofen|drug|dosage|medicine/i, reply: "Paracetamol and Ibuprofen can be taken together or alternated for adults, but:\n\n• Paracetamol max 4g/day (usually 1g every 6 hours).\n• Ibuprofen with food, max 1.2g/day OTC — avoid with ulcers, asthma flare or kidney problems.\n• Never combine two products that both contain paracetamol.\n\nCheck the Drug Info tab for Nigerian brands, doses and side effects." },
  { match: /pregnan|antenatal|baby.*due|conceive/i, reply: "For a healthy pregnancy in Nigeria:\n\n• Register for antenatal care before 12 weeks.\n• Take folic acid, iron and calcium as prescribed.\n• Sleep under an insecticide-treated net and take IPTp for malaria prevention.\n• Know your blood group and genotype, and plan your delivery hospital early.\n\nGo to hospital immediately for bleeding, severe headache, blurred vision, swelling of face/hands or reduced baby movement." },
  { match: /typhoid/i, reply: "Typhoid is diagnosed properly with a blood culture — the common Widal test gives many false positives in Nigeria.\n\n• Don't start antibiotics based on Widal alone.\n• Drink safe (boiled or sachet-certified) water and wash hands.\n• Treatment is usually a prescribed antibiotic course that must be completed.\n\nSee a doctor for persistent fever above 3 days, abdominal pain or confusion." },
  { match: /sugar|diabet/i, reply: "For blood sugar control:\n\n• Reduce garri, white rice, bread and sugary drinks; choose beans, unripe plantain, vegetables and whole grains.\n• Check fasting sugar regularly — target usually 70–130 mg/dL (confirm with your doctor).\n• Walk daily and take medicine as prescribed.\n• Check your feet daily for sores.\n\nUrgent care needed for confusion, sweating with shakiness, or sugar above 300 mg/dL." },
  { match: /mental|depress|anxiety|stress|sad/i, reply: "What you're feeling matters. Try slow breathing (4 in, 7 hold, 8 out) and talk to someone you trust.\n\n• Keep a mood log in the Mental Wellness tab.\n• Sleep, sunlight and light exercise genuinely help.\n• MANI helpline: 0908 021 7555 (24/7, free).\n\nIf you have thoughts of harming yourself, call 112 or the helpline now — you deserve support." },
];

function answerFor(q: string) {
  const hit = KB.find((k) => k.match.test(q));
  if (hit) return hit.reply;
  return "I can help with general health guidance for common Nigerian conditions — malaria, typhoid, blood pressure, diabetes, pregnancy, child health, first aid and medicines.\n\nTell me a bit more: what symptom do you have, how long has it lasted, and who is affected (adult, child, pregnant woman)?\n\nFor anything severe or sudden, use the SOS tab or go to the nearest hospital.";
}

function AiChatPage() {
  const { value: messages, setValue, loading } = useStore<Msg[]>("ai:messages", []);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: q };
    setValue((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setValue((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: answerFor(q) }]);
      setThinking(false);
    }, 800);
  };

  return (
    <Screen title="AI Health Chat" subtitle="Clear answers for everyday health worries">
      <div className="flex items-start gap-2 rounded-2xl bg-warning/15 p-3 text-[11px]">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p>
          <strong>Not medical advice.</strong> WakaSafe AI gives general health information only.
          Always confirm with a licensed doctor or pharmacist, and call 112 in an emergency.
        </p>
      </div>

      <Panel className="min-h-[22rem]">
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading chat…</p>
        ) : messages.length === 0 ? (
          <div className="space-y-3 py-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Bot className="h-6 w-6" />
              </span>
              <p className="text-sm font-medium">Ask me anything about your health</p>
            </div>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full rounded-xl bg-secondary px-3 py-2.5 text-left text-xs text-secondary-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className={m.role === "user" ? "flex justify-end" : "flex gap-2"}>
                {m.role === "assistant" ? (
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <Bot className="h-4 w-4" />
                  </span>
                ) : null}
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[80%] whitespace-pre-line rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-xs text-primary-foreground"
                      : "max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-secondary px-3 py-2 text-xs text-secondary-foreground"
                  }
                >
                  {m.text}
                </p>
                {m.role === "user" ? (
                  <span className="ml-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <User className="h-4 w-4" />
                  </span>
                ) : null}
              </li>
            ))}
            {thinking ? (
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> WakaSafe AI is thinking…
              </li>
            ) : null}
          </ul>
        )}
        <div ref={endRef} />
      </Panel>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="sticky bottom-24 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-card)]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptom…"
          className="flex-1 bg-transparent px-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={thinking || !input.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {messages.length ? (
        <button onClick={() => setValue([])} className="w-full text-xs font-medium text-muted-foreground">
          Clear conversation
        </button>
      ) : null}
    </Screen>
  );
}
