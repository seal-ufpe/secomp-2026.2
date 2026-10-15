import { EventEmitter } from 'node:events';
import { randomUUID } from 'node:crypto';
import type { Collection, Db } from 'mongodb';
import type { AuditLog, Project, ProjectInput, ProjectQuery } from './types';
import type {
  AuditRepository,
  ProjectRepository,
  RateLimitRepository,
  Repositories,
  SettingsRepository,
} from './repositories';

export async function initializeIndexes(db: Db) {
  await Promise.all([
    db.collection('projects').createIndex({ urlNormalized: 1 }, { unique: true }),
    db.collection('projects').createIndex({ createdAt: -1 }),
    db.collection('audit_logs').createIndex({ ts: -1 }),
    db.collection('rate_limits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
}

class MongoProjects implements ProjectRepository {
  readonly changes = new EventEmitter();
  constructor(private readonly collection: Collection<Project>) {}
  async list(query: ProjectQuery = {}) {
    const filter: Record<string, unknown> = query.includeHidden ? {} : { status: 'visible' };
    if (query.origin) filter.origin = query.origin;
    if (query.q)
      filter.$or = [
        { title: { $regex: query.q, $options: 'i' } },
        { authorName: { $regex: query.q, $options: 'i' } },
      ];
    const items = await this.collection.find(filter).sort({ createdAt: -1 }).limit(21).toArray();
    return { items: items.slice(0, 20), nextCursor: items[20]?._id };
  }
  findById(id: string) {
    return this.collection.findOne({ _id: id });
  }
  findByUrlNormalized(urlNormalized: string) {
    return this.collection.findOne({ urlNormalized });
  }
  async create(input: ProjectInput) {
    const now = new Date();
    const project = {
      ...input,
      _id: randomUUID(),
      status: input.status ?? 'visible',
      createdAt: now,
      updatedAt: now,
    };
    await this.collection.insertOne(project);
    this.changes.emit('change', { type: 'project.created', project });
    return project;
  }
  async update(id: string, input: Partial<ProjectInput>) {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: { ...input, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    if (result) this.changes.emit('change', { type: 'project.updated', project: result });
    return result;
  }
  async delete(id: string) {
    const result = await this.collection.deleteOne({ _id: id });
    if (result.deletedCount)
      this.changes.emit('change', { type: 'project.deleted', project: { _id: id } });
    return result.deletedCount > 0;
  }
  setStatus(id: string, status: Project['status']) {
    return this.update(id, { status });
  }
}

class MongoAudit implements AuditRepository {
  constructor(private readonly c: Collection<AuditLog>) {}
  async append(log: Omit<AuditLog, '_id'>) {
    const result = { ...log, _id: randomUUID() };
    await this.c.insertOne(result);
    return result;
  }
  list() {
    return this.c.find().sort({ ts: -1 }).toArray();
  }
}

class MongoSettings implements SettingsRepository {
  constructor(private readonly c: Collection<{ _id: string; auditPageEnabled: boolean }>) {}
  async get() {
    return (await this.c.findOne({ _id: 'global' })) ?? { auditPageEnabled: false };
  }
  async setAuditPageEnabled(enabled: boolean) {
    await this.c.updateOne(
      { _id: 'global' },
      { $set: { auditPageEnabled: enabled } },
      { upsert: true },
    );
  }
}
class MongoRateLimits implements RateLimitRepository {
  constructor(private readonly c: Collection<{ key: string; count: number; expiresAt: Date }>) {}
  async consume(key: string, limit: number, windowMs: number) {
    const now = new Date();
    const current = await this.c.findOne({ key, expiresAt: { $gt: now } });
    if (current?.count && current.count >= limit) return false;
    await this.c.updateOne(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + windowMs) } },
      { upsert: true },
    );
    return true;
  }
}

export async function createMongoRepositories(db: Db): Promise<Repositories> {
  await initializeIndexes(db);
  return {
    projects: new MongoProjects(db.collection('projects')),
    audit: new MongoAudit(db.collection('audit_logs')),
    settings: new MongoSettings(db.collection('settings')),
    rateLimits: new MongoRateLimits(db.collection('rate_limits')),
  };
}
