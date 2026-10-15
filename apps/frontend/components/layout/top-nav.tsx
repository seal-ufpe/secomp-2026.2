import Link from "next/link";

export function TopNav() {
  return (
    <header className="border-b-2 border-neon bg-navy">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="font-black uppercase tracking-widest text-neon">Galeria Deploy</Link>
        <Link href="/cadastrar" className="text-sm font-bold uppercase text-foreground hover:text-neon">Cadastrar projeto</Link>
      </nav>
    </header>
  );
}
