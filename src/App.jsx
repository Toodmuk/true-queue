import PasswordGate from './components/PasswordGate.jsx'
import Queue from './components/Queue.jsx'

export default function App() {
  // Standalone True Queue (customer phone app). On phones it's full-bleed (QR scan);
  // on iPad/desktop/projector it floats as a framed device on a branded stage.
  return (
    <div className="device-stage relative min-h-full w-full md:flex md:min-h-screen md:items-center md:justify-center md:p-6">
      <div className="dotgrid pointer-events-none absolute inset-0 hidden opacity-70 md:block" aria-hidden="true" />
      <PasswordGate>
        {/* fluid height on large screens: the framed device hugs its content. */}
        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col bg-cloud no-scrollbar md:h-auto md:max-h-[calc(100vh-3rem)] md:min-h-0 md:w-[414px] md:overflow-y-auto md:rounded-[2.4rem] md:shadow-pop md:ring-1 md:ring-black/10">
          <Queue />
        </div>
      </PasswordGate>
    </div>
  )
}
