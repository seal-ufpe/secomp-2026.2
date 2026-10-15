import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'deploy_admin';
const MAX_AGE = 8 * 60 * 60;

function hasText(value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0;
}

function signature(payload: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!hasText(secret) || secret.length < 32) {
    throw new Error('SESSION_SECRET deve ter pelo menos 32 caracteres.');
  }
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createAdminSession(now = Math.floor(Date.now() / 1000)): string {
  const payload = `admin.${String(now + MAX_AGE)}`;
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminSession(
  value: string | undefined,
  now = Math.floor(Date.now() / 1000),
): boolean {
  if (!hasText(value)) return false;
  const [role, expiry, provided] = value.split('.');
  if (role !== 'admin' || !hasText(expiry) || !hasText(provided) || Number(expiry) < now) {
    return false;
  }
  const expected = signature(`${role}.${expiry}`);
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export const adminCookieName = COOKIE;
