"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BlockText } from "@/components/ui/block-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ProjectCard, type ProjectCardData } from "@/components/project-card";
import { useLiveProjects } from "@/hooks/use-live-projects";

export function GalleryClient() {
  const { projects, connectionState } = useLiveProjects();
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("all");
  const filtered = useMemo(() => projects.filter((project) => (!query || `${project.title} ${project.authorName}`.toLowerCase().includes(query.toLowerCase())) && (origin === "all" || project.origin === origin)), [origin, projects, query]);
  const status = connectionState === "live" ? "ao vivo" : connectionState === "polling" ? "atualizando a cada 5 s" : "reconectando";
  return <main className="container min-h-[calc(100vh-140px)] py-12">
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><BlockText>Galeria do Minicurso</BlockText><p className="mt-4 text-lg">{projects.length} projetos no ar</p></div><Link href="/cadastrar"><Button>Cadastrar projeto</Button></Link></div>
    <p className="mt-4 flex items-center gap-2 text-sm" aria-live="polite"><span className="size-3 bg-neon" aria-hidden="true" /> {status}</p>
    <div className="my-8 grid gap-3 md:grid-cols-[1fr_180px]"><Input placeholder="Buscar por título ou autor" value={query} onChange={(event) => setQuery(event.target.value)} /><Select value={origin} onChange={(event) => setOrigin(event.target.value)} aria-label="Filtrar por origem"><option value="all">Todos</option><option value="lovable">Lovable</option><option value="base44">Base44</option></Select></div>
    {filtered.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((project) => <ProjectCard key={project._id} project={project as unknown as ProjectCardData} />)}</div> : <div className="border-2 border-neon bg-magenta p-8 text-center"><h2 className="text-2xl font-black text-neon">{projects.length ? "Nada encontrado" : "Nenhum projeto ainda"}</h2><p className="mt-2">{projects.length ? "Tente limpar os filtros." : "Seja o primeiro a publicar seu projeto."}</p><Link href="/cadastrar"><Button className="mt-6">{projects.length ? "Limpar filtros" : "Cadastrar projeto"}</Button></Link></div>}
  </main>;
}
