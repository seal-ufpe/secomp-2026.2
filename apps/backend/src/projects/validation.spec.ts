import { describe, expect, it } from 'vitest';
import { isAllowedHost, normalizeUrl, validateSubmission } from './validation';

describe('validation', () => {
  it('normalizes safe HTTPS URLs', () => {
    expect(normalizeUrl('HTTPS://Demo.Vercel.App/path/?q=1#x')).toEqual({ host: 'demo.vercel.app', urlNormalized: 'https://demo.vercel.app/path' });
    expect(normalizeUrl('http://demo.vercel.app')).toBeNull();
    expect(normalizeUrl('https://user:pass@demo.vercel.app')).toBeNull();
  });

  it('checks host suffix boundaries', () => {
    expect(isAllowedHost('demo.vercel.app', '.vercel.app')).toBe(true);
    expect(isAllowedHost('vercel.app', '.vercel.app')).toBe(false);
    expect(isAllowedHost('demo.evilvercel.app', '.vercel.app')).toBe(false);
  });

  it('rejects honeypots and bad course codes', () => {
    const valid = { title: 'Projeto', authorName: 'Ana', origin: 'lovable', url: 'https://demo.vercel.app', courseCode: 'OK' };
    expect(validateSubmission({ ...valid, website: '' }, 'OK')).toBeNull();
    expect(validateSubmission({ ...valid, website: 'bot' }, 'OK')).toBe('honeypot');
    expect(validateSubmission(valid, 'WRONG')).toBe('bad_course_code');
  });
});
