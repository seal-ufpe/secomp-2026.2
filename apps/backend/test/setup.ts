import { afterEach, beforeEach, expect, vi } from 'vitest';

let consoleError: ReturnType<typeof vi.spyOn>;
let consoleWarn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  // eslint-disable-next-line vitest/no-standalone-expect -- lifecycle assertion catches unexpected process logs.
  expect(consoleError).not.toHaveBeenCalled();
  // eslint-disable-next-line vitest/no-standalone-expect -- lifecycle assertion catches unexpected process logs.
  expect(consoleWarn).not.toHaveBeenCalled();
  vi.restoreAllMocks();
});
