export type Origin = 'lovable' | 'base44';
export type ProjectStatus = 'visible' | 'hidden';

export type Project = {
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
};

export type PublicProject = Omit<Project, 'editTokenHash' | 'status'>;
export type ProjectInput = Omit<Project, '_id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: ProjectStatus;
};
export type ProjectPage = { items: Project[]; nextCursor?: string };
export type ProjectQuery = {
  cursor?: string;
  origin?: Origin;
  q?: string;
  includeHidden?: boolean;
};
export type ProjectChange = {
  type: 'project.created' | 'project.updated' | 'project.deleted';
  project: Project | { _id: string };
};

export type AuditLog = {
  _id: string;
  ts: Date;
  type: string;
  actor: 'participant' | 'admin' | 'system';
  projectId?: string;
  result: 'ok' | 'rejected' | 'error';
  reason?: string;
  ipHash: string;
  meta: Record<string, string | number | boolean>;
};
