import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useLiveProjects } from './use-live-projects';

describe('useLiveProjects', () => {
  it('loads projects and exposes connection state', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({
            items: [
              {
                _id: '1',
                title: 'Projeto',
                authorName: 'Ana',
                origin: 'lovable',
                createdAt: new Date().toISOString(),
              },
            ],
          }),
        }),
    );
    class FakeEventSource {
      onopen = () => {};
      onmessage = () => {};
      onerror = () => {};
      close = vi.fn();
      constructor() {
        setTimeout(() => this.onopen(), 0);
      }
    }
    vi.stubGlobal('EventSource', FakeEventSource);
    const { result } = renderHook(() => useLiveProjects());
    await waitFor(() => expect(result.current.projects).toHaveLength(1));
    expect(result.current.connectionState).toBe('live');
  });
});
