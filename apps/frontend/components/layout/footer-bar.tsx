export function FooterBar() {
  return (
    <footer className="mt-12 border-t-4 border-navy bg-neon px-4 py-3 text-[9px] font-bold uppercase text-navy">
      <div className="container flex flex-wrap items-center justify-between gap-3">
        <span>Um só caminho. Do rascunho ao ar.</span>
        <span className="tracking-[0.16em]">⌘ deployhub · ♡ Lovable · ▰ Base44 · ▲ Vercel · ▣ GitHub</span>
      </div>
      <div className="mx-auto mt-3 size-1 bg-magenta" />
    </footer>
  );
}
