import { useEffect, useRef } from 'react'

// Pinned 260vh. A framed 62vw video scales to full-bleed as you scroll.
// Playback is driven idempotently from the scroll loop (hidden-tab
// energy-saver pauses muted videos; never trust a one-shot play()).
export default function FilmReveal() {
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    let id = setInterval(() => {
      const p = window.__rouge.film
      const inRange = p > 0.12 && p < 0.98
      if (inRange && v.paused) v.play().catch(() => {})
      if (!inRange && !v.paused) v.pause()
    }, 250)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="film" className="relative flex h-screen items-center justify-center overflow-hidden bg-ink">
      <img
        src="/media/silk_black.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink/55" />

      <div
        data-film-frame
        className="film-frame relative w-[86vw] overflow-hidden md:w-[62vw]"
        style={{ aspectRatio: '16 / 9' }}
      >
        <video
          ref={videoRef}
          src="/media/film.mp4"
          poster="/media/film_poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </div>

      <div
        data-film-caption
        className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="kicker">The ritual, in motion</p>
        <p className="serif-i mt-3 text-2xl text-cream/85 md:text-3xl">
          Pigment, poured like silk.
        </p>
      </div>
    </section>
  )
}
