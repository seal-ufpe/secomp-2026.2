import { describe, expect, it, vi } from 'vitest';

import { fetchMetadata } from './metadata';

describe('fetchMetadata', () => {
  it('does not fetch a forbidden host or follow a forbidden redirect', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchMetadata('https://evil.example.com')).resolves.toEqual({});
    expect(fetchMock).not.toHaveBeenCalled();

    fetchMock.mockResolvedValueOnce(
      new Response(null, { status: 302, headers: { location: 'https://evil.example.com' } }),
    );
    await expect(fetchMetadata('https://demo.vercel.app')).resolves.toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it('extracts only secure preview images and titles', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            '<title>Projeto</title><meta property="og:image" content="http://insecure.test/image.png">',
          ),
        ),
    );
    await expect(fetchMetadata('https://demo.vercel.app')).resolves.toEqual({
      title: 'Projeto',
      previewImage: undefined,
    });
    vi.unstubAllGlobals();
  });
});
