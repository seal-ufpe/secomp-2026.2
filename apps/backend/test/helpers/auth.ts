import type request from 'supertest';

export async function loginAsAdmin(http: ReturnType<typeof request>): Promise<string> {
  const response = await http.post('/admin/login').send({ password: 'e2e-admin-password' });
  const cookie = response.headers['set-cookie']?.[0];
  if (cookie === undefined) {
    throw new Error('Admin login did not return a session cookie.');
  }
  return cookie;
}
