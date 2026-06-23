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
} from 'lucide-react'
import { QUEUE_SERVICES, QUEUE_PROFILE, getQueueService, makeQueueNumber, queueEstimate } from '../data/scenarios.js'
import { SectionLabel, Brand } from './ui.jsx'
import { getIcon } from './icons.jsx'

// ── True App chrome (phone header) ────────────────────────────────────────
function AppBar({ title, onBack }) {
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
      <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
        {title}
      </span>
    </div>
  )
}

export default function Queue() {
  const [step, setStep] = useState('landing') // landing | service | docs | identify | book | ticket
  const [serviceId, setServiceId] = useState(null)
  const [ticked, setTicked] = useState({}) // doc index → bool
  const [phone, setPhone] = useState('')
  const [identified, setIdentified] = useState(false)
  const [booking, setBooking] = useState(null) // { number, waitMin, position }

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
    if (step === 'identify') return setStep('docs')
    if (step === 'book') return setStep(profile ? 'identify' : 'docs')
    if (step === 'ticket') return // ticket is terminal
  }

  const pickService = (id) => {
    setServiceId(id)
    setTicked({})
    setPhone('')
    setIdentified(false)
    setStep('docs')
  }

  const confirmDocs = () => setStep(profile ? 'identify' : 'book')

  const confirmBook = () => {
    // deterministic (stable across runs) so the live demo never shows a jarring number
    const { waitMin, position } = queueEstimate(serviceId)
    setBooking({ number: makeQueueNumber(serviceId), waitMin, position })
    setStep('ticket')
  }

  if (step === 'landing') return <Landing onStart={() => setStep('service')} />

  return (
    <div className="flex flex-1 flex-col">
      <AppBar title="Book a Queue" onBack={back} />

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

      {step === 'identify' && service && (
        <Identify
          service={service}
          profile={profile}
          phone={phone}
          setPhone={setPhone}
          identified={identified}
          onIdentify={() => setIdentified(true)}
          onConfirm={() => setStep('book')}
        />
      )}

      {step === 'book' && service && (
        <Book service={service} profile={profile} identified={identified} onConfirm={confirmBook} />
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
          Pick what you're coming in for and we'll <b className="text-ink">tell you what to bring</b>, then
          <b className="text-ink"> send your details ahead to the queue</b> — so staff are ready the moment it's your turn.
        </p>
      </div>

      <div className="anim-fadeUp mt-6 rounded-2xl border border-true/15 bg-true-soft p-4 shadow-card" style={{ animationDelay: '0.1s' }}>
        <SectionLabel>Why True Queue</SectionLabel>
        <ul className="flex flex-col gap-1.5">
          {['Pick a service and see exactly what to bring', 'Link your True number so staff are ready before you arrive', 'Get notified in the app or on LINE when your turn is near'].map((t) => (
            <li key={t} className="flex gap-1.5 text-[13px] leading-snug text-ink">
              <span className="text-true">›</span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onStart}
        className="anim-fadeUp mt-auto w-full rounded-xl bg-true py-3.5 text-[16px] font-bold text-white shadow-pop transition active:scale-[0.98]"
        style={{ animationDelay: '0.22s' }}
      >
        Book a queue →
      </button>
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

// ── Step 3: bind True number (pierce data) ────────────────────────────────
function Identify({ service, profile, phone, setPhone, identified, onIdentify, onConfirm }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <div className="anim-fadeUp">
        <h1 className="text-[19px] font-bold leading-tight text-ink">Link your True number</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          We'll share your details with staff ahead of time — so when it's your turn, they already know your case. <b className="text-ink">No need to explain again.</b>
        </p>
      </div>

      {!identified ? (
        <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
          <SectionLabel>Your True number</SectionLabel>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-cloud px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-true">
            <Phone className="h-4 w-4 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="08x-xxx-xxxx"
              className="w-full bg-transparent text-base font-medium text-ink outline-none"
            />
          </div>
          <button
            onClick={onIdentify}
            className="mt-3 w-full rounded-xl bg-true py-3 text-[15px] font-bold text-white shadow-sm transition active:scale-[0.98]"
          >
            Link my details
          </button>
          <p className="mt-2 text-center text-[11px] text-ink-mute">
            We'll pull your plan and history from your True account.
          </p>
        </div>
      ) : (
        <>
          <div className="anim-pop rounded-2xl border border-line bg-white p-4 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <SectionLabel>What we'll share with staff</SectionLabel>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Linked
              </span>
            </div>
            <div className="text-[16px] font-bold text-ink">{profile.name}</div>
            <div className="text-[12px] text-ink-soft">{profile.phone}</div>
            <div className="mt-3 rounded-xl bg-cloud px-3 py-2">
              <div className="text-[10px] text-ink-mute">Plan</div>
              <div className="text-[13px] font-semibold text-ink">{profile.plan}</div>
            </div>
            <div className="mt-2 rounded-xl bg-violet-50 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-700">
                <Brain className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Smart insights
              </div>
              <p className="text-[13px] leading-snug text-violet-900">{profile.insight}</p>
            </div>
          </div>

          <div className="anim-fadeUp sticky bottom-0 -mx-4 mt-auto border-t border-line bg-white/95 px-4 pb-4 pt-3 backdrop-blur">
            <button
              onClick={onConfirm}
              className="w-full rounded-xl bg-true py-3.5 text-[15px] font-bold text-white shadow-pop transition active:scale-[0.98]"
            >
              Send my details to the queue → Continue
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Step 4: pick branch + book ────────────────────────────────────────────
function Book({ service, profile, identified, onConfirm }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
        <SectionLabel>Booking summary</SectionLabel>
        <Row k="Service" v={service.title} />
        <Row k="Go to" v={service.counter} />
        <Row k="Branch" v="True Shop · CentralWorld, Floor 3" />
        <Row k="Est. service time" v={`~${service.estMin} min`} vClass="tnum" />
        <Row k="Customer details" v={identified && profile ? `Attached (${profile.name})` : 'New customer — fill in at the shop'} />
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

// ── Step 5: digital queue ticket ──────────────────────────────────────────
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

        {/* attached data */}
        <div className="mt-3 rounded-xl bg-emerald-50 p-3">
          {identified && profile ? (
            <>
              <div className="mb-1.5 flex items-center justify-center gap-1.5 text-center text-[12px] font-bold text-emerald-800">
                <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" /> Your details have been shared with staff
              </div>
              <div className="space-y-1 text-[12px] text-emerald-900">
                <div className="flex items-center gap-2"><User className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" /> {profile.name} · {profile.plan}</div>
                <div className="flex items-start gap-2"><Brain className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" /> {profile.insight}</div>
              </div>
            </>
          ) : (
            <div className="text-center text-[12px] font-medium text-emerald-900">
              New customer — bring the items listed and staff will set up your details at the shop.
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-center text-[11px] font-medium text-blue-900">
          <Bell className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          We'll notify you in the app or on LINE when your turn is near — feel free to step out.
        </div>

        <div className="mt-3 border-t border-dashed border-line pt-3 text-center text-[10px] leading-relaxed text-ink-mute">
          When it's your turn, staff already see your details and what you need
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
