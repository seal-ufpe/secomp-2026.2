import { isAllowedHost } from './validation';

export async function fetchMetadata(
  url: string,
): Promise<{ title?: string; previewImage?: string; unreachable?: boolean }> {
  let current = url;
  try {
    for (let redirect = 0; redirect <= 2; redirect += 1) {
      const parsed = new URL(current);
      if (parsed.protocol !== 'https:' || !isAllowedHost(parsed.hostname)) return {};
      const response = await fetch(current, {
        redirect: 'manual',
        signal: AbortSignal.timeout(3000),
      });
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location || redirect === 2) return {};
        current = new URL(location, current).toString();
        continue;
      }
      if (response.status >= 500) return { unreachable: true };
      if (response.status === 401 || response.status === 403) return {};
      if (!response.ok || !response.body) return {};
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (size < 512 * 1024) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        chunks.push(part.value);
      }
      const html = new TextDecoder().decode(Buffer.concat(chunks));
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
      const image = html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i,
      )?.[1];
      return { title, previewImage: image?.startsWith('https://') ? image : undefined };
    }
    return {};
  } catch {
    return { unreachable: true };
  }
}
