import type { INestApplication } from '@nestjs/common';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { configureApp } from '../../src/app.config';
import { AppModule } from '../../src/app.module';

export interface TestApp {
  app: INestApplication;
  http: ReturnType<typeof request>;
}

export async function createTestApp(): Promise<TestApp> {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
  await app.init();
  configureApp(app);
  await app.getHttpAdapter().getInstance().ready();
  return { app, http: request(app.getHttpServer()) };
}
