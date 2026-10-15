import { createHash, randomBytes } from 'node:crypto';

import { Logger } from '@nestjs/common';

import { fetchMetadata } from './metadata';
import type { Repositories } from './repositories';
import type { Project, PublicProject } from './types';
import { normalizeUrl, type Submission, validateSubmission } from './validation';

export const PROJECT_SERVICE = Symbol('PROJECT_SERVICE');

export type ProjectServiceResult =
  | { ok: true; project: PublicProject; editToken: string }
  | { ok: false; code: string; message: string };

const messages: Record<string, string> = {
  duplicate: 'Este projeto já está na galeria.',
  unreachable: 'Não foi possível acessar este projeto.',
  validation: 'Confira os dados informados.',
  invalid_url: 'Informe um link HTTPS válido.',
  host_not_allowed: 'O link precisa ser um domínio permitido da Vercel.',
  bad_course_code: 'O código do minicurso está incorreto.',
  honeypot: 'Não foi possível cadastrar o projeto.',
};

function messageFor(code: string): string {
  return messages[code] ?? 'Não foi possível cadastrar o projeto.';
}

export interface MetadataProvider {
  fetch(url: string): Promise<{ previewImage?: string; unreachable?: boolean }>;
}

export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly repositories: Repositories,
    private readonly metadataProvider: MetadataProvider = { fetch: fetchMetadata },
    private readonly tokenFactory: () => string = () => randomBytes(32).toString('base64url'),
  ) {}

  async list(
    query: Parameters<Repositories['projects']['list']>[0] = {},
  ): Promise<{ items: PublicProject[]; nextCursor?: string }> {
    const result = await this.repositories.projects.list(query);
    return {
      ...result,
      items: result.items.map((project) => this.toPublicProject(project)),
    };
  }

  async create(input: Submission): Promise<ProjectServiceResult> {
    const reason = validateSubmission(input);
    if (reason !== null) return { ok: false, code: reason, message: messageFor(reason) };
    const normalized = normalizeUrl(input.url);
    if (normalized === null)
      return { ok: false, code: 'invalid_url', message: messageFor('invalid_url') };
    if ((await this.repositories.projects.findByUrlNormalized(normalized.urlNormalized)) !== null) {
      return { ok: false, code: 'duplicate', message: messageFor('duplicate') };
    }
    const metadata = await this.metadataProvider.fetch(input.url);
    if (metadata.unreachable === true) {
      return { ok: false, code: 'unreachable', message: messageFor('unreachable') };
    }

    const editToken = this.tokenFactory();
    let project: Project;
    try {
      project = await this.repositories.projects.create({
        title: input.title.trim(),
        authorName: input.authorName.trim(),
        origin: input.origin as 'lovable' | 'base44',
        description: input.description?.trim(),
        url: input.url,
        urlNormalized: normalized.urlNormalized,
        host: normalized.host,
        previewImage: metadata.previewImage,
        editTokenHash: createHash('sha256').update(editToken).digest('hex'),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'DUPLICATE_URL')
        return { ok: false, code: 'duplicate', message: messageFor('duplicate') };
      throw error;
    }
    await this.appendAudit(project);
    return { ok: true, project: this.toPublicProject(project), editToken };
  }

  private toPublicProject(project: Project) {
    const { editTokenHash: _editTokenHash, ...publicProject } = project;
    return publicProject;
  }

  private async appendAudit(project: Project) {
    try {
      await this.repositories.audit.append({
        ts: new Date(),
        type: 'project.created',
        actor: 'participant',
        projectId: project._id,
        result: 'ok',
        ipHash: 'unknown',
        meta: {},
      });
    } catch (error) {
      this.logger.warn('audit write failed');
      this.logger.debug(error);
    }
  }
}
