export type Facility = {
  id: string;
  name: string;
  type: "Hospital" | "Clinic" | "Pharmacy";
  city: string;
  area: string;
  phone: string;
  open247: boolean;
  distanceKm: number;
  emergency: boolean;
};

export const FACILITIES: Facility[] = [
  { id: "h1", name: "Lagos University Teaching Hospital (LUTH)", type: "Hospital", city: "Lagos", area: "Idi-Araba", phone: "+2348033046666", open247: true, distanceKm: 3.4, emergency: true },
  { id: "h2", name: "Lagos State University Teaching Hospital", type: "Hospital", city: "Lagos", area: "Ikeja", phone: "+2348023456789", open247: true, distanceKm: 6.1, emergency: true },
  { id: "h3", name: "Reddington Hospital", type: "Hospital", city: "Lagos", area: "Victoria Island", phone: "+2347080631588", open247: true, distanceKm: 8.8, emergency: true },
  { id: "h4", name: "St. Nicholas Hospital", type: "Hospital", city: "Lagos", area: "Lagos Island", phone: "+2342012700630", open247: true, distanceKm: 7.2, emergency: true },
  { id: "h5", name: "National Hospital Abuja", type: "Hospital", city: "Abuja", area: "Central Area", phone: "+2349034003000", open247: true, distanceKm: 2.1, emergency: true },
  { id: "h6", name: "Nisa Premier Hospital", type: "Hospital", city: "Abuja", area: "Jabi", phone: "+2349038888888", open247: true, distanceKm: 4.6, emergency: true },
  { id: "c1", name: "Bethel Medical Clinic", type: "Clinic", city: "Lagos", area: "Yaba", phone: "+2348051234567", open247: false, distanceKm: 1.9, emergency: false },
  { id: "c2", name: "Garki Family Clinic", type: "Clinic", city: "Abuja", area: "Garki II", phone: "+2348091234567", open247: false, distanceKm: 3.0, emergency: false },
  { id: "c3", name: "Ogui Road Medical Centre", type: "Clinic", city: "Enugu", area: "Ogui", phone: "+2348062223344", open247: false, distanceKm: 2.4, emergency: false },
  { id: "p1", name: "HealthPlus Pharmacy", type: "Pharmacy", city: "Lagos", area: "Lekki Phase 1", phone: "+2347080000111", open247: true, distanceKm: 1.2, emergency: false },
  { id: "p2", name: "Medplus Pharmacy", type: "Pharmacy", city: "Lagos", area: "Ikoyi", phone: "+2347080000222", open247: false, distanceKm: 5.5, emergency: false },
  { id: "p3", name: "Alpha Pharmacy", type: "Pharmacy", city: "Abuja", area: "Wuse 2", phone: "+2347080000333", open247: true, distanceKm: 2.8, emergency: false },
  { id: "h7", name: "University College Hospital (UCH)", type: "Hospital", city: "Ibadan", area: "Queen Elizabeth Rd", phone: "+2348023001100", open247: true, distanceKm: 9.4, emergency: true },
  { id: "h8", name: "Aminu Kano Teaching Hospital", type: "Hospital", city: "Kano", area: "Zaria Road", phone: "+2348034445566", open247: true, distanceKm: 11.2, emergency: true },
];

export type Drug = {
  id: string;
  name: string;
  brands: string;
  klass: string;
  uses: string;
  dosage: string;
  sideEffects: string;
  warning: string;
  priceNgn: string;
};

