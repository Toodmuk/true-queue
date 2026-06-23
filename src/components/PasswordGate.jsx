import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Brand } from './ui.jsx'

// Soft gate (same style as the shopvisit-note site). Note: a client-side
// password is not real security — it just keeps casual visitors out.
const PASSWORD = 'Tng2026@'
const KEY = 'tq-unlocked-v1'

export default function PasswordGate({ children }) {
  const [ok, setOk] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)

  if (ok) return children

  const submit = (e) => {
    e.preventDefault()
    if (val.trim() === PASSWORD) {
      try {
        localStorage.setItem(KEY, '1')
      } catch {
        /* ignore */
      }
      setOk(true)
    } else {
      setErr(true)
    }
  }

  return (
    <div className="relative z-10 flex min-h-full flex-col items-center justify-center bg-cloud px-6 md:min-h-0 md:bg-transparent">
      <form onSubmit={submit} className="anim-pop w-full max-w-[340px] rounded-2xl border border-line bg-white p-6 shadow-card md:shadow-pop">
        <div className="flex justify-center">
          <Brand sub="Queue" />
        </div>
        <h1 className="mt-5 text-center text-[18px] font-bold text-ink">Sign in to True Queue</h1>
        <p className="mt-1 text-center text-[13px] leading-relaxed text-ink-soft">
          Enter your password to continue
        </p>

        <label htmlFor="tsf-pw" className="sr-only">Password</label>
        <div
          className={`mt-5 flex items-center gap-2 rounded-xl border bg-cloud px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-true/40 ${
            err ? 'border-true' : 'border-line'
          }`}
        >
          <Lock className="h-4 w-4 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
          <input
            id="tsf-pw"
            type="password"
            autoFocus
            autoComplete="current-password"
            aria-invalid={err}
            aria-describedby={err ? 'tsf-pw-err' : undefined}
            value={val}
            onChange={(e) => {
              setVal(e.target.value)
              setErr(false)
            }}
            placeholder="Password"
            className="w-full bg-transparent text-base text-ink outline-none"
          />
        </div>
        {err && <p id="tsf-pw-err" role="alert" className="mt-2 text-[12px] font-medium text-true">Incorrect password. Please try again.</p>}

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-true py-3 text-[15px] font-bold text-white shadow-sm transition active:scale-[0.98]"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
