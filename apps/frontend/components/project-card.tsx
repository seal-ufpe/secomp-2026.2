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
    <Card className="overflow-hidden transition-transform motion-safe:animate-[slide-in_400ms_ease-out]">
      <div className="racks-duotone flex h-44 items-end border-b-2 border-neon p-4">
        {project.previewImage ? <img src={project.previewImage} alt="" className="h-full w-full object-cover" /> : <span className="text-5xl font-black text-neon">///</span>}
      </div>
      <div className="space-y-3 p-4">
        <h2 className="text-2xl font-black text-neon">{project.title}</h2>
        <p className="text-sm">por {project.authorName}</p>
        <div className="flex items-center justify-between gap-2"><OriginBadge origin={project.origin} /><span className="truncate text-xs">{project.host}</span></div>
        <p className="text-xs text-muted-foreground">há {Math.max(1, Math.round((Date.now() - Date.parse(project.createdAt)) / 60000))} minutos</p>
        <Button asChild className="w-full"><a href={project.url} target="_blank" rel="noopener noreferrer">Abrir projeto <ExternalLink aria-hidden="true" /></a></Button>
      </div>
    </Card>
  );
}
