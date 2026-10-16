import { Body, Controller, Get, HttpCode, Inject, Post, Query } from '@nestjs/common';

import { PROJECT_SERVICE, type ProjectService } from './project-service';
import type { PublicProject } from './types';
import type { Submission } from './validation';

@Controller('projects')
export class ProjectsController {
  private readonly service: Pick<ProjectService, 'list' | 'create'>;

  constructor(@Inject(PROJECT_SERVICE) service: Pick<ProjectService, 'list' | 'create'>) {
    this.service = service;
  }

  @Get()
  async list(
    @Query('cursor') cursor?: string,
    @Query('origin') origin?: 'lovable' | 'base44',
    @Query('q') q?: string,
  ): Promise<Awaited<ReturnType<ProjectService['list']>>> {
    return this.service.list({ cursor, origin, q });
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() body: Submission,
  ): Promise<
    { project: PublicProject; editToken: string } | { error: { code: string; message: string } }
  > {
    const result = await this.service.create(body);
    if (result.ok) {
      return { project: result.project, editToken: result.editToken };
    }
    return { error: { code: result.code, message: result.message } };
  }
}
