import { useMemo } from "react";
import { useCollection, useStore, isoDay } from "@/lib/storage";

/* ---------------- Health tracker ---------------- */
export type VitalLog = {
  id: string;
  date: string;
  type: "bp" | "sugar" | "weight" | "symptom";
  systolic?: number;
  diastolic?: number;
  sugar?: number;
  weight?: number;
  symptom?: string;
  severity?: number;
  note?: string;
};

export function useHealthLogs() {
  const c = useCollection<VitalLog>("health:logs", []);
  const byType = useMemo(
    () => ({
      bp: c.items.filter((i) => i.type === "bp"),
      sugar: c.items.filter((i) => i.type === "sugar"),
      weight: c.items.filter((i) => i.type === "weight"),
      symptom: c.items.filter((i) => i.type === "symptom"),
    }),
    [c.items],
  );
  return { ...c, byType };
}

/* ---------------- Baby: vaccines / milestones / feeds ---------------- */
export type Vaccine = { id: string; name: string; dueAge: string; done: boolean; date?: string };
export type Milestone = { id: string; name: string; done: boolean; date?: string };
export type FeedLog = { id: string; at: string; kind: "feed" | "sleep"; detail: string };

export const NIGERIA_NPI_SCHEDULE: Vaccine[] = [
  { id: "v1", name: "BCG + OPV0 + Hep B0", dueAge: "At birth", done: false },
  { id: "v2", name: "Penta 1 + OPV1 + PCV1 + Rota 1", dueAge: "6 weeks", done: false },
  { id: "v3", name: "Penta 2 + OPV2 + PCV2 + Rota 2", dueAge: "10 weeks", done: false },
  { id: "v4", name: "Penta 3 + OPV3 + PCV3 + IPV", dueAge: "14 weeks", done: false },
  { id: "v5", name: "Measles 1 + Yellow Fever + Men A", dueAge: "9 months", done: false },
  { id: "v6", name: "Measles 2", dueAge: "15 months", done: false },
];

export const BABY_MILESTONES: Milestone[] = [
  { id: "m1", name: "Social smile", done: false },
  { id: "m2", name: "Holds head steady", done: false },
  { id: "m3", name: "Rolls over", done: false },
  { id: "m4", name: "Sits without support", done: false },
  { id: "m5", name: "Crawls", done: false },
  { id: "m6", name: "First words", done: false },
  { id: "m7", name: "Walks alone", done: false },
];

export function useVaccines() {
  return useStore<Vaccine[]>("baby:vaccines", NIGERIA_NPI_SCHEDULE);
}
export function useMilestones() {
  return useStore<Milestone[]>("baby:milestones", BABY_MILESTONES);
}
export function useFeedLogs() {
  return useCollection<FeedLog>("baby:feeds", []);
}

/* ---------------- Family locator ---------------- */
export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  area: string;
  lat: number;
  lng: number;
  sharing: boolean;
  lastCheckIn: string | null;
  status: "safe" | "unknown";
};

const SEED_FAMILY: FamilyMember[] = [
  { id: "f1", name: "Mama Ada", relation: "Mother", area: "Surulere, Lagos", lat: 6.5, lng: 3.35, sharing: true, lastCheckIn: null, status: "unknown" },
  { id: "f2", name: "Chidi", relation: "Brother", area: "Wuse 2, Abuja", lat: 9.07, lng: 7.47, sharing: true, lastCheckIn: null, status: "unknown" },
];

export function useFamily() {
  return useCollection<FamilyMember>("family:members", SEED_FAMILY);
}

/* ---------------- Profile & emergency contacts ---------------- */
export type EmergencyContact = { id: string; name: string; phone: string; relation: string };
export type Profile = {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  genotype: string;
  allergies: string;
  conditions: string;
  city: string;
  address: string;
};

export const EMPTY_PROFILE: Profile = {
  name: "",
  phone: "",
  email: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  genotype: "",
  allergies: "",
  conditions: "",
  city: "Lagos",
  address: "",
};

