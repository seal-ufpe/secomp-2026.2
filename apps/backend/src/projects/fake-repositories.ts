import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';

import type {
  AuditRepository,
  ProjectRepository,
  RateLimitRepository,
  Repositories,
  SettingsRepository,
} from './repositories';
import type { AuditLog, Project, ProjectInput, ProjectPage, ProjectQuery } from './types';

export class FakeProjectRepository implements ProjectRepository {
  private readonly items = new Map<string, Project>();
  readonly changes = new EventEmitter();

  list(query: ProjectQuery = {}): Promise<ProjectPage> {
    const filtered = [...this.items.values()]
      .filter((project) => query.includeHidden === true || project.status === 'visible')
      .filter((project) => query.origin === undefined || project.origin === query.origin)
      .filter(
        (project) =>
          query.q === undefined ||
          `${project.title} ${project.authorName}`.toLowerCase().includes(query.q.toLowerCase()),
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const start =
      query.cursor !== undefined
        ? Math.max(0, filtered.findIndex((project) => project._id === query.cursor) + 1)
        : 0;
    const items = filtered.slice(start, start + 20);
    return Promise.resolve({ items, nextCursor: filtered[start + 20]?._id });
  }

  findById(id: string): Promise<Project | null> {
    return Promise.resolve(this.items.get(id) ?? null);
  }
  findByUrlNormalized(urlNormalized: string): Promise<Project | null> {
    return Promise.resolve(
      [...this.items.values()].find((project) => project.urlNormalized === urlNormalized) ?? null,
    );
  }
  async create(input: ProjectInput): Promise<Project> {
    if (await this.findByUrlNormalized(input.urlNormalized)) throw new Error('DUPLICATE_URL');
    const now = new Date();
    const project = {
      ...input,
      _id: randomUUID(),
      status: input.status ?? 'visible',
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(project._id, project);
    this.changes.emit('change', { type: 'project.created', project });
    return project;
  }
  async update(id: string, input: Partial<ProjectInput>): Promise<Project | null> {
    const current = await this.findById(id);
    if (!current) return null;
    const project = { ...current, ...input, updatedAt: new Date() };
    this.items.set(id, project);
    this.changes.emit('change', { type: 'project.updated', project });
    return project;
  }
  delete(id: string): Promise<boolean> {
    const deleted = this.items.delete(id);
    if (deleted) {
      this.changes.emit('change', { type: 'project.deleted', project: { _id: id } });
    }
    return Promise.resolve(deleted);
  }
  setStatus(id: string, status: Project['status']): Promise<Project | null> {
    return this.update(id, { status });
  }
}

export class FakeAuditRepository implements AuditRepository {
  private readonly items: AuditLog[] = [];
  append(log: Omit<AuditLog, '_id'>): Promise<AuditLog> {
    const result = { ...log, _id: randomUUID() };
    this.items.push(result);
    return Promise.resolve(result);
  }
  list(): Promise<AuditLog[]> {
    return Promise.resolve([...this.items].reverse());
  }
}

export class FakeSettingsRepository implements SettingsRepository {
  private enabled = false;
  get(): Promise<{ auditPageEnabled: boolean }> {
    return Promise.resolve({ auditPageEnabled: this.enabled });
  }
  setAuditPageEnabled(enabled: boolean): Promise<void> {
    this.enabled = enabled;
    return Promise.resolve();
  }
}

export class FakeRateLimitRepository implements RateLimitRepository {
  private readonly counters = new Map<string, { count: number; expiresAt: number }>();
  consume(key: string, limit: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const current = this.counters.get(key);
    if (!current || current.expiresAt <= now) {
      this.counters.set(key, { count: 1, expiresAt: now + windowMs });
      return Promise.resolve(true);
    }
    if (current.count >= limit) return Promise.resolve(false);
    current.count += 1;
    return Promise.resolve(true);
  }
}

export function createFakeRepositories(): Repositories {
  return {
    projects: new FakeProjectRepository(),
    audit: new FakeAuditRepository(),
    settings: new FakeSettingsRepository(),
    rateLimits: new FakeRateLimitRepository(),
  };
}
