import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestApp, type TestApp } from './helpers/create-test-app';
import { clearDatabase } from './helpers/db';

interface ProjectCreateResponse {
  project: Record<string, unknown>;
  editToken: string;
}

function asProjectCreateResponse(value: unknown): ProjectCreateResponse {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('project' in value) ||
    !('editToken' in value) ||
    typeof value.project !== 'object' ||
    value.project === null ||
    typeof value.editToken !== 'string'
  ) {
    throw new Error('Unexpected project response');
  }
  return { project: value.project as Record<string, unknown>, editToken: value.editToken };
}

describe('project endpoints', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  beforeEach(async () => {
    await clearDatabase(testApp.app);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('<title>Demo</title>', {
          status: 200,
          headers: { 'content-type': 'text/html' },
        }),
      ),
    );
  });

  afterAll(async () => {
    await testApp.app.close();
  });

  it('should create a project and hide its edit token hash', async () => {
    const response = await testApp.http.post('/projects').send({
      title: 'A valid project',
      authorName: 'Test Author',
      origin: 'lovable',
      url: 'https://demo.vercel.app',
      courseCode: 'E2E-2026',
      website: '',
    });
    const body = asProjectCreateResponse(response.body);

    expect(response.status).toBe(201);
    expect(body.project).toMatchObject({
      title: 'A valid project',
      authorName: 'Test Author',
      urlNormalized: 'https://demo.vercel.app',
    });
    expect(body.project).not.toHaveProperty('editTokenHash');
    expect(body.editToken).toEqual(expect.any(String));
  });

  it('should reject a duplicate normalized URL before external metadata is fetched', async () => {
    const input = {
      title: 'A valid project',
      authorName: 'Test Author',
      origin: 'lovable',
      url: 'https://demo.vercel.app/',
      courseCode: 'E2E-2026',
      website: '',
    };
    await testApp.http.post('/projects').send(input);
    const response = await testApp.http.post('/projects').send(input);

    expect(response.body).toEqual({
      error: { code: 'duplicate', message: 'Este projeto já está na galeria.' },
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
