// ─────────────────────────────────────────────────────────────────────────
// Grounded in the True Shop · Central World field research (Assignment 1
// personas / journeys / pain points). Two connected concepts share this data:
//
//   • TRUE QUEUE   — customer books a queue from home in the True App, is told
//                    what to bring, and (if they share their True number) their
//                    profile is "pierced" into the queue so staff are ready.
//   • THE WELCOMER — staff greet + diagnose on an iPad the moment the customer
//                    arrives, the system narrows 40+ promotions down to the
//                    right offer, and the data is handed off to Service Staff.
//
// Customer data here is MOCK — designed so it can be wired to True's real
// systems (CRM Lite / billing / usage) with zero structural change.
// ─────────────────────────────────────────────────────────────────────────

// ── True Queue: services a customer can book from home ────────────────────
// Each maps to the "pick a service → see what to bring → link your number → book" flow.
export const QUEUE_SERVICES = [
  {
    id: 'package',
    icon: 'signal',
    title: 'Change / renew plan',
    sub: 'Mobile or home internet plans, or renew your contract',
    counter: 'Sales & Advice counter',
    estMin: 12,
    personaId: 'nut',
    docs: [
      { icon: 'idcard', label: 'ID card', required: true },
      { icon: 'smartphone', label: 'The number you want to change the plan on', required: true },
      { icon: 'creditcard', label: 'Eligible credit card (for 0% installments)', required: false },
    ],
  },
  {
    id: 'device',
    icon: 'smartphone',
    title: 'Buy / finance a new device',
    sub: 'Pick a device, 0% installments, or trade in your old one',
    counter: 'Device Sales counter (ITF)',
    estMin: 18,
    personaId: 'nut',
    docs: [
      { icon: 'idcard', label: 'ID card', required: true },
      { icon: 'creditcard', label: 'Eligible credit card (for 0% installments)', required: true },
      { icon: 'package', label: 'Old device + box (if trading in)', required: false },
      { icon: 'file', label: 'Payslip (only for certain installment offers)', required: false },
    ],
  },
  {
    id: 'new-sim',
    icon: 'globe',
    title: 'New number / Tourist SIM',
    sub: 'Open a new number · Tourist SIM',
    counter: 'New Number counter',
    estMin: 15,
    personaId: 'mark',
    english: 'New SIM / Tourist SIM — bring your passport',
    docs: [
      { icon: 'idcard', label: 'ID card / Passport', required: true },
      { icon: 'scanface', label: 'Face scan (done in-store)', required: true },
    ],
  },
  {
    id: 'bill',
    icon: 'receipt',
    title: 'Pay bill / billing questions',
    sub: 'Make a payment or ask why your bill went up',
    counter: 'Fast Lane',
    estMin: 5,
    personaId: 'somchai',
    fastLane: true,
    docs: [
      { icon: 'idcard', label: 'ID card', required: true },
      { icon: 'receipt', label: 'Invoice number / number to pay for', required: false },
    ],
  },
  {
    id: 'retention',
    icon: 'repeat',
    title: 'Cancel / switch carrier',
    sub: 'Cancel a service or port out to another carrier',
    counter: 'Retention desk',
    estMin: 20,
    personaId: 'ae',
    docs: [
      { icon: 'idcard', label: "Account holder's ID card", required: true },
      { icon: 'banknote', label: 'Settle any outstanding balance (if any)', required: true },
      { icon: 'file', label: 'Proof of identity (if registered on someone else\'s behalf)', required: false },
    ],
  },
  {
    id: 'signal',
    icon: 'wifi',
    title: 'Signal / internet issue',
    sub: 'Report a mobile signal or home internet problem',
    counter: 'Technical / After-sales counter',
    estMin: 10,
    personaId: 'somchai',
    docs: [
      { icon: 'idcard', label: 'ID card / affected number', required: true },
      { icon: 'home', label: 'Installation address (for home internet)', required: false },
    ],
  },
]

export function getQueueService(id) {
  return QUEUE_SERVICES.find((s) => s.id === id) || null
}

// What the True App can pre-fill once the customer shares their True number.
// This is the data that gets "pierced" into the queue ticket.
export const QUEUE_PROFILE = {
  package: {
    name: 'Nut Wilaiporn',
    phone: '089-xxx-1188',
    plan: 'True 5G 399 (30GB data)',
    insight: 'Over data limit 5 months running — likely here to discuss a plan upgrade',
  },
  device: {
    name: 'Nut Wilaiporn',
    phone: '089-xxx-1188',
    plan: 'True 5G 399',
    insight: '2-year customer, strong payment history — eligible for 0% installments over 10 months',
  },
  retention: {
    name: 'A. Rattanapol (account holder)',
    phone: '062-xxx-4420',
    plan: 'True 5G Together 599 + home internet',
    insight: 'Stated reason: moving home + has a backup number — high churn risk',
  },
  bill: {
    name: 'Somchai Phakdiphong',
    phone: '081-xxx-3210',
    plan: 'True 5G Together 599',
    insight: 'This month +THB 300 — the 12-month promo discount just ended',
  },
  signal: {
    name: 'Somchai Phakdiphong',
    phone: '081-xxx-3210',
    plan: 'True Online 1Gbps + True Vision',
    insight: 'Reported slow home internet in the evenings for 3 days running',
  },
  'new-sim': null, // tourist — no existing True profile to pull
}

// Deterministic so a live pitch shows the same plausible numbers every run
// (no Math.random surprises mid-demo). Stable hash from the seed id.
function hashSeed(s) {
  let h = 2166136261
  for (let i = 0; i < String(s).length; i++) {
    h ^= String(s).charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// queue numbers — a fresh "new-format" code (e.g. B8823) per the field note that
// True is moving to a new queue-number scheme.
export function makeQueueNumber(seedId) {
  const letter = { 'package': 'B', 'device': 'C', 'new-sim': 'S', 'bill': 'P', 'retention': 'R', 'signal': 'T' }[seedId] || 'A'
  const n = 1000 + (hashSeed(seedId) % 9000)
  return `${letter}${n}`
}

// Stable, plausible wait estimate for the True Queue ticket (no randomness).
export function queueEstimate(seedId) {
  const h = hashSeed(seedId)
  const position = 1 + (h % 3) // 1-3 ahead in queue
  const waitMin = position * 4 + (h % 4) + 2 // ~6-18 min, plausible
  return { waitMin, position }
}
