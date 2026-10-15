import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { getRepositories } from './get-repositories';
import { fetchMetadata } from './metadata';
import { validateSubmission } from './validation';

type CreateProjectBody = Parameters<typeof validateSubmission>[0];

@Controller('projects')
export class ProjectsController {
  @Get()
  async list(@Query('cursor') cursor?: string, @Query('origin') origin?: 'lovable' | 'base44', @Query('q') q?: string) {
    const repositories = await getRepositories();
    const result = await repositories.projects.list({ cursor, origin, q });
    return { ...result, items: result.items.map((project) => { const { editTokenHash, ...publicProject } = project; void editTokenHash; return publicProject; }) };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateProjectBody) {
    const reason = validateSubmission(body);
    if (reason) return { error: { code: reason, message: 'Não foi possível cadastrar o projeto.' } };
    const normalized = new URL(body.url);
    const editToken = randomBytes(32).toString('base64url');
    const repositories = await getRepositories();
    const duplicate = await repositories.projects.findByUrlNormalized(normalized.origin + normalized.pathname.replace(/\/+$/, ''));
    if (duplicate) return { error: { code: 'duplicate', message: 'Este projeto já está na galeria.' } };
    const metadata = await fetchMetadata(body.url);
    if (metadata.unreachable) return { error: { code: 'unreachable', message: 'Não foi possível acessar este projeto.' } };
    const project = await repositories.projects.create({
      title: body.title.trim(),
      authorName: body.authorName.trim(),
      origin: body.origin as 'lovable' | 'base44',
      description: body.description?.trim(),
      url: body.url,
      urlNormalized: normalized.origin + normalized.pathname.replace(/\/+$/, ''),
      host: normalized.hostname.toLowerCase(),
      previewImage: metadata.previewImage,
      editTokenHash: createHash('sha256').update(editToken).digest('hex'),
    });
    try {
      await repositories.audit.append({ ts: new Date(), type: 'project.created', actor: 'participant', projectId: project._id, result: 'ok', ipHash: 'unknown', meta: {} });
    } catch (error) {
      console.error('audit write failed', error);
    }
    const { editTokenHash, ...publicProject } = project;
    void editTokenHash;
    return { project: publicProject, editToken };
  }
}
