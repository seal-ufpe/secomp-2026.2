import { EventEmitter } from 'node:events';
import { randomUUID } from 'node:crypto';
import type { AuditLog, Project, ProjectInput, ProjectQuery } from './types';
import type { AuditRepository, ProjectRepository, RateLimitRepository, Repositories, SettingsRepository } from './repositories';

export class FakeProjectRepository implements ProjectRepository {
  private readonly items = new Map<string, Project>();
  readonly changes = new EventEmitter();

  async list(query: ProjectQuery = {}) {
    const filtered = [...this.items.values()]
      .filter((project) => query.includeHidden || project.status === 'visible')
      .filter((project) => !query.origin || project.origin === query.origin)
      .filter((project) => !query.q || `${project.title} ${project.authorName}`.toLowerCase().includes(query.q.toLowerCase()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const start = query.cursor ? Math.max(0, filtered.findIndex((project) => project._id === query.cursor) + 1) : 0;
    const items = filtered.slice(start, start + 20);
    return { items, nextCursor: filtered[start + 20]?._id };
  }

  async findById(id: string) { return this.items.get(id) ?? null; }
  async findByUrlNormalized(urlNormalized: string) {
    return [...this.items.values()].find((project) => project.urlNormalized === urlNormalized) ?? null;
  }
  async create(input: ProjectInput) {
    if (await this.findByUrlNormalized(input.urlNormalized)) throw new Error('DUPLICATE_URL');
    const now = new Date();
    const project = { ...input, _id: randomUUID(), status: input.status ?? 'visible', createdAt: now, updatedAt: now };
    this.items.set(project._id, project);
    this.changes.emit('change', { type: 'project.created', project });
    return project;
  }
  async update(id: string, input: Partial<ProjectInput>) {
    const current = await this.findById(id);
    if (!current) return null;
    const project = { ...current, ...input, updatedAt: new Date() };
    this.items.set(id, project);
    this.changes.emit('change', { type: 'project.updated', project });
    return project;
  }
  async delete(id: string) {
    const deleted = this.items.delete(id);
    if (deleted) this.changes.emit('change', { type: 'project.deleted', project: { _id: id } });
    return deleted;
  }
  async setStatus(id: string, status: Project['status']) { return this.update(id, { status }); }
}

export class FakeAuditRepository implements AuditRepository {
  private readonly items: AuditLog[] = [];
  async append(log: Omit<AuditLog, '_id'>) { const result = { ...log, _id: randomUUID() }; this.items.push(result); return result; }
  async list() { return [...this.items].reverse(); }
}

export class FakeSettingsRepository implements SettingsRepository {
  private enabled = false;
  async get() { return { auditPageEnabled: this.enabled }; }
  async setAuditPageEnabled(enabled: boolean) { this.enabled = enabled; }
}

export class FakeRateLimitRepository implements RateLimitRepository {
  private readonly counters = new Map<string, { count: number; expiresAt: number }>();
  async consume(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const current = this.counters.get(key);
    if (!current || current.expiresAt <= now) { this.counters.set(key, { count: 1, expiresAt: now + windowMs }); return true; }
    if (current.count >= limit) return false;
    current.count += 1;
    return true;
  }
}

export function createFakeRepositories(): Repositories {
  return { projects: new FakeProjectRepository(), audit: new FakeAuditRepository(), settings: new FakeSettingsRepository(), rateLimits: new FakeRateLimitRepository() };
}
