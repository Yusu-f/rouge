export default function Footer() {
  return (
    <footer className="relative border-t border-cream/10 bg-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="display text-4xl tracking-[0.14em] text-cream">ROUGE</p>
          <p className="serif-i mt-3 text-mute">Le rouge éternel — Paris</p>
        </div>
        <nav className="flex gap-8 text-[0.64rem] uppercase tracking-[0.3em] text-mute">
          <a href="#" className="transition-colors hover:text-cream" data-cursor>Instagram</a>
          <a href="#" className="transition-colors hover:text-cream" data-cursor>Maison</a>
          <a href="#" className="transition-colors hover:text-cream" data-cursor>Presse</a>
        </nav>
        <p className="text-[0.62rem] uppercase tracking-[0.25em] text-mute/70">
          © MMXXVI Maison Rouge. Worn, not spoken.
        </p>
      </div>
    </footer>
  )
}
