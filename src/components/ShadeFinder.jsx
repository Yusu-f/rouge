import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SHADES } from '../shades.js'
import TiltCard from './TiltCard.jsx'

const UNDERTONES = ['Cool', 'Neutral', 'Warm']
const MOODS = ['Everyday', 'Statement']

// deterministic little matcher
function match(undertone, mood) {
  if (mood === 'Everyday') return undertone === 'Warm' ? 'coral' : 'bare'
  return undertone === 'Cool' ? 'berry' : 'scarlet'
}

export default function ShadeFinder() {
  const [undertone, setUndertone] = useState('Neutral')
  const [mood, setMood] = useState('Statement')
  const pick = useMemo(() => match(undertone, mood), [undertone, mood])

  const Pill = ({ value, current, set }) => (
    <button
      type="button"
      data-cursor
      onClick={() => set(value)}
      className={`border px-5 py-2 text-[0.66rem] uppercase tracking-[0.28em] transition-all duration-300 ${
        current === value
          ? 'border-blood bg-rouge/25 text-cream'
          : 'border-cream/15 text-mute hover:border-cream/40 hover:text-cream'
      }`}
    >
      {value}
    </button>
  )

  return (
    <section id="shades" className="relative bg-ink2 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker" data-reveal>Shade finder</p>
            <h2 className="display mt-6 text-5xl text-cream md:text-7xl" data-reveal>
              Find your <span className="serif-i text-blood">rouge.</span>
            </h2>
          </div>
          <div className="space-y-4" data-reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 text-[0.62rem] uppercase tracking-[0.3em] text-mute">Undertone</span>
              {UNDERTONES.map((u) => (
                <Pill key={u} value={u} current={undertone} set={setUndertone} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 text-[0.62rem] uppercase tracking-[0.3em] text-mute">Mood</span>
              {MOODS.map((m) => (
                <Pill key={m} value={m} current={mood} set={setMood} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SHADES.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard shade={s} matched={pick === s.id} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
