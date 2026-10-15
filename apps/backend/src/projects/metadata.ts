import { isAllowedHost } from './validation';

interface MetadataResult {
  title?: string;
  previewImage?: string;
  unreachable?: boolean;
}

async function readHtml(response: Response): Promise<string> {
  if (response.body === null) {
    return '';
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < 512 * 1024) {
    const part = await reader.read();
    if (part.done) {
      break;
    }
    size += part.value.byteLength;
    chunks.push(part.value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

function extractMetadata(html: string): MetadataResult {
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim();
  const image = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i.exec(html)?.[1];
  return {
    title,
    previewImage: (image?.startsWith('https://') ?? false) ? image : undefined,
  };
}

async function fetchResponse(current: string): Promise<Response | MetadataResult> {
  const parsed = new URL(current);
  if (parsed.protocol !== 'https:' || !isAllowedHost(parsed.hostname)) {
    return {};
  }
  return fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(3000) });
}

async function processResponse(
  response: Response,
  current: string,
  redirect: number,
): Promise<MetadataResult | string> {
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location');
    return location === null || redirect === 2 ? {} : new URL(location, current).toString();
  }
  if (response.status >= 500 || !response.ok) {
    return response.status >= 500 ? { unreachable: true } : {};
  }
  return extractMetadata(await readHtml(response));
}

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  let current = url;
  try {
    for (let redirect = 0; redirect <= 2; redirect += 1) {
      const result = await fetchResponse(current);
      if (!(result instanceof Response)) return result;
      const processed = await processResponse(result, current, redirect);
      if (typeof processed !== 'string') return processed;
      current = processed;
    }
    return {};
  } catch {
    return { unreachable: true };
  }
}
