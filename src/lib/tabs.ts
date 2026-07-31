import {
  Home,
  HeartPulse,
  Baby,
  MapPinned,
  Siren,
  Hospital,
  Bot,
  Pill,
  BookHeart,
  CalendarHeart,
  Brain,
  ShieldCheck,
  Wallet,
  Users,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type TabDef = {
  to: string;
  label: string;
  short: string;
  icon: LucideIcon;
  premium: boolean;
  blurb: string;
};

export const TABS: TabDef[] = [
  { to: "/", label: "Home Dashboard", short: "Home", icon: Home, premium: false, blurb: "Safety score, quick actions & weather" },
  { to: "/health", label: "Health Tracker", short: "Health", icon: HeartPulse, premium: false, blurb: "BP, sugar, weight & symptoms" },
  { to: "/baby", label: "Baby Care", short: "Baby", icon: Baby, premium: true, blurb: "Growth, vaccines, milestones, feeds" },
  { to: "/family", label: "Family Locator", short: "Family", icon: MapPinned, premium: true, blurb: "Live location & I'm Safe check-in" },
  { to: "/sos", label: "SOS Emergency", short: "SOS", icon: Siren, premium: false, blurb: "Call 112 / 199, alert contacts" },
  { to: "/hospitals", label: "Hospital Finder", short: "Hospitals", icon: Hospital, premium: false, blurb: "Hospitals, clinics & pharmacies" },
  { to: "/ai-chat", label: "AI Health Chat", short: "AI Chat", icon: Bot, premium: false, blurb: "Ask health questions anytime" },
  { to: "/drugs", label: "Drug Info", short: "Drugs", icon: Pill, premium: true, blurb: "Nigerian drug database & dosage" },
  { to: "/first-aid", label: "First Aid Guide", short: "First Aid", icon: BookHeart, premium: false, blurb: "Offline step-by-step guides" },
  { to: "/period", label: "Period & Fertility", short: "Cycle", icon: CalendarHeart, premium: true, blurb: "Cycle log, predictions, reminders" },
  { to: "/wellness", label: "Mental Wellness", short: "Wellness", icon: Brain, premium: true, blurb: "Mood, breathing & helplines" },
  { to: "/insurance", label: "Insurance", short: "Insurance", icon: ShieldCheck, premium: true, blurb: "NHIS & private cover, claims" },
  { to: "/wallet", label: "Health Wallet", short: "Wallet", icon: Wallet, premium: true, blurb: "Medical expenses in ₦" },
  { to: "/community", label: "Community", short: "Community", icon: Users, premium: true, blurb: "Anonymous health forum" },
  { to: "/profile", label: "Profile", short: "Profile", icon: User, premium: false, blurb: "Blood group, allergies, contacts" },
  { to: "/settings", label: "Settings", short: "Settings", icon: Settings, premium: false, blurb: "Notifications, language, privacy" },
];

export const TAB_BY_PATH: Record<string, TabDef> = Object.fromEntries(
  TABS.map((t) => [t.to, t]),
);

export const BOTTOM_NAV = ["/", "/health", "/sos", "/hospitals", "/more"];
