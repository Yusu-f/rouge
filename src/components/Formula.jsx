const STATS = [
  { k: '68%', label: 'Pigment load', body: 'Triple-milled, eight passes. Colour that arrives fully saturated on the first stroke.' },
  { k: '8h', label: 'Wear, unmoved', body: 'A flexible film-former locks pigment to the lip — through dinner, through the last glass.' },
  { k: '0', label: 'Transfer', body: 'Sets to a weightless velvet. Kisses collars goodbye, leaves nothing behind.' },
  { k: '3×', label: 'Ceramide silk', body: 'A lipid complex that treats wear time as skincare time. Lips come back softer.' },
]

export default function Formula() {
  return (
    <section id="formula" className="relative bg-ink py-28 md:py-40">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}media/smear.jpg`}
          alt=""
          data-parallax="-12"
          className="absolute inset-0 h-[115%] w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        <p className="kicker" data-reveal>Formula &amp; finish</p>
        <h2 className="display mt-6 max-w-3xl text-5xl text-cream md:text-7xl" data-reveal>
          Velvet, engineered
          <span className="serif-i block text-blood">to misbehave.</span>
        </h2>
        <p className="serif-i mt-8 max-w-xl text-xl leading-relaxed text-cream/70 md:text-2xl" data-reveal>
          A matte that never chalks. A satin that never slips. The laboratory calls it a
          suspension of pigment in silk — we call it insurance.
        </p>

        <div className="mt-20 grid grid-cols-1 gap-px bg-rouge/20 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="group bg-ink p-8 transition-colors duration-500 hover:bg-maroon/60" data-reveal data-cursor>
              <p className="display text-6xl text-blood transition-transform duration-500 group-hover:-translate-y-1">{s.k}</p>
              <p className="mt-4 text-[0.68rem] uppercase tracking-[0.3em] text-cream/90">{s.label}</p>
              <p className="mt-4 text-sm font-light leading-relaxed text-mute">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
