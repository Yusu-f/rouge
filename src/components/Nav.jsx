export default function Nav() {
  const go = (id) => (e) => {
    e.preventDefault()
    const el = document.querySelector(id)
    if (el && window.__rouge.lenis) window.__rouge.lenis.scrollTo(el, { offset: 0 })
    else el?.scrollIntoView()
  }
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#hero"
          onClick={go('#hero')}
          className="display text-2xl tracking-[0.18em] text-cream"
          data-cursor
        >
          ROUGE
        </a>
        <nav className="hidden items-center gap-8 text-[0.68rem] font-normal uppercase tracking-[0.32em] text-mute md:flex">
          <a href="#shades" onClick={go('#spin')} className="transition-colors hover:text-cream" data-cursor>
            Shades
          </a>
          <a href="#formula" onClick={go('#formula')} className="transition-colors hover:text-cream" data-cursor>
            Formula
          </a>
          <a href="#film" onClick={go('#film')} className="transition-colors hover:text-cream" data-cursor>
            Film
          </a>
        </nav>
        <a
          href="#cta"
          onClick={go('#cta')}
          data-cursor
          className="border border-rouge/60 px-5 py-2 text-[0.66rem] uppercase tracking-[0.3em] text-cream transition-colors hover:bg-rouge/20"
        >
          Reserve
        </a>
      </div>
    </header>
  )
}
