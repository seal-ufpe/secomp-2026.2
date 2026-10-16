import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestApp, type TestApp } from './helpers/create-test-app';

describe('admin endpoints', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  afterAll(async () => {
    await testApp.app.close();
  });

  it('should authenticate an administrator with a secure session cookie', async () => {
    const response = await testApp.http
      .post('/admin/login')
      .send({ password: 'e2e-admin-password' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ ok: true });
    const cookie = response.headers['set-cookie']?.[0];
    expect(cookie).toBeDefined();
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Strict/);
  });

  it('should reject invalid credentials without setting a cookie', async () => {
    const response = await testApp.http.post('/admin/login').send({ password: 'wrong' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      error: { code: 'unauthorized', message: 'Senha inválida.' },
    });
    expect(response.headers['set-cookie']).toBeUndefined();
  });
});