export const DRUGS: Drug[] = [
  { id: "d1", name: "Artemether/Lumefantrine", brands: "Coartem, Lonart, P-Alaxin", klass: "Antimalarial (ACT)", uses: "Uncomplicated falciparum malaria", dosage: "Adults ≥35kg: 4 tablets at 0h, 8h, then twice daily for 2 more days (24 tabs total). Take with fatty food.", sideEffects: "Headache, dizziness, loss of appetite, palpitations", warning: "Confirm malaria with RDT or microscopy before use. Not for severe malaria.", priceNgn: "₦1,500 – ₦3,500" },
  { id: "d2", name: "Paracetamol", brands: "Panadol, Emzor Paracetamol", klass: "Analgesic / Antipyretic", uses: "Fever, mild to moderate pain", dosage: "Adults: 500mg–1g every 6 hours, max 4g/day. Children: 15mg/kg per dose.", sideEffects: "Rare at normal doses; rash", warning: "Overdose causes severe liver damage. Avoid combining multiple paracetamol-containing products.", priceNgn: "₦200 – ₦700" },
  { id: "d3", name: "Amoxicillin/Clavulanate", brands: "Augmentin, Amoksiklav", klass: "Antibiotic (penicillin)", uses: "Respiratory, urinary, skin and dental bacterial infections", dosage: "Adults: 625mg every 8 hours or 1g every 12 hours for 5–7 days.", sideEffects: "Diarrhoea, nausea, rash, thrush", warning: "Do not use for viral infections. Complete the full course. Avoid if penicillin-allergic.", priceNgn: "₦3,000 – ₦8,000" },
  { id: "d4", name: "Metformin", brands: "Glucophage, Diabetmin", klass: "Antidiabetic (biguanide)", uses: "Type 2 diabetes", dosage: "Start 500mg once/twice daily with meals; titrate to max 2g/day.", sideEffects: "Nausea, metallic taste, diarrhoea, B12 deficiency", warning: "Stop before contrast scans. Avoid in kidney failure.", priceNgn: "₦1,200 – ₦4,000" },
  { id: "d5", name: "Amlodipine", brands: "Norvasc, Amlovas", klass: "Calcium channel blocker", uses: "Hypertension, angina", dosage: "5mg once daily, may increase to 10mg daily.", sideEffects: "Ankle swelling, flushing, headache", warning: "Do not stop suddenly without medical advice. Monitor BP regularly.", priceNgn: "₦1,000 – ₦3,500" },
  { id: "d6", name: "Oral Rehydration Salts (ORS)", brands: "Emzor ORS, Lo-Salt ORS", klass: "Rehydration therapy", uses: "Diarrhoea and dehydration", dosage: "Dissolve 1 sachet in 1 litre clean water. Give after each loose stool.", sideEffects: "Vomiting if taken too fast", warning: "Use clean/boiled water. Add zinc for children under 5 for 10–14 days.", priceNgn: "₦100 – ₦400" },
  { id: "d7", name: "Ibuprofen", brands: "Brufen, Ibucap", klass: "NSAID", uses: "Pain, inflammation, fever", dosage: "Adults: 200–400mg every 6–8 hours after food, max 1.2g/day OTC.", sideEffects: "Stomach upset, ulcers, kidney strain", warning: "Avoid in ulcer disease, asthma flare, dengue suspicion and late pregnancy.", priceNgn: "₦400 – ₦1,500" },
  { id: "d8", name: "Ferrous Sulphate + Folic Acid", brands: "Astyfer, Fefol", klass: "Haematinic", uses: "Anaemia, pregnancy supplementation", dosage: "1 tablet daily after meals.", sideEffects: "Dark stool, constipation, nausea", warning: "Keep away from children — iron overdose is fatal.", priceNgn: "₦800 – ₦2,500" },
  { id: "d9", name: "Chlorpheniramine", brands: "Piriton", klass: "Antihistamine", uses: "Allergies, itching, rhinitis", dosage: "Adults: 4mg every 4–6 hours, max 24mg/day.", sideEffects: "Drowsiness, dry mouth", warning: "Do not drive or ride okada after taking. Avoid alcohol.", priceNgn: "₦150 – ₦600" },
  { id: "d10", name: "Omeprazole", brands: "Losec, Omez", klass: "Proton pump inhibitor", uses: "Ulcer, reflux, heartburn", dosage: "20mg once daily before breakfast for 4–8 weeks.", sideEffects: "Headache, flatulence, diarrhoea", warning: "Long-term use may reduce B12 and magnesium.", priceNgn: "₦900 – ₦3,000" },
];

export type FirstAidGuide = {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  steps: string[];
  dont: string[];
};