export function useProfile() {
  return useStore<Profile>("profile", EMPTY_PROFILE);
}
export function useEmergencyContacts() {
  return useCollection<EmergencyContact>("contacts", [
    { id: "c1", name: "Next of Kin", phone: "+234", relation: "Family" },
  ]);
}

/* ---------------- Period tracker ---------------- */
export type PeriodLog = { id: string; start: string; end?: string; flow: string; symptoms?: string };
export function usePeriodLogs() {
  return useCollection<PeriodLog>("period:logs", []);
}

/* ---------------- Mood ---------------- */
export type MoodLog = { id: string; date: string; score: number; mood: string; note?: string };
export function useMoodLogs() {
  return useCollection<MoodLog>("wellness:mood", []);
}

/* ---------------- Insurance ---------------- */
export type Policy = {
  id: string;
  provider: string;
  type: "NHIS" | "Private" | "HMO";
  policyNumber: string;
  hospital: string;
  expiry: string;
  premium: number;
};
export function usePolicies() {
  return useCollection<Policy>("insurance:policies", []);
}

/* ---------------- Wallet ---------------- */
export type Expense = {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
};
export function useExpenses() {
  return useCollection<Expense>("wallet:expenses", []);
}
export function useBudget() {
  return useStore<number>("wallet:budget", 50000);
}

/* ---------------- Community ---------------- */
export type Post = {
  id: string;
  alias: string;
  topic: string;
  body: string;
  createdAt: string;
  likes: number;
  replies: { id: string; alias: string; body: string }[];
};

const SEED_POSTS: Post[] = [
  {
    id: "p1",
    alias: "Anonymous Eagle",
    topic: "Malaria",
    body: "Fever and body pain for 2 days after travelling to Ibadan. Should I test for malaria first before taking anything?",
    createdAt: new Date(Date.now() - 3600_000 * 5).toISOString(),
    likes: 12,
    replies: [
      { id: "r1", alias: "Anonymous Lion", body: "Please do an RDT test at any pharmacy first. Self-medication causes resistance." },
    ],
  },
  {
    id: "p2",
    alias: "Anonymous Dove",
    topic: "Pregnancy",
    body: "Which teaching hospital in Lagos has the best antenatal package under NHIS?",
    createdAt: new Date(Date.now() - 3600_000 * 26).toISOString(),
    likes: 7,
    replies: [],
  },
];

export function usePosts() {
  return useCollection<Post>("community:posts", SEED_POSTS);
}

/* ---------------- Settings ---------------- */
export type AppSettings = {
  notifications: boolean;
  medReminders: boolean;
  sosVibration: boolean;
  language: "English" | "Pidgin" | "Hausa" | "Yoruba" | "Igbo";
  shareAnalytics: boolean;
  biometricLock: boolean;
};
export const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  medReminders: true,
  sosVibration: true,
  language: "English",
  shareAnalytics: false,
  biometricLock: false,
};
export function useSettings() {
  return useStore<AppSettings>("settings", DEFAULT_SETTINGS);
}

/* ---------------- Safety score ---------------- */
export function useSafetyScore() {
  const { value: profile } = useProfile();
  const { items: contacts } = useEmergencyContacts();
  const { items: logs } = useHealthLogs();
  const { items: family } = useFamily();

  return useMemo(() => {
    let score = 20;
    if (profile.name) score += 10;
    if (profile.bloodGroup) score += 10;
    if (profile.genotype) score += 5;
    if (profile.allergies) score += 5;
    if (contacts.filter((c) => c.phone.length > 6).length >= 3) score += 20;
    else score += contacts.filter((c) => c.phone.length > 6).length * 6;
    if (logs.some((l) => l.date === isoDay())) score += 10;
    else if (logs.length) score += 5;
    if (family.length >= 2) score += 10;
    return Math.min(100, score);
  }, [profile, contacts, logs, family]);
}
