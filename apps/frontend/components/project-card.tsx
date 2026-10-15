import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OriginBadge } from "@/components/ui/origin-badge";

export type ProjectCardData = {
  _id: string;
  title: string;
  authorName: string;
  origin: "lovable" | "base44";
  description?: string;
  url: string;
  host: string;
  previewImage?: string;
  createdAt: string;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Card className="overflow-hidden border-magenta-dark bg-magenta transition-transform motion-safe:animate-[slide-in_400ms_ease-out]">
      <div className="racks-duotone flex h-36 items-end border-b-2 border-navy p-4">
        {project.previewImage ? <img src={project.previewImage} alt="" className="relative z-10 h-full w-full object-cover" /> : <span className="relative z-10 text-5xl font-black text-neon">///</span>}
      </div>
      <div className="space-y-3 p-4">
        <p className="eyebrow">Projeto publicado</p>
        <h2 className="text-2xl font-black tracking-[-0.06em] text-neon">{project.title}</h2>
        <p className="text-xs">por {project.authorName}</p>
        <div className="pixel-rule" />
        <div className="flex items-center justify-between gap-2"><OriginBadge origin={project.origin} /><span className="truncate text-[10px]">{project.host}</span></div>
        <div className="flex items-center justify-between gap-2"><p className="text-[10px] text-paper-yellow">há {Math.max(1, Math.round((Date.now() - Date.parse(project.createdAt)) / 60000))} minutos</p><Button asChild size="sm"><a href={project.url} target="_blank" rel="noopener noreferrer">Abrir <ExternalLink aria-hidden="true" size={12} /></a></Button></div>
      </div>
    </Card>
  );
}
