import { useState } from 'react'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(() => !!localStorage.getItem('rouge-waitlist'))

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return
    localStorage.setItem('rouge-waitlist', email)
    setDone(true)
  }

  return (
    <section id="cta" className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <img src="/media/hero.jpg" alt="" className="h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-6 py-32 text-center">
        <p className="kicker" data-reveal>Autumn 2026 — numbered first edition</p>
        <h2 className="display mt-8 text-6xl text-cream md:text-8xl" data-reveal>
          Reserve your
          <span className="serif-i block text-blood">number.</span>
        </h2>
        <p className="serif-i mt-8 max-w-lg text-xl text-cream/70" data-reveal>
          Four shades. Five thousand cases. Each collar ring engraved with its place in
          the edition. When they are gone, they are gone.
        </p>

        {done ? (
          <p className="mt-12 border border-blood/50 bg-rouge/15 px-8 py-4 text-sm uppercase tracking-[0.25em] text-cream" data-reveal>
            You&apos;re on the list — Maison Rouge will write to you.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-12 flex w-full max-w-md" data-reveal>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@address.com"
              data-cursor
              className="min-w-0 flex-1 border border-cream/20 bg-ink/70 px-5 py-4 text-sm tracking-wide text-cream outline-none transition-colors focus:border-blood"
            />
            <button
              type="submit"
              data-cursor
              className="border border-blood bg-rouge/25 px-7 py-4 text-[0.66rem] uppercase tracking-[0.3em] text-cream transition-colors hover:bg-rouge/50"
            >
              Reserve
            </button>
          </form>
        )}
        <p className="mt-6 text-[0.62rem] uppercase tracking-[0.3em] text-mute" data-reveal>
          $58 — engraved case included
        </p>
      </div>
    </section>
  )
}
