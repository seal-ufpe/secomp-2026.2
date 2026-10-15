import { describe, expect, it, vi } from 'vitest';
import { FakeAuditRepository, FakeProjectRepository, FakeRateLimitRepository, FakeSettingsRepository } from './fake-repositories';
import { ProjectService } from './project-service';
import type { Repositories } from './repositories';

function setup() {
  const repositories: Repositories = {
    projects: new FakeProjectRepository(),
    audit: new FakeAuditRepository(),
    settings: new FakeSettingsRepository(),
    rateLimits: new FakeRateLimitRepository(),
  };
  const metadataProvider = { fetch: vi.fn().mockResolvedValue({ previewImage: 'https://cdn.vercel.app/image.png' }) };
  const service = new ProjectService(repositories, metadataProvider, () => 'token');
  return { repositories, metadataProvider, service };
}

const validInput = {
  title: 'Projeto seguro',
  authorName: 'Ana Silva',
  origin: 'lovable',
  url: 'https://demo.vercel.app/',
  courseCode: 'TEST',
  website: '',
};

describe('ProjectService', () => {
  it('normalizes, persists and never exposes the edit hash', async () => {
    const { service, repositories } = setup();
    process.env.COURSE_CODE = 'TEST';
    const result = await service.create(validInput);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.project.urlNormalized).toBe('https://demo.vercel.app');
    expect(result.editToken).toBe('token');
    expect(result.project).not.toHaveProperty('editTokenHash');
    expect(await repositories.audit.list()).toHaveLength(1);
  });

  it('rejects duplicates before fetching metadata', async () => {
    const { service, metadataProvider } = setup();
    process.env.COURSE_CODE = 'TEST';
    expect((await service.create(validInput)).ok).toBe(true);
    const duplicate = await service.create(validInput);
    expect(duplicate).toEqual({ ok: false, code: 'duplicate', message: 'Este projeto já está na galeria.' });
    expect(metadataProvider.fetch).toHaveBeenCalledTimes(1);
  });

  it('keeps a metadata failure user-safe', async () => {
    process.env.COURSE_CODE = 'TEST';
    const result = await new ProjectService(
      { ...setup().repositories },
      { fetch: vi.fn().mockResolvedValue({ unreachable: true }) },
      () => 'token',
    ).create(validInput);
    expect(result).toEqual({ ok: false, code: 'unreachable', message: 'Não foi possível acessar este projeto.' });
  });
});
