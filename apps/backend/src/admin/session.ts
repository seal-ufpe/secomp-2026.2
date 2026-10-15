import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'deploy_admin';
const MAX_AGE = 8 * 60 * 60;

function signature(payload: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32)
    throw new Error('SESSION_SECRET deve ter pelo menos 32 caracteres.');
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createAdminSession(now = Math.floor(Date.now() / 1000)) {
  const payload = `admin.${now + MAX_AGE}`;
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminSession(value: string | undefined, now = Math.floor(Date.now() / 1000)) {
  if (!value) return false;
  const [role, expiry, provided] = value.split('.');
  if (role !== 'admin' || !expiry || !provided || Number(expiry) < now) return false;
  const expected = signature(`${role}.${expiry}`);
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export const adminCookieName = COOKIE;
