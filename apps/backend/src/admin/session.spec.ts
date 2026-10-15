import { describe, expect, it } from 'vitest';

import { createAdminSession, verifyAdminSession } from './session';

describe('admin session', () => {
  it('signs, expires and rejects tampering', () => {
    process.env.SESSION_SECRET = 'a'.repeat(32);
    const token = createAdminSession(100);
    expect(verifyAdminSession(token, 100)).toBe(true);
    expect(verifyAdminSession(token.replace('admin', 'user'), 100)).toBe(false);
    expect(verifyAdminSession(token, 100 + 8 * 60 * 60 + 1)).toBe(false);
  });
});
