import { useEffect, useState } from 'react'
import { SHADES } from '../shades.js'

// Pinned 440vh. The WebGL tube spins centre-stage (3 turns = 4 shades);
// this component syncs the giant name, meta and background tint.
// CustomEvent PLUS a polling fallback: one-shot events get missed around
// teleported scrolls in hidden tabs.
export default function ShadeSpin() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const onShade = (e) => setIdx(e.detail)
    window.addEventListener('rouge:shade', onShade)
    const id = setInterval(() => setIdx(window.__rouge.tierIndex), 200)
    return () => {
      window.removeEventListener('rouge:shade', onShade)
      clearInterval(id)
    }
  }, [])

  const s = SHADES[idx]

  return (
    <section id="spin" className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: s.tint }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />

      {/* giant shade name behind the tube */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          key={s.id}
          className="display select-none text-[24vw] uppercase leading-none tracking-tight text-cream/12 md:text-[19vw]"
          aria-hidden="true"
        >
          {s.name}
        </span>
      </div>

      <div className="absolute left-6 top-24 md:left-16">
        <p className="kicker">The shades</p>
        <h2 className="display mt-4 text-4xl text-cream md:text-5xl">
          Turn the <span className="serif-i text-blood">wheel.</span>
        </h2>
      </div>

      {/* synced meta */}
      <div className="absolute bottom-16 left-6 right-6 md:bottom-20 md:left-16 md:right-auto md:w-[26rem]">
        <div className="flex items-center gap-4">
          <span
            className="h-10 w-10 rounded-full border border-cream/25 transition-colors duration-500"
            style={{ backgroundColor: s.bullet }}
          />
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-mute">
              {s.no} / 04 — {s.finish}
            </p>
            <p className="display text-3xl text-cream">{s.name}</p>
          </div>
        </div>
        <p className="serif-i mt-4 text-xl text-cream/75">{s.line}</p>
        <div className="mt-6 flex gap-2">
          {SHADES.map((t, i) => (
            <span
              key={t.id}
              className="h-[3px] flex-1 transition-all duration-500"
              style={{ backgroundColor: i === idx ? t.bullet : 'rgba(242,231,224,0.15)' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
