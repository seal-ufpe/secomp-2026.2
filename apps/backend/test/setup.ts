import { strict as assert } from 'node:assert';

import { afterEach, beforeEach, vi } from 'vitest';

let consoleError: ReturnType<typeof vi.spyOn>;
let consoleWarn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  assert.equal(consoleError.mock.calls.length, 0, 'Unexpected console.error');
  assert.equal(consoleWarn.mock.calls.length, 0, 'Unexpected console.warn');
  vi.restoreAllMocks();
});
