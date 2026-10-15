"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BlockText } from "@/components/ui/block-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ProjectCard, type ProjectCardData } from "@/components/project-card";
import { useLiveProjects } from "@/hooks/use-live-projects";
import { filterProjects, type ProjectOriginFilter } from "@/lib/projects";

export function GalleryClient() {
  const { projects, connectionState } = useLiveProjects();
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("all");
  const filtered = useMemo(() => filterProjects(projects, query, origin as ProjectOriginFilter), [origin, projects, query]);
  const status = connectionState === "live" ? "ao vivo" : connectionState === "polling" ? "atualizando a cada 5 s" : "reconectando";
  return <main className="container min-h-[calc(100vh-140px)] py-8">
    <div className="mb-7"><p className="eyebrow mb-2">/// GALERIA DE PROJETOS</p><div className="flex flex-col gap-5 border-l-4 border-neon bg-magenta px-4 py-5 sm:flex-row sm:items-end sm:justify-between"><div><BlockText>Uma linha até o ar.</BlockText><p className="mt-3 max-w-xl text-[11px]">Acompanhe as conexões e os últimos projetos publicados pela turma, sem sair do controle.</p></div><Link href="/cadastrar"><Button>Novo projeto</Button></Link></div></div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="eyebrow" aria-live="polite"><span className="mr-2 inline-block size-2 bg-neon" />{status} · {projects.length} projetos no ar</p><span className="text-[9px] text-paper-yellow">04 ETAPAS · ● · CONECTADO</span></div>
    <div className="mb-7 grid gap-3 border border-magenta-dark bg-magenta-dark p-3 md:grid-cols-[1fr_180px]"><Input placeholder="Buscar por título ou autor" value={query} onChange={(event) => setQuery(event.target.value)} /><Select value={origin} onChange={(event) => setOrigin(event.target.value)} aria-label="Filtrar por origem"><option value="all">Todos os projetos</option><option value="lovable">Lovable</option><option value="base44">Base44</option></Select></div>
    {filtered.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((project) => <ProjectCard key={project._id} project={project as unknown as ProjectCardData} />)}</div> : <div className="border-2 border-neon bg-magenta p-8 text-center"><p className="eyebrow">/// SEM RESULTADOS</p><h2 className="mt-2 text-2xl font-black text-neon">{projects.length ? "Nada encontrado" : "Nenhum projeto ainda"}</h2><p className="mt-2 text-xs">{projects.length ? "Tente limpar os filtros." : "Seja o primeiro a publicar seu projeto."}</p><Link href="/cadastrar"><Button className="mt-6">{projects.length ? "Limpar filtros" : "Cadastrar projeto"}</Button></Link></div>}
  </main>;
}
