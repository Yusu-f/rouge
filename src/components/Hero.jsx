import { motion } from 'framer-motion'

const fade = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* parallax silk layers (GSAP drives data-parallax) */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}media/silk_black.jpg`}
          alt=""
          data-parallax="-14"
          className="absolute inset-0 h-[118%] w-full object-cover opacity-90"
        />
        <img
          src={`${import.meta.env.BASE_URL}media/silk_red.jpg`}
          alt=""
          data-parallax="-30"
          className="absolute inset-0 h-[126%] w-full object-cover opacity-45 mix-blend-lighten"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_45%,transparent_0%,rgba(11,6,8,0.72)_78%)]" />
      </div>

      {/* giant back word */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden pb-2">
        <motion.span
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 0.14, y: 0 }}
          transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="display select-none text-[26vw] leading-none text-cream"
          aria-hidden="true"
        >
          ROUGE
        </motion.span>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16 lg:px-24">
        <motion.p
          {...fade}
          transition={{ duration: 1, delay: 0.25, ease: 'easeOut' }}
          className="kicker mb-6"
        >
          Maison Rouge — Paris · Nº1 Collection
        </motion.p>
        <motion.h1
          {...fade}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="display max-w-3xl text-[13vw] text-cream md:text-[7.2vw]"
        >
          Le rouge
          <span className="serif-i block pl-[0.6em] text-blood">éternel.</span>
        </motion.h1>
        <motion.p
          {...fade}
          transition={{ duration: 1, delay: 0.75, ease: 'easeOut' }}
          className="serif-i mt-8 max-w-md text-xl text-cream/75 md:text-2xl"
        >
          One bullet. Four moods. A single stroke rewrites the evening.
        </motion.p>
        <motion.div
          {...fade}
          transition={{ duration: 1, delay: 1.0, ease: 'easeOut' }}
          className="mt-12 flex items-center gap-5"
        >
          <span className="hairline w-16" />
          <span className="text-[0.66rem] uppercase tracking-[0.35em] text-mute">
            Scroll — the case opens
          </span>
        </motion.div>
      </div>
    </section>
  )
}
