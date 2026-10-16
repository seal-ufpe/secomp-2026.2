import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { buildUser } from './factories/build-user';
import { createTestApp, type TestApp } from './helpers/create-test-app';
import { clearDatabase } from './helpers/db';

interface UserResponse {
  name: string;
  email: string;
  _id: string;
}

function asUsers(value: unknown): UserResponse[] {
  if (!Array.isArray(value) || !value.every(isUserResponse)) {
    throw new Error('Unexpected users response');
  }
  return value;
}

function isUserResponse(value: unknown): value is UserResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.name === 'string' &&
    typeof record.email === 'string' &&
    typeof record._id === 'string'
  );
}

describe('users endpoints', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  beforeEach(async () => {
    await clearDatabase(testApp.app);
  });

  afterAll(async () => {
    await testApp.app.close();
  });

  it('should create and list a user without changing the resource contract', async () => {
    const user = buildUser();
    const created = await testApp.http.post('/users').send(user);
    const createdUsers = asUsers(created.body);

    expect(created.status).toBe(201);
    expect(createdUsers).toHaveLength(1);
    expect(createdUsers[0]).toMatchObject(user);

    const listed = await testApp.http.get('/users');
    const listedUsers = asUsers(listed.body);
    expect(listed.status).toBe(200);
    expect(listedUsers).toHaveLength(1);
    expect(listedUsers[0]).toMatchObject(user);
  });
});
