import { describe, expect, it } from 'vitest';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns the service health status', () => {
    expect(new HealthController().check()).toEqual({ status: 'ok', service: 'example' });
  });
});