export const FIRST_AID: FirstAidGuide[] = [
  { id: "fa1", title: "Severe Bleeding", emoji: "🩸", summary: "Control blood loss before transport.", steps: ["Wear gloves or use a clean nylon bag over your hand.", "Press firmly on the wound with a clean cloth for 10 minutes without lifting.", "Raise the injured limb above heart level if no fracture is suspected.", "Add more cloth on top if blood soaks through — never remove the first layer.", "Keep the person warm and rush to the nearest hospital or call 112."], dont: ["Do not apply engine oil, kerosene or herbs.", "Do not remove an object stuck in the wound."] },
  { id: "fa2", title: "Choking (Adult)", emoji: "🫁", summary: "Clear the airway fast.", steps: ["Ask 'Are you choking?' If they cannot speak, act immediately.", "Give 5 firm back blows between the shoulder blades with the heel of your hand.", "Give 5 abdominal thrusts (Heimlich) — fist above the navel, pull inward and upward.", "Alternate 5 and 5 until the object comes out.", "If they collapse, start CPR and call 112."], dont: ["Do not blindly sweep the mouth with your finger."] },
  { id: "fa3", title: "Burns (Fire / Hot Oil)", emoji: "🔥", summary: "Cool, cover, carry.", steps: ["Stop the burning — remove from heat source safely.", "Cool the burn under clean running water for 20 minutes.", "Remove rings and tight clothing before swelling starts.", "Cover loosely with clean cling film or a non-fluffy cloth.", "Go to hospital for burns bigger than the person's palm, or on face, hands or genitals."], dont: ["Never apply toothpaste, palm oil, eggs or ice.", "Do not burst blisters."] },
  { id: "fa4", title: "Snake Bite", emoji: "🐍", summary: "Immobilise and transport fast.", steps: ["Move the person away from the snake and keep them calm and still.", "Remove rings, watches and tight clothing from the bitten limb.", "Immobilise the limb with a splint and keep it below heart level.", "Note the time of bite and the snake's appearance if safely visible.", "Go straight to a hospital with antivenom — call 112 for guidance."], dont: ["Do not cut, suck, burn or tie a tight tourniquet.", "Do not give alcohol or herbal concoctions."] },
  { id: "fa5", title: "CPR (Adult)", emoji: "❤️", summary: "Push hard, push fast.", steps: ["Check response and breathing for no more than 10 seconds.", "Shout for help and call 112. Ask someone to find an AED.", "Place heel of hand on the centre of the chest, other hand on top.", "Push down 5–6cm at 100–120 compressions per minute.", "Give 30 compressions then 2 rescue breaths if trained. Continue until help arrives."], dont: ["Do not stop to check pulse repeatedly.", "Do not delay compressions."] },
  { id: "fa6", title: "Convulsion / Seizure", emoji: "⚡", summary: "Protect, don't restrain.", steps: ["Clear hard objects away and cushion the head.", "Turn the person on their side once jerking stops (recovery position).", "Loosen tight clothing around the neck.", "Time the seizure — call 112 if longer than 5 minutes or it repeats.", "Stay until they are fully alert and reassure them."], dont: ["Never put a spoon, finger or cloth in the mouth.", "Do not pour water or hold them down."] },
  { id: "fa7", title: "Road Traffic Accident", emoji: "🚗", summary: "Scene safety first.", steps: ["Park safely, switch on hazard lights and watch out for fuel or traffic.", "Call 112 or FRSC 122 with the exact location and number of casualties.", "Do not move casualties unless there is fire or oncoming danger.", "Control heavy bleeding with direct pressure.", "Keep casualties warm, talking and still until responders arrive."], dont: ["Do not remove a helmet from a motorcyclist.", "Do not give food or drink."] },
  { id: "fa8", title: "Heat Exhaustion", emoji: "🌡️", summary: "Common in Nigerian heat waves.", steps: ["Move to a shaded or air-conditioned area.", "Lie down and raise the legs slightly.", "Sip ORS or cool water slowly.", "Loosen clothing and fan the skin, apply cool damp cloths.", "If confusion, vomiting or temperature stays high, go to hospital."], dont: ["Do not give alcohol or very cold drinks quickly."] },
];

export const EMERGENCY_NUMBERS = [
  { label: "National Emergency", number: "112", note: "Toll-free nationwide" },
  { label: "Police", number: "199", note: "Nigeria Police Force" },
  { label: "Lagos Emergency (LASEMA)", number: "767", note: "Lagos State only" },
  { label: "Fire Service", number: "112", note: "Ask for fire" },
  { label: "FRSC (Road)", number: "122", note: "Federal Road Safety Corps" },
  { label: "Mental Health Helpline", number: "09080217555", note: "MANI — 24/7 support" },
];
