import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ shade, matched }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 180, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-11, 11]), { stiffness: 180, damping: 18 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <div style={{ perspective: 900 }}>
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className={`shade-card group relative overflow-hidden border bg-ink transition-colors duration-500 ${
          matched ? 'border-blood' : 'border-cream/10'
        }`}
        data-cursor
      >
        {matched && (
          <span className="absolute left-4 top-4 z-10 bg-blood px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-ink">
            Your match
          </span>
        )}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
          <img
            src={shade.img}
            alt={`ROUGE ${shade.name} — ${shade.finish} lipstick`}
            loading="lazy"
            className="h-full w-full scale-[1.02] object-cover transition-transform duration-700 group-hover:scale-[1.08]"
          />
          <div className="sheen pointer-events-none absolute inset-0" />
        </div>
        <div className="flex items-baseline justify-between px-5 pb-6 pt-5" style={{ transform: 'translateZ(24px)' }}>
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-mute">
              {shade.no} · {shade.finish}
            </p>
            <h3 className="display mt-2 text-3xl text-cream">{shade.name}</h3>
          </div>
          <span
            className="h-7 w-7 rounded-full border border-cream/20"
            style={{ backgroundColor: shade.bullet }}
            aria-hidden="true"
          />
        </div>
      </motion.article>
    </div>
  )
}
