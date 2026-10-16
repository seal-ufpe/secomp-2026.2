import { describe, expect, it, vi } from 'vitest';

import { ProjectsController } from './projects.controller';

describe('ProjectsController', () => {
  it('should pass list filters to the project service', async () => {
    const service = {
      list: vi.fn().mockResolvedValue({ items: [], nextCursor: undefined }),
      create: vi.fn(),
    };
    const controller = new ProjectsController(service);

    await expect(controller.list('cursor-1', 'lovable', 'search')).resolves.toEqual({
      items: [],
      nextCursor: undefined,
    });
    expect(service.list).toHaveBeenCalledWith({
      cursor: 'cursor-1',
      origin: 'lovable',
      q: 'search',
    });
  });

  it('should map project service failures to the public error contract', async () => {
    const service = {
      list: vi.fn(),
      create: vi.fn().mockResolvedValue({
        ok: false,
        code: 'validation',
        message: 'Confira os dados informados.',
      }),
    };

    await expect(new ProjectsController(service).create({} as never)).resolves.toEqual({
      error: { code: 'validation', message: 'Confira os dados informados.' },
    });
  });
});
