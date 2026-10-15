import { ArrowRight, Blocks, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = ["Next.js com App Router", "Tailwind e shadcn/ui", "Vitest e Playwright"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container flex min-h-screen max-w-4xl flex-col justify-center py-20">
        <div className="mb-8 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Blocks aria-hidden="true" className="size-6" />
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Template Bun
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Um frontend pronto para evoluir.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Uma base moderna para construir produtos com velocidade, consistência e confiança.
        </p>
        <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          {features.map((feature) => (
            <li className="flex items-center gap-2" key={feature}>
              <Check aria-hidden="true" className="size-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Button asChild>
            <a href="https://nextjs.org/docs" rel="noreferrer" target="_blank">
              Começar agora <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
