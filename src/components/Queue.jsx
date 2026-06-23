import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  Phone,
  Brain,
  Check,
  Lightbulb,
  MapPin,
  Ticket as TicketIcon,
  User,
  Bell,
  TrendingUp,
  Video,
  Wifi,
  Sparkles,
  X,
  Database,
} from 'lucide-react'
import {
  QUEUE_SERVICES,
  QUEUE_PROFILE,
  getQueueService,
  makeQueueNumber,
  queueEstimate,
  STAFF_CUSTOMER,
} from '../data/scenarios.js'
import { SectionLabel, Brand } from './ui.jsx'
import { getIcon } from './icons.jsx'

// ── True App chrome (phone header) ────────────────────────────────────────
// The title chip doubles as a hidden entry point to the staff console — handy
// for the live demo (tap it to show what the counter sees).
function AppBar({ title, onBack, onOpenStaff }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-true px-3 py-3 text-white">
      <button
        onClick={onBack}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg active:scale-90"
        aria-label="Back"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
      </button>
      <div className="flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[13px] font-bold text-true">
          T
        </span>
        <span className="text-[14px] font-bold">True App</span>
      </div>
      <button
        onClick={onOpenStaff}
        className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold transition active:scale-95 hover:bg-white/30"
        title="Open staff console"
      >
        {title}
      </button>
    </div>
  )
}

export default function Queue() {
  const [step, setStep] = useState('landing') // landing | service | docs | book | ticket
  const [serviceId, setServiceId] = useState(null)
  const [ticked, setTicked] = useState({}) // doc index → bool
  const [identified, setIdentified] = useState(false) // True account attached?
  const [booking, setBooking] = useState(null) // { number, waitMin, position }
  const [showStaff, setShowStaff] = useState(false) // hidden staff console overlay

  const service = serviceId ? getQueueService(serviceId) : null
  const profile = serviceId ? QUEUE_PROFILE[serviceId] : null
  const requiredIdx = useMemo(
    () => (service ? service.docs.map((d, i) => (d.required ? i : -1)).filter((i) => i >= 0) : []),
    [service],
  )
  const allRequiredTicked = requiredIdx.every((i) => ticked[i])

  const back = () => {
    if (step === 'service') return setStep('landing')
    if (step === 'docs') return setStep('service')
    if (step === 'book') return setStep('docs')
    if (step === 'ticket') return // ticket is terminal
  }

  const pickService = (id) => {
    setServiceId(id)
    setTicked({})
    setIdentified(false)
    setStep('docs')
  }

  // Inside the True App we already know who they are (phone number = login),
  // so once they confirm what to bring we go straight to the booking summary
  // and attach their account automatically — no extra "link your number" step.
  const confirmDocs = () => {
    setIdentified(!!profile)
    setStep('book')
  }

  const confirmBook = () => {
    // deterministic (stable across runs) so the live demo never shows a jarring number
    const { waitMin, position } = queueEstimate(serviceId)
    setBooking({ number: makeQueueNumber(serviceId), waitMin, position })
    setStep('ticket')
  }

  if (step === 'landing')
    return (
      <>
        <Landing onStart={() => setStep('service')} />
        {showStaff && <StaffConsole onClose={() => setShowStaff(false)} />}
      </>
    )

  return (
    <div className="flex flex-1 flex-col">
      <AppBar title="Book a Queue" onBack={back} onOpenStaff={() => setShowStaff(true)} />

      {step === 'service' && <ServiceSelect onPick={pickService} />}

      {step === 'docs' && service && (
        <Docs
          service={service}
          ticked={ticked}
          setTicked={setTicked}
          allRequiredTicked={allRequiredTicked}
          onConfirm={confirmDocs}
        />
      )}

      {step === 'book' && service && (
        <Book
          service={service}
          profile={profile}
          identified={identified}
          onToggleIdentified={setIdentified}
          onConfirm={confirmBook}
        />
      )}

      {step === 'ticket' && service && booking && (
        <Ticket
          service={service}
          profile={profile}
          identified={identified}
          booking={booking}
          onAgain={() => {
            setServiceId(null)
            setStep('service')
          }}
          onHome={() => {
            setServiceId(null)
            setStep('landing')
          }}
        />
      )}

      {showStaff && <StaffConsole onClose={() => setShowStaff(false)} />}
    </div>
  )
}

