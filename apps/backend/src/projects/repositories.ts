import type { EventEmitter } from 'node:events';
import type { AuditLog, Project, ProjectChange, ProjectInput, ProjectPage, ProjectQuery } from './types';

export interface ProjectRepository {
  list(query?: ProjectQuery): Promise<ProjectPage>;
  findById(id: string): Promise<Project | null>;
  findByUrlNormalized(urlNormalized: string): Promise<Project | null>;
  create(input: ProjectInput): Promise<Project>;
  update(id: string, input: Partial<ProjectInput>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
  setStatus(id: string, status: Project['status']): Promise<Project | null>;
  readonly changes: EventEmitter;
}

export interface AuditRepository {
  append(log: Omit<AuditLog, '_id'>): Promise<AuditLog>;
  list(): Promise<AuditLog[]>;
}

export interface SettingsRepository {
  get(): Promise<{ auditPageEnabled: boolean }>;
  setAuditPageEnabled(enabled: boolean): Promise<void>;
}

export interface RateLimitRepository {
  consume(key: string, limit: number, windowMs: number): Promise<boolean>;
}

export type Repositories = {
  projects: ProjectRepository;
  audit: AuditRepository;
  settings: SettingsRepository;
  rateLimits: RateLimitRepository;
};

export const PROJECT_REPOSITORIES = Symbol('PROJECT_REPOSITORIES');

export type ChangeListener = (change: ProjectChange) => void;
