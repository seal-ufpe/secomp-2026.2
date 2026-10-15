import { Body, Controller, Get, HttpCode, Inject, Post, Query } from '@nestjs/common';
import { PROJECT_SERVICE, type ProjectService } from './project-service';
import type { Submission } from './validation';

@Controller('projects')
export class ProjectsController {
  private readonly service: ProjectService;

  constructor(@Inject(PROJECT_SERVICE) service: ProjectService) { this.service = service; }

  @Get()
  async list(@Query('cursor') cursor?: string, @Query('origin') origin?: 'lovable' | 'base44', @Query('q') q?: string) {
    return this.service.list({ cursor, origin, q });
  }

  @Post()
  @HttpCode(201)
  async create(@Body() body: Submission) {
    const result = await this.service.create(body);
    return result.ok ? { project: result.project, editToken: result.editToken } : { error: { code: result.code, message: result.message } };
  }
}
