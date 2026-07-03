// Pinned 320vh. The tube travels left/right; three callouts fade at
// progress peaks 0.2 / 0.5 / 0.8 (canvas rotY snaps face-on at each, kf'd in TubeScene).
const CALLOUTS = [
  {
    at: 'right',
    no: 'I',
    title: 'Lacquered armour',
    body: 'A weighted, piano-black case, polished to a mirror and banded in crimson. It closes with the click of a jewel box.',
  },
  {
    at: 'left',
    no: 'II',
    title: 'One-stroke pigment',
    body: 'Sixty-eight percent pigment load, milled eight times. Full coverage in a single pass — no ghosting, no feathering.',
  },
  {
    at: 'right',
    no: 'III',
    title: 'The signature ring',
    body: 'Every shade wears its own metal ring at the collar. A quiet tell, for those who know.',
  },
]

export default function Showcase() {
  return (
    <section id="showcase" className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink2/60 to-ink" />
      <div className="absolute left-1/2 top-24 -translate-x-1/2 text-center">
        <p className="kicker">The object</p>
      </div>

      {CALLOUTS.map((c, i) => (
        <div
          key={c.no}
          data-callout={i}
          className={`absolute top-1/2 w-[78vw] max-w-sm -translate-y-1/2 bg-ink/55 p-5 opacity-0 backdrop-blur-[2px] md:w-[34vw] md:bg-transparent md:p-0 md:backdrop-blur-none ${
            c.at === 'right' ? 'right-[8vw] text-left' : 'left-[8vw] text-left'
          }`}
        >
          <p className="serif-i text-4xl text-blood/90">{c.no}</p>
          <h3 className="display mt-3 text-4xl text-cream md:text-5xl">{c.title}</h3>
          <p className="mt-5 max-w-xs font-light leading-relaxed text-mute">{c.body}</p>
          <span className="hairline mt-6 block w-24" />
        </div>
      ))}
    </section>
  )
}
