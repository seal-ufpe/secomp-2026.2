import Image from "next/image"

const links = [
  { href: "https://seal.cin.ufpe.br/", src: "/seal-icon.png", alt: "SEAL" },
  { href: "https://cin.ufpe.br/", src: "/cin-ufpe-logo.png", alt: "CIn UFPE" },
  { href: "https://www.ufpe.br/", src: "/ufpe-logo.png", alt: "UFPE" },
  { href: "https://github.com/seal-ufpe", src: "/github-icon.png", alt: "GitHub" }
]

export function FooterBar() {
  return (
    <footer className="mt-12 border-t-4 border-navy bg-neon px-4 py-3 text-[9px] font-bold uppercase text-navy">
      <div className="container flex flex-wrap items-center justify-between gap-3">
        <span>
          Do "Preciso Disso" ao Deploy: Como uma necessidade vira software
        </span>

        <span className="flex flex-row items-center gap-8 tracking-[0.16em]">
          {links.map(({ href, src, alt }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Image src={src} alt={alt} width={32} height={32} className="h-auto w-10" />
            </a>
          ))}
        </span>
      </div>
    </footer>
  )
}