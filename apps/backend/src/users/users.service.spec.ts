import { describe, expect, it, vi } from 'vitest';

import { UsersService } from './users.service';

describe('UsersService', () => {
  it('should list users ordered by newest creation', async () => {
    const toArray = vi.fn().mockResolvedValue([{ name: 'Ana' }]);
    const db = {
      collection: vi.fn().mockReturnValue({
        find: vi.fn().mockReturnValue({ sort: vi.fn().mockReturnValue({ toArray }) }),
      }),
    };

    await expect(new UsersService(db as never).list()).resolves.toEqual([{ name: 'Ana' }]);
    expect(db.collection).toHaveBeenCalledWith('users');
  });

  it('should persist a user and return its generated identifier', async () => {
    const insertOne = vi.fn().mockResolvedValue({ insertedId: 'user-1' });
    const db = { collection: vi.fn().mockReturnValue({ insertOne }) };

    await expect(
      new UsersService(db as never).create({ name: 'Ana', email: 'ana@example.com' }),
    ).resolves.toMatchObject([{ name: 'Ana', email: 'ana@example.com', _id: 'user-1' }]);
    expect(insertOne).toHaveBeenCalledTimes(1);
  });
});
