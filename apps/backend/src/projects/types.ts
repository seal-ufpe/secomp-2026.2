export type Origin = 'lovable' | 'base44';
export type ProjectStatus = 'visible' | 'hidden';

export interface Project {
  _id: string;
  title: string;
  authorName: string;
  origin: Origin;
  description?: string;
  url: string;
  urlNormalized: string;
  host: string;
  previewImage?: string;
  status: ProjectStatus;
  editTokenHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicProject = Omit<Project, 'editTokenHash' | 'status'>;
export interface ProjectInput extends Omit<Project, '_id' | 'createdAt' | 'updatedAt' | 'status'> {
  status?: ProjectStatus;
}
export interface ProjectPage {
  items: Project[];
  nextCursor?: string;
}
export interface ProjectQuery {
  cursor?: string;
  origin?: Origin;
  q?: string;
  includeHidden?: boolean;
}
export interface ProjectChange {
  type: 'project.created' | 'project.updated' | 'project.deleted';
  project: Project | { _id: string };
}

export interface AuditLog {
  _id: string;
  ts: Date;
  type: string;
  actor: 'participant' | 'admin' | 'system';
  projectId?: string;
  result: 'ok' | 'rejected' | 'error';
  reason?: string;
  ipHash: string;
  meta: Record<string, string | number | boolean>;
}
