import { describe, expect, it, vi } from 'vitest';

import { AdminController } from './admin.controller';

describe('AdminController', () => {
  it('should issue an HttpOnly session cookie for the configured password', async () => {
    vi.stubEnv('ADMIN_PASSWORD', 'secret');
    vi.stubEnv('SESSION_SECRET', 'a'.repeat(32));
    const response = { header: vi.fn() };

    const result = await new AdminController().login({ password: 'secret' }, response as never);

    expect(result).toEqual({ ok: true });
    expect(response.header).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('HttpOnly'));
  });

  it('should return the same safe error for a wrong or missing password', async () => {
    vi.stubEnv('ADMIN_PASSWORD', 'secret');
    const controller = new AdminController();
    const response = { header: vi.fn() };

    await expect(controller.login({ password: 'wrong' }, response as never)).resolves.toEqual({
      error: { code: 'unauthorized', message: 'Senha inválida.' },
    });
    await expect(controller.login({}, response as never)).resolves.toEqual({
      error: { code: 'unauthorized', message: 'Senha inválida.' },
    });
    expect(response.header).not.toHaveBeenCalled();
  });
});
