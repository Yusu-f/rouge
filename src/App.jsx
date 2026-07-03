import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { TubeScene } from './three/TubeScene.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Showcase from './components/Showcase.jsx'
import FilmReveal from './components/FilmReveal.jsx'
import Formula from './components/Formula.jsx'
import ShadeFinder from './components/ShadeFinder.jsx'
import ShadeSpin from './components/ShadeSpin.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import ParticleField from './components/ParticleField.jsx'

gsap.registerPlugin(ScrollTrigger)

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ss = (v, a, b) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t

export default function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const state = window.__rouge
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // --- smooth scroll
    let lenis = null
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      state.lenis = lenis
    }

    // --- 3D scene
    const scene = new TubeScene(canvasRef.current)
    state.sceneObj = scene

    const tick = (time, deltaMS) => {
      if (lenis) lenis.raf(time * 1000)
      scene.update(state, Math.min(0.1, deltaMS / 1000))
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // --- pinned scroll beats write progress into shared state
    state.pinRanges = {}
    const pins = []
    const mkPin = (sel, key, len, onUpdate) => {
      pins.push(
        ScrollTrigger.create({
          trigger: sel,
          start: 'top top',
          end: `+=${len}%`,
          pin: true,
          scrub: true,
          onRefresh: (self) => {
            state.pinRanges[key] = { start: self.start, end: self.end }
          },
          onUpdate: (self) => {
            state[key] = self.progress
            if (onUpdate) onUpdate(self.progress)
          },
        }),
      )
    }

    // hero: the twist-up beat
    mkPin('#hero', 'hero', 100)

    // showcase: travelling tube + 3 callouts at p = 0.2 / 0.5 / 0.8
    const callouts = gsap.utils.toArray('[data-callout]')
    const PEAKS = [0.2, 0.5, 0.8]
    mkPin('#showcase', 'showcase', 320, (p) => {
      callouts.forEach((el, i) => {
        const bell = clamp01(1 - Math.abs(p - PEAKS[i]) / 0.13)
        el.style.opacity = ss(bell, 0, 1).toFixed(3)
        el.style.transform = `translateY(${(1 - bell) * 26 - 50}%)`
      })
    })

    // film: framed video grows to full-bleed
    const frame = document.querySelector('[data-film-frame]')
    const caption = document.querySelector('[data-film-caption]')
    mkPin('#film', 'film', 260, (p) => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const w0 = (vw < 768 ? 86 : 62) / 100
      const t = ss(p, 0.06, 0.55)
      const w = lerp(vw * w0, vw, t)
      const h = lerp(((vw * w0) * 9) / 16, vh, t)
      frame.style.width = `${w.toFixed(1)}px`
      frame.style.height = `${h.toFixed(1)}px`
      caption.style.opacity = (1 - ss(p, 0.02, 0.14)).toFixed(3)
    })

    // shade spin: 3 turns, 4 shades
    mkPin('#spin', 'spin', 440)

    // --- parallax layers
    const parallaxTriggers = gsap.utils.toArray('[data-parallax]').map((el) =>
      gsap.fromTo(
        el,
        { yPercent: 0 },
        {
          yPercent: parseFloat(el.dataset.parallax),
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      ),
    )

    // --- scroll reveals
    const reveals = gsap.utils.toArray('[data-reveal]').map((el) =>
      gsap.from(el, {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      }),
    )

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      pins.forEach((p) => p.kill())
      parallaxTriggers.forEach((t) => t.scrollTrigger?.kill())
      reveals.forEach((t) => t.scrollTrigger?.kill())
      lenis?.destroy()
      scene.dispose()
    }
  }, [])

  return (
    <>
      {/* 3D tube — travels across every beat; above section bgs, below nav */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[35] h-full w-full"
        aria-hidden="true"
      />
      <ParticleField />
      <Cursor />
      <Nav />
      <main className="relative z-30">
        <Hero />
        <Showcase />
        <FilmReveal />
        <Formula />
        <ShadeFinder />
        <ShadeSpin />
        <CTA />
        <Footer />
      </main>
    </>
  )
}
