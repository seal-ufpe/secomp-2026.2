import { timingSafeEqual } from 'node:crypto';

export interface Submission {
  title: string;
  authorName: string;
  origin: string;
  description?: string;
  url: string;
  website?: string;
  courseCode: string;
}

function hasText(value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isPrivateIpv4(hostname: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

export function normalizeUrl(value: string): { urlNormalized: string; host: string } | null {
  try {
    const parsed = new URL(value.trim());
    if (
      parsed.protocol !== 'https:' ||
      hasText(parsed.username) ||
      hasText(parsed.password) ||
      parsed.hostname === 'localhost' ||
      parsed.hostname.includes(':')
    )
      return null;
    if (isPrivateIpv4(parsed.hostname)) return null;
    const host = parsed.hostname.toLowerCase();
    return {
      host,
      urlNormalized: `https://${host}${hasText(parsed.port) ? `:${parsed.port}` : ''}${parsed.pathname.replace(/\/+$/, '')}`,
    };
  } catch {
    return null;
  }
}

export function isAllowedHost(
  host: string,
  suffixes = process.env.ALLOWED_HOST_SUFFIXES ?? '.vercel.app',
): boolean {
  return suffixes
    .split(',')
    .map((suffix) => suffix.trim().toLowerCase())
    .filter(Boolean)
    .some((suffix) => host.toLowerCase().endsWith(suffix) && host.length > suffix.length);
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function hasValidIdentity(input: Submission): boolean {
  return (
    input.title.trim().length >= 3 &&
    input.title.trim().length <= 60 &&
    input.authorName.trim().length >= 2 &&
    input.authorName.trim().length <= 60
  );
}

function hasValidDetails(input: Submission): boolean {
  return (
    ['lovable', 'base44'].includes(input.origin) &&
    (input.description?.length ?? 0) <= 140
  );
}

export function validateSubmission(
  input: Submission,
  expectedCourseCode = process.env.COURSE_CODE ?? '',
): string | null {
  if (!hasValidIdentity(input)) {
    return 'validation';
  }
  if (!hasValidDetails(input)) {
    return 'validation';
  }
  if (hasText(input.website?.trim())) return 'honeypot';
  const normalized = normalizeUrl(input.url);
  if (!normalized) return 'invalid_url';
  if (!isAllowedHost(normalized.host)) return 'host_not_allowed';
  if (!safeEqual(input.courseCode, expectedCourseCode)) return 'bad_course_code';
  return null;
}
