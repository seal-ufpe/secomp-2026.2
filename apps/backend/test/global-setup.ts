import { MongoMemoryReplSet } from 'mongodb-memory-server';

export default async function globalSetup(): Promise<() => Promise<void>> {
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
    binary: { version: '7.0.14' },
  });
  process.env.MONGODB_URI = replSet.getUri();
  process.env.MONGODB_DB = 'secomp-e2e';
  process.env.USE_FAKE_DB = '0';
  process.env.ADMIN_PASSWORD = 'e2e-admin-password';
  process.env.SESSION_SECRET = 'e2e-session-secret-that-is-at-least-32-characters';
  process.env.AUDIT_SALT = 'e2e-audit-salt';
  process.env.COURSE_CODE = 'E2E-2026';
  process.env.ALLOWED_HOST_SUFFIXES = '.vercel.app';
  return async () => {
    await replSet.stop();
  };
}