// ── Step 0: landing (standalone True Queue) ───────────────────────────────
function Landing({ onStart }) {
  return (
    <div className="flex flex-1 flex-col px-5 pb-10 pt-7">
      <div className="anim-fadeUp flex items-center justify-between">
        <Brand sub="Queue" />
      </div>

      <div className="anim-fadeUp mt-7" style={{ animationDelay: '0.05s' }}>
        <h1 className="text-[26px] font-bold leading-tight text-ink">
          Book your True Shop
          <br />
          visit from home
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Pick what you're coming in for, see exactly <b className="text-ink">what to bring</b>, and
          <b className="text-ink"> book your spot</b> — so you skip the wait and walk straight in when it's your turn.
        </p>
      </div>

      <div className="anim-fadeUp mt-6 rounded-2xl border border-true/15 bg-true-soft p-4 shadow-card" style={{ animationDelay: '0.1s' }}>
        <SectionLabel>Why True Queue</SectionLabel>
        <ul className="flex flex-col gap-1.5">
          {['Pick a service and see exactly what to bring', 'Book your spot from home — no waiting at the shop', 'Get notified in the app or on LINE when your turn is near'].map((t) => (
            <li key={t} className="flex gap-1.5 text-[13px] leading-snug text-ink">
              <span className="text-true">›</span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="anim-fadeUp mt-auto pt-8" style={{ animationDelay: '0.22s' }}>
        <button
          onClick={onStart}
          className="w-full rounded-xl bg-true py-3.5 text-[16px] font-bold text-white shadow-pop transition active:scale-[0.98]"
        >
          Book a queue →
        </button>
      </div>
    </div>
  )
}

// ── Step 1: choose a service ──────────────────────────────────────────────
function ServiceSelect({ onPick }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <div className="anim-fadeUp">
        <h1 className="text-[20px] font-bold leading-tight text-ink">What are you coming in for?</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          Pick a service and book your queue from home — no waiting at the shop.
        </p>
      </div>

      <div className="stagger grid grid-cols-2 gap-3">
        {QUEUE_SERVICES.map((s) => {
          const Icon = getIcon(s.icon)
          return (
          <button
            key={s.id}
            onClick={() => onPick(s.id)}
            className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-white p-3.5 text-left shadow-card transition active:scale-[0.97] hover:border-true/40 hover:shadow-pop"
          >
            <Icon className="h-7 w-7 text-true" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-[14px] font-bold leading-tight text-ink">{s.title}</span>
            <span className="text-[11px] leading-snug text-ink-soft">{s.sub}</span>
            {s.fastLane && (
              <span className="mt-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Fast Lane
              </span>
            )}
          </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 2: what to bring ─────────────────────────────────────────────────
function Docs({ service, ticked, setTicked, allRequiredTicked, onConfirm }) {
  const ServiceIcon = getIcon(service.icon)
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <div className="anim-fadeUp flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-card">
        <ServiceIcon className="h-7 w-7 shrink-0 text-true" strokeWidth={1.75} aria-hidden="true" />
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-ink">{service.title}</div>
          <div className="text-[12px] text-ink-soft">Go to: {service.counter}</div>
        </div>
      </div>

      <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
        <SectionLabel>What to bring (to get it done in one visit)</SectionLabel>
        <div className="flex flex-col gap-2">
          {service.docs.map((d, i) => {
            const on = !!ticked[i]
            const DocIcon = getIcon(d.icon)
            return (
              <button
                key={i}
                onClick={() => setTicked((t) => ({ ...t, [i]: !t[i] }))}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition active:scale-[0.99] ${
                  on ? 'border-emerald-300 bg-emerald-50' : 'border-line bg-white'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    on ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-ink-soft/30'
                  }`}
                >
                  {on && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
                </span>
                <DocIcon className="h-5 w-5 shrink-0 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className={`block text-[14px] font-medium ${on ? 'text-emerald-900' : 'text-ink'}`}>
                    {d.label}
                  </span>
                </span>
                {d.required ? (
                  <span className="shrink-0 rounded-full bg-true-soft px-2 py-0.5 text-[10px] font-bold text-true">
                    Required
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-cloud px-2 py-0.5 text-[10px] font-bold text-ink-mute">
                    If you have it
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-cloud px-3 py-2 text-[12px] leading-relaxed text-ink-soft">
          <Lightbulb className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          Bring everything so you don't have to come back — and spend less time at the counter.
        </p>
      </div>

      <div className="anim-fadeUp sticky bottom-0 -mx-4 mt-auto border-t border-line bg-white/95 px-4 pb-4 pt-3 backdrop-blur">
        <button
          onClick={onConfirm}
          disabled={!allRequiredTicked}
          className="w-full rounded-xl bg-true py-3.5 text-[15px] font-bold text-white shadow-pop transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-true/15 disabled:text-true/50 disabled:shadow-none"
        >
          {allRequiredTicked ? 'All set → Continue' : 'Check the required items first'}
        </button>
      </div>
    </div>
  )
}

// ── Step 3: pick branch + book ────────────────────────────────────────────
function Book({ service, profile, identified, onToggleIdentified, onConfirm }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
        <SectionLabel>Booking summary</SectionLabel>
        <Row k="Service" v={service.title} />
        <Row k="Go to" v={service.counter} />
        <Row k="Branch" v="True Shop · CentralWorld, Floor 3" />
        <Row k="Est. service time" v={`~${service.estMin} min`} vClass="tnum" />
        <Row
          k="Customer"
          v={identified && profile ? `${profile.name} · ${profile.plan}` : 'New customer — set up at the shop'}
        />

        {/* No-True-number / guest path. Tourists (no profile) are already guests. */}
        {profile && (
          <button
            onClick={() => onToggleIdentified(!identified)}
            className="mt-3 w-full rounded-xl border border-line bg-cloud px-3 py-2 text-[12px] font-medium text-ink-soft transition active:scale-[0.99] hover:border-true/30"
          >
            {identified
              ? "Booking for someone else, or don't have a True number? Continue as a new customer"
              : `Use my True account · ${profile.name}`}
          </button>
        )}
      </div>

      <div className="anim-fadeUp rounded-2xl border border-line bg-white p-3.5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">Choose a branch</span>
          <span className="text-[11px] text-ink-soft">Open 10:00–22:00</span>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-true/30 bg-true-soft px-3 py-2.5">
          <MapPin className="h-5 w-5 shrink-0 text-true" strokeWidth={1.75} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-bold text-ink">CentralWorld (Floor 3)</div>
            <div className="text-[11px] text-ink-soft">Moderate wait right now · afternoons are quieter</div>
          </div>
          <Check className="h-4 w-4 shrink-0 text-true" strokeWidth={2.5} aria-hidden="true" />
        </div>
      </div>

      <div className="anim-fadeUp sticky bottom-0 -mx-4 mt-auto border-t border-line bg-white/95 px-4 pb-4 pt-3 backdrop-blur">
        <button
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-true py-3.5 text-[16px] font-bold text-white shadow-pop transition active:scale-[0.98]"
        >
          <TicketIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Book a queue
        </button>
      </div>
    </div>
  )
}

function Row({ k, v, vClass = '' }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line py-2 last:border-0">
      <span className="text-[12px] text-ink-soft">{k}</span>
      <span className={`text-right text-[13px] font-semibold text-ink ${vClass}`}>{v}</span>
    </div>
  )
}

// ── Step 4: digital queue ticket ──────────────────────────────────────────
function Ticket({ service, profile, identified, booking, onAgain, onHome }) {
  const ServiceIcon = getIcon(service.icon)
  return (
    <div className="flex flex-1 flex-col items-center px-5 py-7">
      <div className="anim-fadeIn mb-3 flex items-center justify-center gap-1.5 text-center text-[13px] font-semibold text-emerald-600">
        <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" /> Queue booked
      </div>

      <div className="anim-ticket w-full max-w-[320px] origin-top rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-dashed border-line pb-3">
          <div className="flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-true text-[12px] font-bold text-white">
              T
            </span>
            <span className="text-[12px] font-bold text-ink">True Shop · CentralWorld</span>
          </div>
          <span className="text-[11px] text-ink-soft">Digital queue ticket</span>
        </div>

        <div className="py-4 text-center">
          <div className="text-[11px] font-medium uppercase tracking-wider text-ink-mute">
            Your queue number
          </div>
          <div className="tnum mt-1 text-[52px] font-extrabold leading-none tracking-tight text-true">
            {booking.number}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1 text-[12px] font-semibold text-ink-soft">
            <ServiceIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> {service.title}
          </div>
        </div>

        {/* wait estimate */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-true-soft p-3 text-center">
            <div className="text-[10px] font-medium text-true">Approx. wait</div>
            <div className="tnum text-[22px] font-extrabold leading-tight text-true">{booking.waitMin} min</div>
          </div>
          <div className="rounded-xl bg-cloud p-3 text-center">
            <div className="text-[10px] font-medium text-ink-soft">Ahead of you</div>
            <div className="tnum text-[22px] font-extrabold leading-tight text-ink">{booking.position} in line</div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
          <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-true" aria-hidden="true" /> Live updates — feel free to walk around, no need to wait at the shop.
        </div>

        {/* booking confirmation */}
        <div className="mt-3 rounded-xl bg-emerald-50 p-3">
          {identified && profile ? (
            <>
              <div className="mb-1.5 flex items-center justify-center gap-1.5 text-center text-[12px] font-bold text-emerald-800">
                <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" /> Booked with your True account
              </div>
              <div className="flex items-center justify-center gap-2 text-[12px] text-emerald-900">
                <User className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" /> {profile.name} · {profile.plan}
              </div>
            </>
          ) : (
            <div className="text-center text-[12px] font-medium text-emerald-900">
              New customer — bring the items listed and the team will set you up at the shop.
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-center text-[11px] font-medium text-blue-900">
          <Bell className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          We'll notify you in the app or on LINE when your turn is near — feel free to step out.
        </div>

        <div className="mt-3 border-t border-dashed border-line pt-3 text-center text-[10px] leading-relaxed text-ink-mute">
          Everything's ready when it's your turn
          <br />
          so service is faster and you don't start from scratch.
        </div>
      </div>

      <div className="anim-fadeUp mt-6 flex w-full max-w-[320px] gap-2.5" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={onAgain}
          className="flex-1 rounded-xl bg-true py-3 text-[14px] font-bold text-white shadow-pop transition active:scale-[0.98]"
        >
          Book another service
        </button>
        <button
          onClick={onHome}
          className="flex-1 rounded-xl border border-line bg-white py-3 text-[13px] font-semibold text-ink-soft transition active:scale-[0.98]"
        >
          Back to home
        </button>
      </div>
    </div>
  )
}

// ── Hidden: Service Staff console (laptop view at the counter) ─────────────
// Full-screen overlay so it escapes the phone frame and reads like a desktop.
// Opened from the AppBar title chip — a discreet entry point for the demo.
const INSIGHT_ICON = { trendingup: TrendingUp, video: Video, phone: Phone }
const TONE = {
  true: { ring: 'border-true/30', chip: 'bg-true-soft text-true', accent: 'text-true' },
  violet: { ring: 'border-violet-200', chip: 'bg-violet-100 text-violet-700', accent: 'text-violet-700' },
  emerald: { ring: 'border-emerald-200', chip: 'bg-emerald-100 text-emerald-700', accent: 'text-emerald-700' },
}

function StaffConsole({ onClose }) {
  const c = STAFF_CUSTOMER
  const dataPct = Math.round((c.usage.data.used / c.usage.data.cap) * 100)
  const callPct = Math.round((c.usage.calls.used / c.usage.calls.included) * 100)
  const maxTrend = Math.max(...c.usage.trend)

  return (
    <div className="anim-fadeIn fixed inset-0 z-50 overflow-y-auto bg-slate-100">
      {/* console top bar */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-true text-[14px] font-bold text-white">
          T
        </span>
        <div className="min-w-0">
          <div className="text-[14px] font-bold leading-tight text-ink">Service Staff Console</div>
          <div className="text-[11px] text-ink-soft">True Shop · CentralWorld · Counter view</div>
        </div>
        <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Customer at counter
        </span>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-ink-soft transition active:scale-90 hover:bg-slate-50"
          aria-label="Close staff console"
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </button>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7">
        {/* customer header */}
        <div className="anim-fadeUp rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-true-soft text-true">
                <User className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[19px] font-bold text-ink">{c.name}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    {c.tier}
                  </span>
                </div>
                <div className="text-[12px] text-ink-soft">
                  {c.phone} · {c.plan} ({c.planDetail})
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Pill label="Reason for visit" value={c.reason} />
              <Pill label="Customer for" value={c.tenure} />
              <Pill label="ARPU" value={`฿${c.arpu}/mo`} />
              <Pill label="Account" value={c.status} tone="emerald" />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-5">
          {/* left: usage + insights */}
          <div className="flex flex-col gap-5 lg:col-span-3">
            {/* usage this cycle */}
            <section className="anim-fadeUp rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ animationDelay: '0.05s' }}>
              <h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ink">
                <Database className="h-4 w-4 text-true" strokeWidth={2} aria-hidden="true" /> Usage this billing cycle
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Meter
                  icon={Wifi}
                  label="Mobile data"
                  used={`${c.usage.data.used} GB`}
                  of={`${c.usage.data.cap} GB cap`}
                  pct={dataPct}
                  over={dataPct > 100}
                />
                <Meter
                  icon={Phone}
                  label="Call minutes"
                  used={`${c.usage.calls.used} min`}
                  of={`${c.usage.calls.included} incl.`}
                  pct={callPct}
                  over={callPct > 100}
                />
              </div>

              {/* 6-month data trend */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[11px] text-ink-soft">
                  <span>Data usage · last 6 months (GB)</span>
                  <span className="font-semibold text-true">Cap {c.usage.data.cap}GB</span>
                </div>
                <div className="flex items-end gap-2" style={{ height: '84px' }}>
                  {c.usage.trend.map((g, i) => {
                    const over = g > c.usage.data.cap
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                        <span className={`text-[10px] font-semibold ${over ? 'text-true' : 'text-ink-soft'}`}>{g}</span>
                        <div
                          className={`w-full rounded-t-md ${over ? 'bg-true' : 'bg-slate-300'}`}
                          style={{ height: `${Math.round((g / maxTrend) * 60)}px` }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-soft">
                <span>Peak: <b className="text-ink">{c.usage.peak}</b></span>
                <span>Top apps: <b className="text-ink">{c.usage.topApps.join(', ')}</b></span>
              </div>
            </section>

            {/* behaviour insights */}
            <section className="anim-fadeUp rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ animationDelay: '0.1s' }}>
              <h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ink">
                <Brain className="h-4 w-4 text-violet-600" strokeWidth={2} aria-hidden="true" /> What the data tells us
              </h2>
              <ul className="flex flex-col gap-2.5">
                {c.insights.map((it, i) => {
                  const Icon = INSIGHT_ICON[it.icon] || Sparkles
                  return (
                    <li key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" strokeWidth={2} aria-hidden="true" />
                      <span className="text-[13px] leading-snug text-ink">{it.text}</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>

          {/* right: recommendations + next action */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <section className="anim-fadeUp rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ animationDelay: '0.12s' }}>
              <h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ink">
                <Sparkles className="h-4 w-4 text-true" strokeWidth={2} aria-hidden="true" /> Recommended for this customer
              </h2>
              <div className="flex flex-col gap-3">
                {c.recommend.map((r, i) => {
                  const t = TONE[r.tone] || TONE.true
                  return (
                    <div key={i} className={`rounded-xl border ${t.ring} bg-white p-3.5`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${t.chip}`}>
                          {r.tag}
                        </span>
                        <span className={`text-[12px] font-bold ${t.accent}`}>{r.delta}</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between gap-2">
                        <span className="text-[14px] font-bold text-ink">{r.name}</span>
                        <span className="tnum text-[13px] font-semibold text-ink-soft">{r.price}</span>
                      </div>
                      <div className="mt-1 text-[12px] font-medium text-ink">{r.data}</div>
                      {r.extra && <div className="text-[11px] text-ink-soft">{r.extra}</div>}
                      <p className="mt-2 border-t border-slate-100 pt-2 text-[12px] leading-snug text-ink-soft">
                        {r.why}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* retention */}
            <section className="anim-fadeUp rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm" style={{ animationDelay: '0.16s' }}>
              <div className="flex items-center gap-2 text-[12px] font-bold text-emerald-800">
                <TrendingUp className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> {c.retention.level}
              </div>
              <p className="mt-1 text-[12px] leading-snug text-emerald-900">{c.retention.note}</p>
            </section>

            {/* next best action */}
            <section className="anim-fadeUp rounded-2xl border border-true/20 bg-true-soft p-4 shadow-sm" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 text-[12px] font-bold text-true">
                <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Suggested talking point
              </div>
              <p className="mt-1 text-[13px] leading-snug text-ink">{c.nextBest}</p>
            </section>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-ink-mute">
          The customer booked from home — by the time they reach the counter, the team already sees this.
        </p>
      </div>
    </div>
  )
}

function Pill({ label, value, tone }) {
  return (
    <div className={`rounded-xl border px-3 py-1.5 ${tone === 'emerald' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
      <div className="text-[9px] font-medium uppercase tracking-wide text-ink-mute">{label}</div>
      <div className={`text-[12px] font-bold ${tone === 'emerald' ? 'text-emerald-700' : 'text-ink'}`}>{value}</div>
    </div>
  )
}

function Meter({ icon: Icon, label, used, of, pct, over }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft">
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className={`tnum text-[20px] font-extrabold leading-none ${over ? 'text-true' : 'text-ink'}`}>{used}</span>
        <span className="text-[11px] text-ink-soft">/ {of}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${over ? 'bg-true' : 'bg-slate-400'}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      {over && <div className="mt-1 text-[10px] font-semibold text-true">{pct}% — over limit</div>}
    </div>
  )
}
