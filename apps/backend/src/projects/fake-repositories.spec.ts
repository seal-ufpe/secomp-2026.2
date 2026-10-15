import { describe, expect, it } from 'vitest';
import { FakeProjectRepository } from './fake-repositories';

const input = (urlNormalized: string, title: string) => ({
  title,
  authorName: 'Ana',
  origin: 'lovable' as const,
  url: `https://${urlNormalized}`,
  urlNormalized,
  host: urlNormalized,
  editTokenHash: 'hash',
});

describe('FakeProjectRepository', () => {
  it('enforces unique normalized URLs and orders by creation date', async () => {
    const repository = new FakeProjectRepository();
    const first = await repository.create(input('one.vercel.app', 'Primeiro'));
    await new Promise((resolve) => setTimeout(resolve, 2));
    const second = await repository.create(input('two.vercel.app', 'Segundo'));
    await expect(repository.create(input('one.vercel.app', 'Duplicado'))).rejects.toThrow(
      'DUPLICATE_URL',
    );
    const page = await repository.list();
    expect(page.items.map((project) => project._id)).toEqual([second._id, first._id]);
  });

  it('hides and restores projects', async () => {
    const repository = new FakeProjectRepository();
    const project = await repository.create(input('one.vercel.app', 'Projeto'));
    await repository.setStatus(project._id, 'hidden');
    expect((await repository.list()).items).toHaveLength(0);
    await repository.setStatus(project._id, 'visible');
    expect((await repository.list()).items).toHaveLength(1);
  });
});
