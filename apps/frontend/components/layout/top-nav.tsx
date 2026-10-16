import Link from 'next/link';
import { Activity, BookOpen } from 'lucide-react';

export function TopNav() {
  return (
    <header className="border-b-2 border-magenta-dark bg-navy">
      <nav className="container flex min-h-11 items-center justify-between gap-4 text-[10px] font-bold uppercase">
        <Link href="/" className="flex items-center gap-2 text-neon" aria-label="Deployhub início">
          <span className="grid size-6 place-items-center border border-neon text-[11px]"></span>
          <span className="tracking-tight">Seal na Secomp 2026</span>
        </Link>
        <div className="hidden items-stretch gap-1 text-foreground sm:flex">
          <Link
            href="/"
            className="flex items-center gap-2 border-b-2 border-neon bg-magenta-dark px-3 py-3 text-neon"
          >
            <Activity size={12} /> Projetos
          </Link>
          <Link
            href="/tutorials"
            className="flex items-center gap-2 border-b-2 border-transparent px-3 py-3 text-foreground transition-colors hover:border-neon hover:text-neon"
          >
            <BookOpen size={12} /> Tutoriais
          </Link>
        </div>
        <span className="hidden items-center gap-2 text-[8px] tracking-[0.12em] text-neon md:flex">
          <span className="size-2 bg-neon" /> AMBIENTE DE DEMONSTRAÇÃO
        </span>
      </nav>
    </header>
  );
}
