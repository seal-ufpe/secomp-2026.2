import { describe, expect, it, vi } from 'vitest';

import { UsersController } from './users.controller';

describe('UsersController', () => {
  it('should delegate list requests to the users service', async () => {
    const service = { list: vi.fn().mockResolvedValue([{ name: 'Ana' }]), create: vi.fn() };

    await expect(new UsersController(service).list()).resolves.toEqual([{ name: 'Ana' }]);
    expect(service.list).toHaveBeenCalledTimes(1);
  });

  it('should delegate create requests with the received body', async () => {
    const service = { list: vi.fn(), create: vi.fn().mockResolvedValue([{ _id: '1' }]) };
    const body = { name: 'Ana', email: 'ana@example.com' };

    await expect(new UsersController(service).create(body)).resolves.toEqual([{ _id: '1' }]);
    expect(service.create).toHaveBeenCalledWith(body);
  });
});
