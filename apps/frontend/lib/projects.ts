import type { LiveProject } from "@/hooks/use-live-projects";

export type ProjectOriginFilter = "all" | "lovable" | "base44";

export function filterProjects(projects: LiveProject[], query: string, origin: ProjectOriginFilter) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return projects.filter((project) => {
    const matchesText = !normalizedQuery || `${project.title} ${project.authorName}`.toLocaleLowerCase().includes(normalizedQuery);
    return matchesText && (origin === "all" || project.origin === origin);
  });
}
