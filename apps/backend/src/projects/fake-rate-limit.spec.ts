import { describe, expect, it } from 'vitest';

import { FakeRateLimitRepository } from './fake-repositories';

describe('FakeRateLimitRepository', () => {
  it('allows the configured window and blocks excess requests', async () => {
    const repository = new FakeRateLimitRepository();
    expect(await repository.consume('ip', 2, 60_000)).toBe(true);
    expect(await repository.consume('ip', 2, 60_000)).toBe(true);
    expect(await repository.consume('ip', 2, 60_000)).toBe(false);
  });
});
