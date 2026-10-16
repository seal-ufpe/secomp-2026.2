import { HttpException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { GlobalExceptionFilter, validateEnvironment } from './app.config';

describe('validateEnvironment', () => {
  it('should return normalized required configuration when environment is complete', () => {
    const environment = validateEnvironment({
      ADMIN_PASSWORD: 'password',
      SESSION_SECRET: 'a'.repeat(32),
      AUDIT_SALT: 'salt',
      COURSE_CODE: 'COURSE',
      ALLOWED_HOST_SUFFIXES: '.vercel.app',
      USE_FAKE_DB: '1',
    });

    expect(environment).toMatchObject({
      ADMIN_PASSWORD: 'password',
      SESSION_SECRET: 'a'.repeat(32),
      USE_FAKE_DB: '1',
    });
  });

  it('should reject missing database configuration when fake database is disabled', () => {
    expect(() =>
      validateEnvironment({
        ADMIN_PASSWORD: 'password',
        SESSION_SECRET: 'a'.repeat(32),
        AUDIT_SALT: 'salt',
        COURSE_CODE: 'COURSE',
        ALLOWED_HOST_SUFFIXES: '.vercel.app',
      }),
    ).toThrow('MONGODB_URI, MONGODB_DB');
  });
});

describe('GlobalExceptionFilter', () => {
  it('should serialize HTTP exception messages without internal details', () => {
    const filter = new GlobalExceptionFilter();
    const send = vi.fn();
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status: () => ({ send }) }),
      }),
    };

    filter.catch(new HttpException({ message: ['invalid input'] }, 400), host as never);

    expect(send).toHaveBeenCalledWith({
      error: { code: 'http_400', message: 'invalid input' },
    });
  });

  it('should hide unknown exception details behind a generic error', () => {
    const filter = new GlobalExceptionFilter();
    const send = vi.fn();
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status: () => ({ send }) }),
      }),
    };

    filter.catch(new Error('database secret'), host as never);

    expect(send).toHaveBeenCalledWith({
      error: { code: 'internal_error', message: 'Internal server error' },
    });
  });
});
