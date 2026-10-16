export type CreateProjectPayload = {
  title: string;
  authorName: string;
  origin: 'lovable' | 'base44';
  description?: string;
  url: string;
  courseCode: string;
  website: string;
};

export type CreateProjectResponse = {
  editToken?: string;
  project?: unknown;
  error?: { message: string; code: string };
};

export async function createProject(payload: CreateProjectPayload): Promise<CreateProjectResponse> {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `Servidor respondeu ${response.status} (resposta não-JSON) em /api/projects`,
    );
  }
  const result = (await response.json()) as CreateProjectResponse;
  if (!response.ok && !result.error) throw new Error('Não foi possível cadastrar o projeto.');
  return result;
}
